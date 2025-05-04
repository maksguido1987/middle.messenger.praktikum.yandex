import {Block} from '../../../../core/Block';
import {BlockProps} from '../../../../global-types';
import {UserController} from '../../../../controllers/userController';
import './style.scss';

interface LoadAvatarProps extends BlockProps {
  state: {
    avatar?: string;
  } & BlockProps['state'];
}

export class LoadAvatar extends Block {
  private userController: UserController;

  constructor(props: LoadAvatarProps) {
    super({
      ...props,
      events: {
        change: (e: Event) => this._handleFileUpload(e),
      },
    });
    this.userController = new UserController();
  }

  private async _handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        await this.userController.updateAvatar(formData);
      } catch (error) {
        console.error('Ошибка при загрузке аватара:', error);
      }
    }
  }

  render() {
    const {avatar} = this.state;

    return `
      <div class="profile-avatar">
        <div class="avatar avatar--large profile-avatar__image"
          style="${avatar ? `background-image: url('https://ya-praktikum.tech/api/v2/resources/${avatar}');` : ''}">
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
