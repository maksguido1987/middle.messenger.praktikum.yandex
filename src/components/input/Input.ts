import {BlockProps} from '../../global-types';
import {Block} from '../../core/Block';
import {FieldConfig, defaultValidationConfig} from '../../core/validation';
import './style.scss';

interface InputProps extends Omit<BlockProps, 'attributes'> {
  attributes: {
    id: string;
    name: string;
    validationConfig?: FieldConfig;
    type?: string;
  } & BlockProps['attributes'];
}

export class Input extends Block {
  private validationConfig: FieldConfig | null = null;

  constructor(props: InputProps) {
    super({
      ...props,
      events: {
        ...props.events,
        blur: () => this.validate(),
      },
    });

    this.validationConfig =
      props.attributes.validationConfig ||
      (props.attributes.type === 'password'
        ? defaultValidationConfig.password
        : defaultValidationConfig[props.attributes.name]) ||
      null;
  }

  /** Валидация в некоторых случаях работает на событие focus. Не хватило времени, чтобы найти причину
   * @return {boolean}
   */
  private validate(): boolean {
    if (!this.validationConfig) return true;

    const input = this.element as HTMLInputElement;
    if (!input) return true;

    const value = input.value;
    let isValid = true;
    let errorMessage = '';

    for (const rule of this.validationConfig.rules) {
      let ruleValid = true;

      switch (rule.type) {
        case 'required':
          ruleValid = value.trim() !== '';
          break;
        case 'minLength':
          ruleValid = value.length >= (rule.value as number);
          break;
        case 'maxLength':
          ruleValid = value.length <= (rule.value as number);
          break;
        case 'pattern':
          ruleValid = (rule.value as RegExp).test(value);
          break;
        case 'email':
          ruleValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          break;
        case 'phone':
          ruleValid = /^\+?[0-9]{10,15}$/.test(value.replace(/[^0-9]/g, ''));
          break;
      }

      if (!ruleValid) {
        isValid = false;
        errorMessage = rule.message;
        break;
      }
    }

    this.updateFieldUI(input, isValid, errorMessage);
    return isValid;
  }

  private updateFieldUI(input: HTMLInputElement, isValid: boolean, errorMessage: string): void {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    const errorElement =
      formGroup.querySelector('.validate-error') || document.createElement('small');
    errorElement.className = 'validate-error';
    if (!formGroup.contains(errorElement)) {
      formGroup.appendChild(errorElement);
    }

    input.classList.toggle('error', !isValid);
    errorElement.textContent = isValid ? '' : errorMessage;
  }

  render() {
    return `
        <input
          class="input {{class}}"
          id="{{id}}"
          name="{{name}}" />
    `;
  }
}
