export type ValidationRule = {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'phone';
  value?: number | RegExp;
  message: string;
};

export type FieldConfig = {
  name: string;
  rules: ValidationRule[];
};

export const defaultValidationConfig: Record<string, FieldConfig> = {
  first_name: {
    name: 'first_name',
    rules: [
      {
        type: 'required',
        message: 'Имя обязательно',
      },
      {
        type: 'pattern',
        value: /^[A-ZА-Я][a-zа-я-]*$/,
        message: 'Имя должно начинаться с заглавной буквы и содержать только буквы и дефис',
      },
    ],
  },
  second_name: {
    name: 'second_name',
    rules: [
      {
        type: 'required',
        message: 'Фамилия обязательна',
      },
      {
        type: 'pattern',
        value: /^[A-ZА-Я][a-zа-я-]*$/,
        message: 'Фамилия должна начинаться с заглавной буквы и содержать только буквы и дефис',
      },
    ],
  },
  login: {
    name: 'login',
    rules: [
      {
        type: 'required',
        message: 'Логин обязателен',
      },
      {
        type: 'minLength',
        value: 3,
        message: 'Логин должен быть не менее 3 символов',
      },
      {
        type: 'maxLength',
        value: 20,
        message: 'Логин должен быть не более 20 символов',
      },
      {
        type: 'pattern',
        value: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]+$/,
        message:
          'Логин должен содержать хотя бы одну букву и может содержать цифры, дефис и нижнее подчеркивание',
      },
    ],
  },
  password: {
    name: 'password',
    rules: [
      {
        type: 'required',
        message: 'Пароль обязателен',
      },
      {
        type: 'minLength',
        value: 8,
        message: 'Пароль должен быть не менее 8 символов',
      },
      {
        type: 'maxLength',
        value: 40,
        message: 'Пароль должен быть не более 40 символов',
      },
      {
        type: 'pattern',
        value: /^(?=.*[A-Z])(?=.*\d).+$/,
        message: 'Пароль должен содержать хотя бы одну заглавную букву и цифру',
      },
    ],
  },
  email: {
    name: 'email',
    rules: [
      {
        type: 'required',
        message: 'Email обязателен',
      },
      {
        type: 'pattern',
        value: /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
        message: 'Введите корректный email',
      },
    ],
  },
  phone: {
    name: 'phone',
    rules: [
      {
        type: 'required',
        message: 'Телефон обязателен',
      },
      {
        type: 'pattern',
        value: /^\+?\d{10,15}$/,
        message: 'Телефон должен содержать от 10 до 15 цифр и может начинаться с +',
      },
    ],
  },
  message: {
    name: 'message',
    rules: [
      {
        type: 'required',
        message: 'Сообщение не должно быть пустым',
      },
    ],
  },
};
