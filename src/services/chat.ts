import {HTTPClient} from '../core/HTTPClient';
import {UserProfileData} from './user';

export interface CreateChatData {
  title: string;
}

export interface ChatUserData {
  users: number[];
  chatId: number;
}

export interface ChatTokenData {
  token: string;
}

export interface ChatMessage {
  id: number;
  user_id: number;
  chat_id: number;
  time: string;
  type: string;
  content: string;
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
}

export interface ChatInfo {
  id: number;
  title: string;
  avatar: string;
  unread_count: number;
  last_message: ChatMessage | null;
}

export class ChatService {
  private readonly apiUrl = 'https://ya-praktikum.tech/api/v2';

  async getChats(): Promise<ChatInfo[]> {
    const response = await HTTPClient.get(`${this.apiUrl}/chats`);
    return JSON.parse(response.responseText);
  }

  async createChat(data: CreateChatData): Promise<{id: number}> {
    const response = await HTTPClient.post(`${this.apiUrl}/chats`, {
      data,
    });
    return JSON.parse(response.responseText);
  }

  async deleteChat(chatId: number): Promise<void> {
    await HTTPClient.delete(`${this.apiUrl}/chats`, {
      data: {chatId},
    });
  }

  async addUsers(data: ChatUserData): Promise<void> {
    await HTTPClient.put(`${this.apiUrl}/chats/users`, {
      data,
    });
  }

  async deleteUsers(data: ChatUserData): Promise<void> {
    await HTTPClient.delete(`${this.apiUrl}/chats/users`, {
      data,
    });
  }

  async getChatUsers(chatId: number): Promise<UserProfileData[]> {
    const response = await HTTPClient.get(`${this.apiUrl}/chats/${chatId}/users`);
    return JSON.parse(response.responseText);
  }

  async getChatToken(chatId: number): Promise<ChatTokenData> {
    const response = await HTTPClient.post(`${this.apiUrl}/chats/token/${chatId}`);
    return JSON.parse(response.responseText);
  }
}
