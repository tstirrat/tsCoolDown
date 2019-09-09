import {Component} from './component';
import {InternalElement, TEXT_ELEMENT} from './element';
import {cleanupFrame, createFrame, updateFrameProperties} from './wow-utils';

export interface Instance {
  publicInstance?: Component;
  childInstance: Instance|null;
  childInstances: Array<Instance|null>;
  hostFrame: WowRegion;
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
  if (!instance) {
    // Create instance
    return instantiate(
        assert(element, 'element should not be null'), parentFrame);
  } else if (!element) {
    // Remove instance
    cleanupFrame(instance.hostFrame);
    return null;
  } else if (instance.element.type !== element.type) {
    // Replace instance
    const newInstance = instantiate(element, parentFrame);
    cleanupFrame(instance.hostFrame);
    return newInstance;
  } else if (typeof element.type === 'string') {
    // Update host element
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

function reconcileChildren(
    instance: Instance, element: InternalElement): Instance[] {
  const hostFrame = instance.hostFrame;
  const childInstances = instance.childInstances;
  const nextChildElements = element.props.children || [];

  const newChildInstances = childInstances.map((childInstance, i) => {
    const childElement = nextChildElements[i];
    return reconcile(hostFrame, childInstance, childElement);
  });

  return newChildInstances.filter(
      (instance): instance is Instance => instance != null);
}

function instantiate(
    element: InternalElement, parentFrame: WowRegion): Instance {
  const {type, props} = element;

  console.log('instantiate', type, Object.keys(props || {}).join(', '));

  if (typeof type === 'string') {
    if (type === TEXT_ELEMENT) {
      throw 'Cannot create inline text, yet';
    }

    // Instantiate host element
    const frame =
        createFrame(type, props.name, parentFrame, props.inheritsFrom);

    updateFrameProperties(frame, [], props);

    const childElements = props.children || [];
    const childInstances =
        childElements.map(child => instantiate(child, frame));

    const instance: Instance =
        {hostFrame: frame, element, childInstances, childInstance: null};
    return instance;

  } else {
    console.log('instantiate Component', Object.keys(element || {}).join(', '));
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

function createPublicInstance(
    element: InternalElement, internalInstance: Instance) {
  const {type: ComponentType, props} = element;
  if (!ComponentType) {
    throw 'Tried createPublicInstance() with undefined';
  }

  if (typeof ComponentType === 'string') {
    throw 'Tried createPublicInstance() with string';
  }

  const publicInstance = new (ComponentType as any)(props);
  publicInstance.__internalInstance = internalInstance;
  return publicInstance;
}
