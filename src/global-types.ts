import {Block} from './core/Block';

export const enum EmitEvents {
  INIT = 'init',
  FLOW_CDM = 'flow:component-did-mount',
  FLOW_RENDER = 'flow:render',
  FLOW_CDU = 'flow:component-did-update',
  FLOW_CWU = 'flow:component-will-unmount',
}

export type Events = Partial<{
  [K in keyof HTMLElementEventMap]: (event: HTMLElementEventMap[K]) => void;
}>;
export type Children = Record<string, Block>;
export type Attributes = Record<string, unknown>;
export type List = Record<string, (Block | string)[]>;

export interface BlockProps {
  children?: Children;
  events?: Events;
  attributes?: Attributes;
  state?: Record<string, unknown>;
  list?: List;
}
