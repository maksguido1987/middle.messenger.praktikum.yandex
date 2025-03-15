import Handlebars from "handlebars";
import template from "./ProfileInput.hbs?raw";
import "./style.scss";

interface ProfileInputProps {
  label: string;
  value: string;
  class?: string;
  name?: string;
  id?: string;
  isEditing?: boolean;
}
/** экспериментальный компонент */
export const ProfileInput = (props: ProfileInputProps): string => {
  return Handlebars.compile(template)(props);
};
