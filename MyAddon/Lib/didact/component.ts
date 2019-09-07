import {InternalElement} from './element';
import {Instance, reconcile} from './reconciler';

export class Component<P = {}, S = {}> {
  public state: S = {} as any;
  constructor(public props: P = {} as any) {}

  private __internalInstance!: Instance;

  setState(partialState: Partial<S>) {
    this.state = Object.assign({}, this.state, partialState);
    updateInstance(this.__internalInstance);
  }

  render(): InternalElement|null {
    throw 'render not implemented';
  }
}

function updateInstance(internalInstance: Instance) {
  const parentDom = internalInstance.hostFrame.GetParent();
  const element = internalInstance.element;
  if (parentDom) {
    reconcile(parentDom, internalInstance, element);
  } else {
    throw 'Tried to reconcile instance with no dom.parentDom';
  }
}

export function createPublicInstance(
    element: InternalElement, internalInstance: Instance) {
  const {type: ComponentType, props} = element;
  if (typeof ComponentType !== 'string') {
    const publicInstance = new (ComponentType as any)(props);
    publicInstance.__internalInstance = internalInstance;
    return publicInstance;
  } else {
    throw 'Tried createPublicInstance(string)';
  }
}
