import { mockChats } from "./mockData";
import Handlebars from "handlebars";
import template from "./ChatList.hbs?raw";
import "./style.scss";
/** Временное решение для отображения списка чатов */
export class ChatListComponent {
  private element: HTMLElement;

  constructor(container: HTMLElement) {
    this.element = document.createElement("div");
    container.appendChild(this.element);
    this.render();
  }

  render() {
    const context = {
      chats: mockChats,
    };

    this.element.innerHTML = Handlebars.compile(template)(context);
  }
}
