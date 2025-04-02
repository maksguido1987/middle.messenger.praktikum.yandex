import {LoginPage} from './pages/login/LoginPage';

/**
 * Основной класс приложения для управления маршрутизацией и рендерингом
 */
export class App {
  private rootElement: HTMLElement;

  /**
   * Создает экземпляр приложения
   * @param {string} rootSelector - CSS селектор корневого элемента
   */
  constructor(rootSelector: string) {
    const root = document.getElementById(rootSelector);

    if (!root) {
      throw new Error(`Элемент с селектором "${rootSelector}" не найден`);
    }

    this.rootElement = root as HTMLElement;
  }

  /**
   * Рендерит компоненты в зависимости от текущего маршрута
   */
  private render() {
    this.rootElement.replaceWith(new LoginPage().getContent());
  }

  /**
   * Инициализирует приложение
   */
  public init() {
    this.render();
  }
}
