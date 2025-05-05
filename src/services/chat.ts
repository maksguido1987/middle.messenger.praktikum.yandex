import {HTTPClient} from '../core/HTTPClient';
import {UserData} from './auth';
import {UserProfileData} from './user';
export type {UserProfileData};

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

export interface DeleteChatResponse {
  userId: number;
  result: {
    id: number;
    title: string;
    avatar: string;
    created_by: number;
  };
}

export interface ChatMessage {
  user: UserData;
  time: string;
  content: string;
}

export interface ChatInfo {
  id: number;
  title: string;
  avatar: string;
  unread_count: number;
  created_by: number;
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

  async deleteChat(chatId: number): Promise<DeleteChatResponse> {
    const response = await HTTPClient.delete(`${this.apiUrl}/chats`, {
      data: {chatId},
    });
    return JSON.parse(response.responseText);
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
