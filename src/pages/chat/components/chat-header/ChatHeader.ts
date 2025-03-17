interface ChatHeaderProps {
  avatar: string;
  name: string;
  status: string;
}

/**
 * Класс компонента заголовка чата
 */
export class ChatHeader {
  private element: HTMLElement;

  /**
   * Создает экземпляр компонента заголовка чата
   * @param {ChatHeaderProps} props - Свойства компонента
   */
  constructor(private props: ChatHeaderProps) {
    this.element = document.createElement('div');
  }
}
