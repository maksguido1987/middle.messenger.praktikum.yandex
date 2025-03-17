
interface ChatHeaderProps {
  avatar: string;
  name: string;
  status: string;
}

export class ChatHeader {
  private element: HTMLElement;

  constructor(private props: ChatHeaderProps) {
    this.element = document.createElement("div");
  }
}
