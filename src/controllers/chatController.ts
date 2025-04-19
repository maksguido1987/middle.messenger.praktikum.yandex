import {ChatService, CreateChatData, ChatUserData} from '../services/chat';
import {store} from '../store/store';

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  async getChats(): Promise<void> {
    try {
      await this.chatService.getChats().then((chats) => {
        console.log(chats);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async createChat(data: CreateChatData): Promise<void> {
    try {
      await this.chatService.createChat(data).then((response) => {
        store.setState('chats', response);
        this.getChats();
      });
    } catch (error) {
      console.error(error);
    }
  }

  async deleteChat(chatId: number): Promise<void> {
    try {
      await this.chatService.deleteChat(chatId).then(() => {
        this.getChats();
      });
    } catch (error) {
      console.error(error);
    }
  }

  async addUsers(data: ChatUserData): Promise<void> {
    try {
      await this.chatService.addUsers(data).then(() => {
        this.getChats();
      });
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUsers(data: ChatUserData): Promise<void> {
    try {
      await this.chatService.deleteUsers(data).then(() => {
        this.getChats();
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getChatUsers(chatId: number): Promise<void> {
    try {
      await this.chatService.getChatUsers(chatId).then((users) => {
        console.log(users);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getChatToken(chatId: number): Promise<void> {
    try {
      await this.chatService.getChatToken(chatId).then((tokenData) => {
        console.log(tokenData);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
