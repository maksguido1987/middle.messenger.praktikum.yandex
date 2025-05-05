import {Block} from '../../core/Block';
import {BlockProps} from '../../global-types';
import './style.scss';

interface AvatarProps extends BlockProps {
  state: {
    src?: string;
  };
}

export class Avatar extends Block {
  constructor(props: AvatarProps) {
    super({
      ...props,
      state: {
        ...props.state,
      },
    });
  }

  render() {
    const {src} = this.state;
    const placeholder = '/images/placeholder_50x50.png';
    return `
      <div class="avatar">
        <img src="${src ? `https://ya-praktikum.tech/api/v2/resources/${src}` : placeholder}" width="47" height="47" alt="avatar" />
      </div>
    `;
  }
}
