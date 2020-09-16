/** @noSelfInFile */

import {Component} from './didact';
import { stringify } from '../../utils/debug';

export interface InternalElement {
  type: string|Component;
  props: Props;
}

export type RawChild =
    InternalElement|string|boolean|null;

export type RenderableChildElement = InternalElement|string;

interface Props {
  key?: string;
  children?: InternalElement[];
  nodeValue?: string;
  [k: string]: any;
}

export const TEXT_ELEMENT = 'TEXT ELEMENT';

export function createElement(
    type: string|Component, config: Props, rawChildren?: RawChild[][]) {
  const props: Props = {...config};
  const flattenedChildren = rawChildren && rawChildren.length ? rawChildren.flat() as RawChild[] : [];
  props.children =
  flattenedChildren
    .filter((c): c is RenderableChildElement =>
        c != null && typeof c !== 'boolean' &&
        // filters out empty objects which are left because Array.flat() is not correct
        (typeof c !== 'string' && !!c.type))
    .map(c => typeof c === 'string' ? createTextElement(c) : c);

  // console.log('createElement', typeof type === 'string' ? type : 'Component', stringify(props, 1));
  // console.log('createElement .children', typeof type === 'string' ? type : 'Component', stringify(props.children, 1));
  return {type, props};
}

function createTextElement(value: string): InternalElement {
  return createElement(TEXT_ELEMENT, {nodeValue: value});
}
