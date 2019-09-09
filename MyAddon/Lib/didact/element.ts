/** @noSelfInFile */

import {Component} from './didact';

export interface InternalElement {
  type: string|Component;
  props: Props;
}

export type ChildElement = InternalElement|string|boolean|null;

interface Props {
  key?: string;
  children?: InternalElement[];
  nodeValue?: string;
  [k: string]: any;
}

export const TEXT_ELEMENT = 'TEXT ELEMENT';

export function createElement(
    type: string|Component, config: Props, children?: ChildElement[]) {
  const props: Props = {...config};
  const hasChildren = children && children.length > 0;
  const rawChildren = hasChildren ? [...children || []] : [];
  props.children =
      rawChildren
          .filter((c): c is InternalElement|string => c != null && c !== false)
          .map(c => typeof c === 'string' ? createTextElement(c) : c);
  return {type, props};
}

function createTextElement(value: string): InternalElement {
  return createElement(TEXT_ELEMENT, {nodeValue: value});
}
