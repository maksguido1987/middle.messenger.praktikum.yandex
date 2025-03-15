import Handlebars from "handlebars";
import { Avatar } from "../../components/avatar/Avatar";
import "./style.scss";

// Регистрируем компоненты
Handlebars.registerHelper("Avatar", (options) => {
  return Avatar
    .replace("{{class}}", options.hash.class || "")
    .replace("{{#if size}}avatar--{{size}}{{/if}}", options.hash.size ? `avatar--${options.hash.size}` : "")
    .replace("{{#if src}}style=\"background-image: url('{{src}}');\"{{/if}}", options.hash.src ? `style="background-image: url('${options.hash.src}');"` : "")
    .replace("{{#unless src}}", options.hash.src ? "<!--" : "")
    .replace("{{/unless}}", options.hash.src ? "-->" : "")
    .replace("{{#if initials}}", options.hash.initials ? "" : "<!--")
    .replace("{{/if}}", options.hash.initials ? "" : "-->")
    .replace("{{initials}}", options.hash.initials || "");
});

// Шаблон страницы профиля
const profileTemplate = Handlebars.compile(`
  <div class="profile-container">
      <div class="profile-avatar-container">
          <div class="profile-avatar">
              {{{Avatar 
                  src=avatar 
                  size="large" 
                  class="profile-avatar__image"
              }}}
              <div class="profile-avatar__overlay">
                  <span class="profile-avatar__text">Поменять аватар</span>
                  <input type="file" class="profile-avatar__input" id="avatar-upload" accept="image/*">
              </div>
          </div>
          <div class="profile-name">{{displayName}}</div>
      </div>

      <form class="profile-form" id="profile-form">
          {{#if isPasswordChange}}
              <div class="profile-form__field">
                  <div class="profile-form__label">Старый пароль</div>
                  <div class="profile-form__value">
                      {{{Input 
                          type="password" 
                          id="oldPassword" 
                          name="oldPassword" 
                          required=true
                      }}}
                  </div>
              </div>
              <div class="profile-form__field">
                  <div class="profile-form__label">Новый пароль</div>
                  <div class="profile-form__value">
                      {{{Input 
                          type="password" 
                          id="newPassword" 
                          name="newPassword" 
                          required=true
                      }}}
                  </div>
              </div>
              <div class="profile-form__field">
                  <div class="profile-form__label">Повторите новый пароль</div>
                  <div class="profile-form__value">
                      {{{Input 
                          type="password" 
                          id="confirmPassword" 
                          name="confirmPassword" 
                          required=true
                      }}}
                  </div>
              </div>
              <div class="profile-actions">
                  {{{Button 
                      text="Сохранить изменения" 
                      type="submit" 
                      class="profile-actions__save"
                  }}}
              </div>
          {{else}}
              <div class="profile-form__field">
                  <div class="profile-form__label">Почта</div>
                  <div class="profile-form__value">
                      {{#if isEditing}}
                          {{{Input 
                              type="email" 
                              id="email" 
                              name="email" 
                              value=email 
                              required=true
                          }}}
                      {{else}}
                          <div class="profile-form__readonly">{{email}}</div>
                      {{/if}}
                  </div>
              </div>
              <div class="profile-form__field">
                  <div class="profile-form__label">Логин</div>
                  <div class="profile-form__value">
                      {{#if isEditing}}
                          {{{Input 
                              type="text" 
                              id="login" 
                              name="login" 
                              value=login 
                              required=true
                          }}}
                      {{else}}
                          <div class="profile-form__readonly">{{login}}</div>
                      {{/if}}
                  </div>
              </div>
              <div class="profile-form__field">
                  <div class="profile-form__label">Имя</div>
                  <div class="profile-form__value">
                      {{#if isEditing}}
                          {{{Input 
                              type="text" 
                              id="firstName" 
                              name="firstName" 
                              value=firstName 
                              required=true
                          }}}
                      {{else}}
                          <div class="profile-form__readonly">{{firstName}}</div>
                      {{/if}}
                  </div>
              </div>
              <div class="profile-form__field">
                  <div class="profile-form__label">Фамилия</div>
                  <div class="profile-form__value">
                      {{#if isEditing}}
                          {{{Input 
                              type="text" 
                              id="lastName" 
                              name="lastName" 
                              value=lastName 
                              required=true
                          }}}
                      {{else}}
                          <div class="profile-form__readonly">{{lastName}}</div>
                      {{/if}}
                  </div>
              </div>
              <div class="profile-form__field">
                  <div class="profile-form__label">Имя в чате</div>
                  <div class="profile-form__value">
                      {{#if isEditing}}
                          {{{Input 
                              type="text" 
                              id="displayName" 
                              name="displayName" 
                              value=displayName 
                              required=true
                          }}}
                      {{else}}
                          <div class="profile-form__readonly">{{displayName}}</div>
                      {{/if}}
                  </div>
              </div>
              <div class="profile-form__field">
                  <div class="profile-form__label">Телефон</div>
                  <div class="profile-form__value">
                      {{#if isEditing}}
                          {{{Input 
                              type="tel" 
                              id="phone" 
                              name="phone" 
                              value=phone 
                              required=true
                          }}}
                      {{else}}
                          <div class="profile-form__readonly">{{phone}}</div>
                      {{/if}}
                  </div>
              </div>

              {{#if isEditing}}
                  <div class="profile-actions">
                      {{{Button 
                          text="Сохранить изменения" 
                          type="submit" 
                          class="profile-actions__save"
                      }}}
                  </div>
              {{else}}
                  <div class="profile-links">
                      <div class="profile-links__item">
                          {{{Link 
                              text="Изменить данные" 
                              href="#" 
                              class="profile-links__edit"
                          }}}
                      </div>
                      <div class="profile-links__item">
                          {{{Link 
                              text="Изменить пароль" 
                              href="#" 
                              class="profile-links__password"
                          }}}
                      </div>
                      <div class="profile-links__item">
                          {{{Link 
                              text="Выйти" 
                              href="#" 
                              class="profile-links__logout"
                          }}}
                      </div>
                  </div>
              {{/if}}
          {{/if}}
      </form>
  </div>
`);

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
      phone: "+7 (909) 967 30 30"
    };

    this.render();
    this.addEventListeners();
  }

  private render() {
    this.container.innerHTML = profileTemplate({
      ...this.userData,
      isEditing: this.isEditing,
      isPasswordChange: this.isPasswordChange
    });
  }

  private addEventListeners() {
    // Обработчик изменения аватара
    const avatarInput = this.container.querySelector('#avatar-upload') as HTMLInputElement;
    if (avatarInput) {
      avatarInput.addEventListener('change', this.handleAvatarChange.bind(this));
    }

    // Обработчик формы
    const form = this.container.querySelector('#profile-form') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    // Обработчик ссылки "Изменить данные"
    const editLink = this.container.querySelector('.profile-links__edit') as HTMLAnchorElement;
    if (editLink) {
      editLink.addEventListener('click', this.handleEditClick.bind(this));
    }

    // Обработчик ссылки "Изменить пароль"
    const passwordLink = this.container.querySelector('.profile-links__password') as HTMLAnchorElement;
    if (passwordLink) {
      passwordLink.addEventListener('click', this.handlePasswordClick.bind(this));
    }

    // Обработчик ссылки "Выйти"
    const logoutLink = this.container.querySelector('.profile-links__logout') as HTMLAnchorElement;
    if (logoutLink) {
      logoutLink.addEventListener('click', this.handleLogoutClick.bind(this));
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
      const oldPassword = formData.get('oldPassword') as string;
      const newPassword = formData.get('newPassword') as string;
      const confirmPassword = formData.get('confirmPassword') as string;
      
      if (newPassword !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
      }
      
      // Здесь будет логика отправки запроса на изменение пароля
      console.log('Изменение пароля:', { oldPassword, newPassword });
      
      // Возвращаемся к обычному режиму просмотра
      this.isPasswordChange = false;
    } else if (this.isEditing) {
      // Обновляем данные пользователя
      this.userData = {
        ...this.userData,
        email: formData.get('email') as string,
        login: formData.get('login') as string,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        displayName: formData.get('displayName') as string,
        phone: formData.get('phone') as string
      };
      
      // Здесь будет логика отправки запроса на изменение данных
      console.log('Обновление данных:', this.userData);
      
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
    console.log('Выход из системы');
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
  isPasswordChange: false
}); 