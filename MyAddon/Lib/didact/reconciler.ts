import {Component, createPublicInstance} from './component';
import {InternalElement, TEXT_ELEMENT} from './element';
import {pascalCase, updateFrameProperties} from './wow-utils';

export interface Instance {
  publicInstance?: Component;
  childInstance: Instance|null;
  childInstances: Array<Instance|null>;
  hostFrame: WowFrame;
  element: InternalElement;
}

let rootInstance: Instance|null = null;

export function render(element: InternalElement, container: WowRegion) {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(container, prevInstance, element);
  rootInstance = nextInstance;
}

export function reconcile(
    parentFrame: WowRegion, instance: Instance|null,
    element: InternalElement|null): Instance|null {
  if (instance == null) {
    // Create instance
    return instantiate(element!, parentFrame);
  } else if (element == null) {
    // Remove instance
    cleanup(instance.hostFrame);
    return null;
  } else if (instance.element.type !== element.type) {
    // Replace instance
    const newInstance = instantiate(element, parentFrame);
    cleanup(instance.hostFrame);
    return newInstance;
  } else if (typeof element.type === 'string') {
    // Update dom instance
    updateFrameProperties(
        instance.hostFrame, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else if (instance.publicInstance) {
    // Update composite instance
    instance.publicInstance.props = element.props;
    const childElement = instance.publicInstance.render();
    const oldChildInstance = instance.childInstance;
    const childInstance =
        reconcile(parentFrame, oldChildInstance, childElement);

    if (!childInstance) {
      throw 'Failed to update composite instance';
    }

    instance.hostFrame = childInstance.hostFrame;
    instance.childInstance = childInstance;
    instance.element = element;
    return instance;
  } else {
    throw 'Reconciler catch all error';
  }
}

function cleanup(frame: WowRegion) {
  frame.Hide();
  (frame as any).SetParent(null);
}

function reconcileChildren(instance: Instance, element: InternalElement) {
  const hostFrame = instance.hostFrame;
  const childInstances = instance.childInstances;
  const nextChildElements = element.props.children || [];
  const newChildInstances = [];
  const count = Math.max(childInstances.length, nextChildElements.length);
  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];
    const newChildInstance = reconcile(hostFrame, childInstance, childElement);
    newChildInstances.push(newChildInstance);
  }
  return newChildInstances.filter(instance => instance != null);
}

function instantiate(
    element: InternalElement, parentFrame: WowRegion): Instance {
  const {type, props} = element;

  if (typeof type === 'string') {
    if (type === TEXT_ELEMENT) {
      throw 'Cannot create inline text, yet';
    }
    // Instantiate DOM element
    const frame = CreateFrame(
                      pascalCase(type) as WowFrameType,
                      props.name || undefined) as WowFrame;

    updateFrameProperties(frame, [], props);
    (frame as any).SetParent(parentFrame);

    const childElements = props.children || [];
    const childInstances =
        childElements.map(child => instantiate(child, frame));

    const instance: Instance =
        {hostFrame: frame, element, childInstances, childInstance: null};
    return instance;
  } else {
    // Instantiate component element
    const instance = {} as Instance;
    const publicInstance = createPublicInstance(element, instance);
    const childElement = publicInstance.render();
    const childInstance = instantiate(childElement, parentFrame);
    const hostFrame = childInstance.hostFrame;

    const updateProps:
        Partial<Instance> = {hostFrame, element, childInstance, publicInstance};
    Object.assign(instance, updateProps);
    return instance;
  }
}
