import {EventBus} from '../core/EventBus';
import {store} from '../store/store';

type WebSocketMessage = {
  type: string;
  [key: string]: unknown;
};

export type Messages = {
  chat_id: number;
  id: number;
  time: string;
  type: 'message' | 'file';
  user_id: string;
  content: string;
  is_read: boolean;
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
}[];

// type Message = {
//   id: number;
//   time: string;
//   user_id: number;
//   content: string;
//   type: 'message';
// };

type ConnectionParams = {
  userId: string;
  chatId: string;
  token: string;
};

export class WebSocketController extends EventBus {
  private static instance: WebSocketController;
  private socket: WebSocket | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private readonly PING_INTERVAL = 15000; // 15 секунд
  private currentConnectionParams: ConnectionParams | null = null;

  private constructor() {
    super();
  }

  public static getInstance(): WebSocketController {
    if (!WebSocketController.instance) {
      WebSocketController.instance = new WebSocketController();
    }
    return WebSocketController.instance;
  }

  private hasConnectionParamsChanged(newParams: ConnectionParams): boolean {
    if (!this.currentConnectionParams) {
      return true;
    }

    return (
      this.currentConnectionParams.userId !== newParams.userId ||
      this.currentConnectionParams.chatId !== newParams.chatId ||
      this.currentConnectionParams.token !== newParams.token
    );
  }

  public connect(params: ConnectionParams): void {
    if (this.hasConnectionParamsChanged(params)) {
      this.close();
      this.currentConnectionParams = params;
    } else if (this.socket) {
      return;
    }

    this.socket = new WebSocket(
      `wss://ya-praktikum.tech/ws/chats/${params.userId}/${params.chatId}/${params.token}`,
    );

    this.socket.addEventListener('open', () => {
      this.startPing();
      this.send({type: 'get old', content: '0'});
      this.emit('connected');
    });

    this.socket.addEventListener('close', (event) => {
      if (event?.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
      }

      console.log(`Код: ${event?.code} | Причина: ${event?.reason}`);
      this.stopPing();
      this.emit('closed');
    });

    this.socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);

        if (Array.isArray(data)) {
          store.setState('chats.messages', data.reverse());
        }

        if (data.type === 'message') {
          const currentChat = store.state.chats.currentChat;
          store.setState('chats.currentChat', {
            ...currentChat,
            last_message: {
              ...currentChat?.last_message,
              content: data.content,
            },
          });
          store.setState('chats.messages', [
            ...store.state.chats.messages,
            data,
          ]);
          store.setState('chats.filtered', store.state.chats.filtered.map((chat) => {
            if (chat.id === currentChat?.id) {
              return {
                ...chat,
                last_message: {
                  ...chat.last_message,
                  content: data.content,
                },
              };
            }
            return chat;
          }));

          this.emit('message', data);
        }

        // if (data.type === 'get old') {
        //   this.emit('old messages', data);
        // }
      } catch (error) {
        console.error('Ошибка при обработке сообщения:', error);
      }
    });

    this.socket.addEventListener('error', (error) => {
      this.emit('error', error);
    });
  }

  public send(message: WebSocketMessage): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket соединение закрыто');
    }

    this.socket.send(JSON.stringify(message));
  }

  public close(): void {
    if (this.socket) {
      this.stopPing();
      this.socket.close();
      this.socket = null;
    }
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      this.send({type: 'ping'});
    }, this.PING_INTERVAL);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}

export const webSocketController = WebSocketController.getInstance();
