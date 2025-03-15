import Handlebars from "handlebars";
import { Avatar } from "../../components/avatar/Avatar";
import "./style.scss";

// Регистрируем компоненты
Handlebars.registerHelper("Avatar", (options) => {
  return Avatar.replace("{{class}}", options.hash.class || "")
    .replace(
      "{{#if size}}avatar--{{size}}{{/if}}",
      options.hash.size ? `avatar--${options.hash.size}` : ""
    )
    .replace(
      "{{#if src}}style=\"background-image: url('{{src}}');\"{{/if}}",
      options.hash.src
        ? `style="background-image: url('${options.hash.src}');"`
        : ""
    )
    .replace("{{#unless src}}", options.hash.src ? "<!--" : "")
    .replace("{{/unless}}", options.hash.src ? "-->" : "")
    .replace("{{#if initials}}", options.hash.initials ? "" : "<!--")
    .replace("{{/if}}", options.hash.initials ? "" : "-->")
    .replace("{{initials}}", options.hash.initials || "");
});

// Шаблон страницы профиля
const profileTemplate = Handlebars.compile(``);

// Интерфейс для данных пользователя
interface UserData {
  avatar?: string;
  email: string;
  login: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone: string;
}

export class ProfilePage {
  private container: HTMLElement;
  private userData: UserData;
  private isEditing: boolean = false;
  private isPasswordChange: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;

    // Тестовые данные пользователя
    this.userData = {
      avatar: "",
      email: "pochta@yandex.ru",
      login: "ivanivanov",
      firstName: "Иван",
      lastName: "Иванов",
      displayName: "Иван",
      phone: "+7 (909) 967 30 30",
    };

    this.render();
    this.addEventListeners();
  }

  private render() {
    this.container.innerHTML = profileTemplate({
      ...this.userData,
      isEditing: this.isEditing,
      isPasswordChange: this.isPasswordChange,
    });
  }

  private addEventListeners() {
    // Обработчик изменения аватара
    const avatarInput = this.container.querySelector(
      "#avatar-upload"
    ) as HTMLInputElement;
    if (avatarInput) {
      avatarInput.addEventListener(
        "change",
        this.handleAvatarChange.bind(this)
      );
    }

    // Обработчик формы
    const form = this.container.querySelector(
      "#profile-form"
    ) as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", this.handleFormSubmit.bind(this));
    }

    // Обработчик ссылки "Изменить данные"
    const editLink = this.container.querySelector(
      ".profile-links__edit"
    ) as HTMLAnchorElement;
    if (editLink) {
      editLink.addEventListener("click", this.handleEditClick.bind(this));
    }

    // Обработчик ссылки "Изменить пароль"
    const passwordLink = this.container.querySelector(
      ".profile-links__password"
    ) as HTMLAnchorElement;
    if (passwordLink) {
      passwordLink.addEventListener(
        "click",
        this.handlePasswordClick.bind(this)
      );
    }

    // Обработчик ссылки "Выйти"
    const logoutLink = this.container.querySelector(
      ".profile-links__logout"
    ) as HTMLAnchorElement;
    if (logoutLink) {
      logoutLink.addEventListener("click", this.handleLogoutClick.bind(this));
    }
  }

  private handleAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.userData.avatar = e.target?.result as string;
        this.render();
        this.addEventListeners();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  private handleFormSubmit(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    if (this.isPasswordChange) {
      const oldPassword = formData.get("oldPassword") as string;
      const newPassword = formData.get("newPassword") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (newPassword !== confirmPassword) {
        alert("Пароли не совпадают");
        return;
      }

      // Здесь будет логика отправки запроса на изменение пароля
      console.log("Изменение пароля:", { oldPassword, newPassword });

      // Возвращаемся к обычному режиму просмотра
      this.isPasswordChange = false;
    } else if (this.isEditing) {
      // Обновляем данные пользователя
      this.userData = {
        ...this.userData,
        email: formData.get("email") as string,
        login: formData.get("login") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        displayName: formData.get("displayName") as string,
        phone: formData.get("phone") as string,
      };

      // Здесь будет логика отправки запроса на изменение данных
      console.log("Обновление данных:", this.userData);

      // Возвращаемся к режиму просмотра
      this.isEditing = false;
    }

    this.render();
    this.addEventListeners();
  }

  private handleEditClick(event: Event) {
    event.preventDefault();
    this.isEditing = true;
    this.isPasswordChange = false;
    this.render();
    this.addEventListeners();
  }

  private handlePasswordClick(event: Event) {
    event.preventDefault();
    this.isPasswordChange = true;
    this.isEditing = false;
    this.render();
    this.addEventListeners();
  }

  private handleLogoutClick(event: Event) {
    event.preventDefault();
    // Здесь будет логика выхода из системы
    console.log("Выход из системы");
  }
}

// Экспортируем шаблон для использования в других файлах
export const Profile = profileTemplate({
  avatar: "",
  email: "pochta@yandex.ru",
  login: "ivanivanov",
  firstName: "Иван",
  lastName: "Иванов",
  displayName: "Иван",
  phone: "+7 (909) 967 30 30",
  isEditing: false,
  isPasswordChange: false,
});
