import Handlebars from "handlebars";
import { Button } from "./components/button/Button";
import { Input } from "./components/input/Input";

export class App {
  private rootElement: HTMLElement;

  constructor(rootSelector: string) {
    const root = document.querySelector(rootSelector);

    if (!root) {
      throw new Error(`Элемент с селектором "${rootSelector}" не найден`);
    }

    this.rootElement = root as HTMLElement;

    // Регистрируем компоненты в Handlebars
    Handlebars.registerPartial("Button", Button);
    Handlebars.registerPartial("Input", Input);
  }

  private render() {
    const template = `
      <div class="app-container">
        <h1>Тестовое приложение</h1>
        <div class="form-group">
          {{{Input label="Имя пользователя" id="username" name="username" type="text" required=true}}}
        </div>
        <div class="form-group">
          {{{Input label="Электронная почта" id="email" name="email" type="email" required=true}}}
        </div>
        <div class="form-group">
          {{{Input label="Пароль" id="password" name="password" type="password" required=true}}}
        </div>
        <div class="form-actions">
          {{{Button text="Отправить" type="submit" class="submit-button"}}}
        </div>
      </div>
    `;

    const compiledTemplate = Handlebars.compile(template);
    this.rootElement.innerHTML = compiledTemplate({});

    this.addEventListeners();
  }

  private addEventListeners() {
    const form = this.rootElement.querySelector(
      ".app-container"
    ) as HTMLElement;

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Форма отправлена");
      });
    }
  }

  public init() {
    this.render();
    console.log("Приложение инициализировано");
  }
}
