import Handlebars from "handlebars";
import template from "./Chat.hbs?raw";
import "./style.scss";

interface ChatProps {
  chats?: Array<{
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
  }>;
  chatHeader: {
    avatar: string;
    name: string;
    status: string;
  };
  chatSearch: {
    placeholder: string;
    events: {
      input: (e: Event) => void;
    };
  };
  chatList: {
    chats: Array<{
      id: string;
      name: string;
      lastMessage: string;
      time: string;
      unreadCount?: number;
    }>;
    events: {
      click: (e: Event) => void;
    };
  };
  chatInput: {
    placeholder: string;
    events: {
      submit: (e: Event) => void;
    };
  };
}

export class Chat {
  private props: ChatProps;
  private element: HTMLElement | null = null;

  constructor(props: ChatProps) {
    this.props = {
      ...props,
      chatHeader: {
        avatar: "https://via.placeholder.com/40",
        name: "Иван Иванов",
        status: "онлайн",
      },
      chatSearch: {
        placeholder: "Поиск",
        events: {
          input: (e: Event) => {
            const target = e.target as HTMLInputElement;
            console.log("Search:", target.value);
          },
        },
      },
      chatList: {
        chats: props.chats || [],
        events: {
          click: (e: Event) => {
            const target = e.target as HTMLElement;
            const chatItem = target.closest(".chat-item");
            if (chatItem) {
              const chatId = chatItem.getAttribute("data-chat-id");
              console.log("Selected chat:", chatId);
            }
          },
        },
      },
      chatInput: {
        placeholder: "Сообщение",
        events: {
          submit: (e: Event) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.querySelector("input") as HTMLInputElement;
            if (input.value.trim()) {
              console.log("Send message:", input.value);
              input.value = "";
            }
          },
        },
      },
    };
  }

  render() {
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate(this.props);

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    this.element = wrapper.firstElementChild as HTMLElement;

    return this.element;
  }

  getElement() {
    return this.element;
  }
}
