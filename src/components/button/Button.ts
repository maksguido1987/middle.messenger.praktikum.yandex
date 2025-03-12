import Handlebars from "handlebars";
import "./button.scss";

interface ButtonProps {
  text: string;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

const template = `
    <button class="button {{className}}" type="{{type}}">
        {{text}}
    </button>
`;

export class Button {
  private props: ButtonProps;

  constructor(props: ButtonProps) {
    this.props = {
      text: props.text,
      className: props.className || "",
      type: props.type || "button",
      onClick: props.onClick,
    };
  }

  render() {
    const compiledTemplate = Handlebars.compile(template);
    const element = document.createElement("div");
    element.innerHTML = compiledTemplate(this.props);

    const button = element.firstElementChild as HTMLButtonElement;

    if (this.props.onClick) {
      button.addEventListener("click", this.props.onClick);
    }

    return button;
  }
}
