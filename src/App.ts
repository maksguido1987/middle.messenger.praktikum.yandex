import Handlebars from "handlebars";
import { Button, Input, FormTitle, Link, Avatar } from "./components";
import { Login, Signin, Chat, Profile, EditPassword } from "./pages";
import {
  AttachButton,
  ChatHeader,
  ChatInput,
  ChatItem,
  ChatList,
  ChatSearch,
} from "./pages/chat/components";
import { ChatListComponent } from "./pages/chat/components/chat-list/ChatList";
import { LoadAvatar, ProfileInput } from "./pages/profile/components";

Handlebars.registerPartial("Button", Button);
Handlebars.registerPartial("Input", Input);
Handlebars.registerPartial("FormTitle", FormTitle);
Handlebars.registerPartial("Link", Link);
Handlebars.registerPartial("Avatar", Avatar);
Handlebars.registerPartial("ChatSearch", ChatSearch);
Handlebars.registerPartial("ChatList", ChatList);
Handlebars.registerPartial("ChatItem", ChatItem);
Handlebars.registerPartial("ChatHeader", ChatHeader);
Handlebars.registerPartial("ChatInput", ChatInput);
Handlebars.registerPartial("AttachButton", AttachButton);
Handlebars.registerPartial("ProfileInput", ProfileInput);
Handlebars.registerPartial("LoadAvatar", LoadAvatar);
Handlebars.registerPartial("EditPassword", EditPassword);

export class App {
  private rootElement: HTMLElement;

  constructor(rootSelector: string) {
    const root = document.getElementById(rootSelector);

    if (!root) {
      throw new Error(`Элемент с селектором "${rootSelector}" не найден`);
    }

    this.rootElement = root as HTMLElement;
  }

  private render() {
    const location = window.location.pathname;

    switch (location) {
      case "/signin":
        this.rootElement.innerHTML = Handlebars.compile(Signin)({});
        break;
      case "/login":
        this.rootElement.innerHTML = Handlebars.compile(Login)({});
        break;
      case "/profile":
        this.rootElement.innerHTML = Handlebars.compile(Profile)({
          displayName: "Иванов Иван",
          email: "ivanov@yandex.ru",
          login: "ivanov",
          firstName: "Иван",
          lastName: "Иванов",
          phone: "+7 (909) 967 30 30",
          isEditing: false,
          isPasswordChange: false,
        });
        break;
      default:
        this.rootElement.innerHTML = Handlebars.compile(Chat)({});
    }

    this.addEventListeners();

    // Инициализация компонентов после рендеринга
    if (location === "/" || location === "/chat") {
      this.initChatComponents();
    }
  }

  private initChatComponents() {
    const chatListContainer = this.rootElement.querySelector(".chat-list");
    if (chatListContainer) {
      new ChatListComponent(chatListContainer as HTMLElement);
    }
  }

  private addEventListeners() {
    const form = this.rootElement.querySelector(
      ".form-container"
    ) as HTMLElement;

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
      });
    }

    // const links = this.rootElement.querySelectorAll(".link");

    // links.forEach((link) => {
    //   link.addEventListener("click", (e) => {
    //     e.preventDefault();
    //   });
    // });
  }

  public init() {
    this.render();
  }
}
