import Handlebars from "handlebars";
import { Button, Input, FormTitle, Link, Avatar } from "./components";
import { Login, Signin, Chat } from "./pages";
import { ChatItem, ChatList, ChatSearch } from "./pages/chat/components";
import { ChatListComponent } from "./pages/chat/components/chat-list/ChatList";

Handlebars.registerPartial("Button", Button);
Handlebars.registerPartial("Input", Input);
Handlebars.registerPartial("FormTitle", FormTitle);
Handlebars.registerPartial("Link", Link);
Handlebars.registerPartial("Avatar", Avatar);
Handlebars.registerPartial("ChatSearch", ChatSearch);
Handlebars.registerPartial("ChatList", ChatList);
Handlebars.registerPartial("ChatItem", ChatItem);

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
    let template: HandlebarsTemplateDelegate<any>;

    const location = window.location.pathname;

    switch (location) {
      case "/signin":
        template = Handlebars.compile(Signin);
        break;
      case "/login":
        template = Handlebars.compile(Login);
        break;
      default:
        template = Handlebars.compile(Chat);
    }

    this.rootElement.innerHTML = template({});

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
