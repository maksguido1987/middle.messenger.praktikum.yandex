import Handlebars from "handlebars";
import { Button, Input, FormTitle, Link } from "./components";
import { Login, Signin } from "./pages";

Handlebars.registerPartial("Button", Button);
Handlebars.registerPartial("Input", Input);
Handlebars.registerPartial("FormTitle", FormTitle);
Handlebars.registerPartial("Link", Link);

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
    const template = Handlebars.compile(Login);
    this.rootElement.innerHTML = template({});

    this.addEventListeners();
  }

  private addEventListeners() {
    const form = this.rootElement.querySelector(
      ".app-container"
    ) as HTMLElement;

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
      });
    }
  }

  public init() {
    this.render();
  }
}
