// import Handlebars from "handlebars";
import "./button.scss";

// interface ButtonProps {
//   text: string;
//   class?: string;
//   type?: "button" | "submit";
//   onClick?: () => void;
// }

export const Button = `
    <button class="button {{class}}" type="{{type}}">
        {{text}}
    </button>
`;

// export class Button {
//   private props: ButtonProps;

//   constructor(props: ButtonProps) {
//     this.props = {
//       text: props.text,
//       class: props.class || "",
//       type: props.type || "button",
//       onClick: props.onClick,
//     };
//   }

//   render() {
//     const compiledTemplate = Handlebars.compile(template);
//     const element = document.createElement("div");
//     element.innerHTML = compiledTemplate(this.props);

//     const button = element.firstElementChild as HTMLButtonElement;

//     if (this.props.onClick) {
//       button.addEventListener("click", this.props.onClick);
//     }

//     return button;
//   }
// }
