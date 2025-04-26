import {Block} from '../../core/Block';
import {BlockProps} from '../../global-types';
import './style.scss';

interface AvatarProps extends BlockProps {
  attributes: {
    avatar?: string;
    src?: string;
    size?: 'small' | 'medium' | 'large';
  }
}

export class Avatar extends Block {
  constructor(props: AvatarProps = {attributes: {}}) {
    super({
      ...props,
      attributes: {
        size: 'medium',
        ...props.attributes,
      },
    });
  }

  render() {
    const {src, size} = this.attributes;

    return `
      <div class="avatar avatar--${size}" style="${src ? `background-image: url('${src}');` : ''}">
      </div>
    `;
  }
}
