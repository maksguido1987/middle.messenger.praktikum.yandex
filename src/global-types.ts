import {Block} from './core/Block';

export const enum EmitEvents {
  INIT = 'init',
  FLOW_CDM = 'flow:component-did-mount',
  FLOW_RENDER = 'flow:render',
  FLOW_CDU = 'flow:component-did-update',
}

export type Events = Partial<{
  [K in keyof HTMLElementEventMap]: (event: HTMLElementEventMap[K]) => void;
}>;
export type Children = Record<string, Block>;
export type Attributes = {
  [K in keyof HTMLElement]?: HTMLElement[K] extends string ? string : never;
} & Record<string, unknown>;

export interface BlockProps {
  children?: Children;
  events?: Events;
  attributes?: Attributes;
  state?: Record<string, unknown>;
  customValues?: Record<string, unknown>;
}
