import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';

@Injectable()
export class ChatsService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  private buildMemberStates(memberIds: string[]) {
    return memberIds.map((memberId) => ({
      user_id: memberId,
      unread_count: 0,
      is_pinned: false,
      is_archived: false,
    }));
  }

  async create(memberIds: string[]): Promise<ChatDocument> {
    const newChat = new this.chatModel({
      members: memberIds,
      member_states: this.buildMemberStates(memberIds),
    });
    return newChat.save();
  }

  async findOrCreate1to1Chat(user1: string, user2: string): Promise<ChatDocument> {
    const id1 = new Types.ObjectId(user1);
    const id2 = new Types.ObjectId(user2);
    
    const existing = await this.chatModel.findOne({
      members: { $all: [id1, id2] },
      is_group: { $ne: true },
    }).sort({ updatedAt: -1 }).exec();

    if (existing) return existing;

    const newChat = new this.chatModel({
      members: [id1, id2],
      member_states: this.buildMemberStates([user1, user2]),
      is_group: false,
    });
    return newChat.save();
  }

  async findByUser(userId: string): Promise<any[]> {
    const userObjectId = new Types.ObjectId(userId);
    const chats = await this.chatModel.find({ members: userObjectId })
      .populate('members', 'full_name username email status last_seen')
      .populate({
        path: 'last_message',
        select: 'content createdAt sender_id reply_to_message_id',
        populate: {
          path: 'reply_to_message_id',
          select: 'content sender_id',
        },
      })
      .sort({ 'member_states.is_pinned': -1, updatedAt: -1 })
      .lean()
      .exec();

    const seen1to1 = new Set<string>();

    return chats
      .map((chat: any) => {
        const memberState = (chat.member_states || []).find(
          (state: any) => state.user_id?.toString() === userId.toString(),
        );

        return {
          ...chat,
          _id: chat._id.toString(),
          unread_count: memberState?.unread_count || 0,
          is_pinned: memberState?.is_pinned || false,
          is_archived: memberState?.is_archived || false,
        };
      })
      .filter((chat: any) => {
        if (chat.is_archived) return false;
        if (!chat.is_group && Array.isArray(chat.members) && chat.members.length === 2) {
          const m1 = chat.members[0]?._id?.toString() || chat.members[0]?.toString();
          const m2 = chat.members[1]?._id?.toString() || chat.members[1]?.toString();
          if (m1 && m2) {
            const pairKey = [m1, m2].sort().join('_');
            if (seen1to1.has(pairKey)) {
              return false; // deduplicate older/duplicate 1-to-1 threads
            }
            seen1to1.add(pairKey);
          }
        }
        return true;
      });
  }

  async findById(chatId: string): Promise<ChatDocument | null> {
    return this.chatModel.findById(chatId).populate('members').exec();
  }

  async updateLastMessage(chatId: string, messageId: string): Promise<void> {
    await this.chatModel.findByIdAndUpdate(chatId, { last_message: messageId }).exec();
  }

  async incrementUnreadForRecipients(chatId: string, senderId: string): Promise<void> {
    await this.chatModel.updateOne(
      { _id: new Types.ObjectId(chatId) },
      { $inc: { 'member_states.$[state].unread_count': 1 } },
      {
        arrayFilters: [{ 'state.user_id': { $ne: new Types.ObjectId(senderId) } }],
      },
    ).exec();
  }

  async resetUnreadCount(chatId: string, userId: string): Promise<void> {
    await this.chatModel.updateOne(
      { _id: new Types.ObjectId(chatId) },
      { $set: { 'member_states.$[state].unread_count': 0 } },
      {
        arrayFilters: [{ 'state.user_id': new Types.ObjectId(userId) }],
      },
    ).exec();
  }

  async updateMemberMeta(chatId: string, userId: string, meta: { isPinned?: boolean; isArchived?: boolean }): Promise<void> {
    const setData: Record<string, boolean> = {};
    if (typeof meta.isPinned === 'boolean') setData['member_states.$[state].is_pinned'] = meta.isPinned;
    if (typeof meta.isArchived === 'boolean') setData['member_states.$[state].is_archived'] = meta.isArchived;
    if (Object.keys(setData).length === 0) return;

    await this.chatModel.updateOne(
      { _id: new Types.ObjectId(chatId) },
      { $set: setData },
      {
        arrayFilters: [{ 'state.user_id': new Types.ObjectId(userId) }],
      },
    ).exec();
  }

  async delete(chatId: string): Promise<void> {
    await this.chatModel.findByIdAndDelete(new Types.ObjectId(chatId)).exec();
  }

  async isMember(chatId: string, userId: string): Promise<boolean> {
    const chat = await this.chatModel.findOne({
      _id: new Types.ObjectId(chatId),
      members: new Types.ObjectId(userId),
    }).exec();
    return !!chat;
  }
}
