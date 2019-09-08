export function updateFrameProperties(frame: WowFrame,
                                      prevProps: Record<string, any>,
                                      nextProps: Record<string, any>) {
  const isEvent = (name: string) => name.startsWith('On');
  const isAttribute = (name: string) =>
      !isEvent(name) && name !== 'children' && name !== 'Points';

  frame.ClearAllPoints();
  if (nextProps['Points']) {
    (nextProps as JSX.BaseFrameProps)!.Points!.forEach(point => {
      if (typeof point === 'string') {
        frame.SetPoint(point);
      } else {
        frame.SetPoint(...point);
      }
    });
  }

  // Remove event listeners
  Object.keys(prevProps).filter(isEvent).forEach(
      event => { frame.SetScript(event as WowEventOnAny, null); });

  // Add event listeners
  Object.keys(nextProps).filter(isEvent).forEach(
      event => { frame.SetScript(event as WowEventOnAny, nextProps[event]); });

  // Remove attributes
  Object.keys(prevProps)
      .filter(isAttribute)
      .forEach(key => { attemptSetProperty(frame, key, null); });

  // Set attributes
  Object.keys(nextProps)
      .filter(isAttribute)
      .forEach(key => { attemptSetProperty(frame, key, nextProps[key]); });
}

function attemptSetProperty(frame: WowFrame, key: string, value: any) {
  const setter = (frame as Record<string, any>)[`Set${key}`];
  if (setter && typeof setter == 'function') {
    setter(value);
  }
}

export function sentenceCase(str: string) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function pascalCase(kebabCase: string) {
  return kebabCase.split('-').map(sentenceCase).join('');
}
