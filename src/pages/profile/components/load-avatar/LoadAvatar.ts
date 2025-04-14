import {Block} from '../../../../core/Block';
import {BlockProps} from '../../../../global-types';
import './style.scss';

interface LoadAvatarProps extends BlockProps {
  attributes: {
    avatar?: string;
  } & BlockProps['attributes'];
}

export class LoadAvatar extends Block {
  constructor(props: LoadAvatarProps = {attributes: {}}) {
    super({
      ...props,
      events: {
        change: (e: Event) => this._handleFileUpload(e),
      },
    });
  }

  private _handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      // Здесь можно добавить реальную логику загрузки файла на сервер
      // Сейчас используем моковые данные
      console.log('Загружен файл:', {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      // Создаем превью изображения
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('Превью изображения:', result.slice(0, 100) + '...');

        // В реальном приложении здесь можно обновить аватар через API
        this.setProps({
          avatar: result,
        });
      };
      reader.readAsDataURL(file);
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
