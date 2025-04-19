import {Block} from '../../../../core/Block';
import {BlockProps} from '../../../../global-types';
import {UserController} from '../../../../controllers/userController';
import './style.scss';

interface LoadAvatarProps extends BlockProps {
  attributes: {
    avatar?: string;
  } & BlockProps['attributes'];
}

export class LoadAvatar extends Block {
  private userController: UserController;

  constructor(props: LoadAvatarProps = {attributes: {}}) {
    super({
      ...props,
      events: {
        change: (e: Event) => this._handleFileUpload(e),
      },
    });
    this.userController = new UserController();
  }

  private _handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      this.userController
        .updateAvatar(formData)
        .then(() => {
          // Создаем превью изображения для отображения
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            this.setProps({
              avatar: result,
            });
          };
          reader.readAsDataURL(file);
        })
        .catch((error) => {
          console.error('Ошибка при загрузке аватара:', error);
        });
    }
  }

  render() {
    const {avatar} = this.attributes;

    return `
      <div class="profile-avatar">
        <div class="avatar avatar--large profile-avatar__image"
             style="${avatar ? `background-image: url('${avatar}');` : ''}">
        </div>
        <div class="profile-avatar__overlay">
          <span class="profile-avatar__text">Поменять аватар</span>
          <input
            type="file"
            class="profile-avatar__input"
            id="avatar-upload"
            accept="image/*"
          />
        </div>
      </div>
    `;
  }
}
