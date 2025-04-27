import {Block} from '../../core/Block';
import {BlockProps} from '../../global-types';
import './style.scss';

interface AvatarProps extends BlockProps {
  state: {
    src?: string;
    size?: 'small' | 'medium' | 'large';
  };
}

export class Avatar extends Block {
  constructor(props: AvatarProps) {
    super({
      ...props,
      state: {
        size: 'medium',
        ...props.state,
      },
    });
  }

  render() {
    const { src, size } = this.state;

    return `
      <div class="avatar avatar--${size}" style="${src ? `background-image: url('https://ya-praktikum.tech/api/v2/resources/${src}');` : ''}">
      </div>
    `;
  }
}
