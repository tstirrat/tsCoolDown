type Props = Record<string, any>;

export function createFrame(
    jsxType: string, name?: string, parentFrame?: WowRegion,
    inheritsFrom?: string): WowRegion {
  const frameType = pascalCase(jsxType);

  if (frameType === 'FontString') {
    return (parentFrame as WowFrame)
        .CreateFontString(name, 'ARTWORK', inheritsFrom);
  }

  if (frameType === 'Texture') {
    return (parentFrame as WowFrame)
        .CreateTexture(name, 'ARTWORK', inheritsFrom);
  }

  const frame =
      CreateFrame(frameType as WowFrameType, name, undefined, inheritsFrom) as
      WowFrame;
  if (parentFrame) {
    frame.SetParent(parentFrame);
  }
  return frame;
}

export function cleanupFrame(frame: WowRegion) {
  frame.Hide();
  frame.ClearAllPoints();
  frame.SetParent(null);
}

const isEvent = (name: string) => name.startsWith('On');
const isStandardProperty = (name: string) => !isEvent(name) &&
    !isOrderedProperty(name) && name !== 'children' && name !== 'Points';

/**
 * These properties must be set _before_ their other properties e.g. Background
 * must be set before BackgroundColor
 */
const isOrderedProperty = (name: string) => name === 'Font' ||
    name === 'Background' || name === 'Texture' || name === 'Backdrop';
/**
 * These properties take table values, which should be set verbatim. Array
 * values will apply each item as an argument to SetX. These values should not
 * be interpreted as arrays.
 */
const isTableValue = (name: string) => name === 'Backdrop';

export function updateFrameProperties(
    frame: WowRegion, prevProps: Props, nextProps: Props) {
  updateFramePoints(frame, nextProps);
  updateFrameEvents(frame, prevProps, nextProps);
  updateOrderSpecificProperties(frame, prevProps, nextProps);
  updateRemainingProperties(frame, prevProps, nextProps);
}

function updateOrderSpecificProperties(
    frame: WowRegion, prevProps: Props, nextProps: Props) {
  // Remove properties that are no longer specified
  Object.keys(prevProps)
      .filter(isOrderedProperty)
      .filter(key => !nextProps[key])
      .forEach(key => {
        attemptSetProperty(frame, key, null);
      });
  // Set properties
  Object.keys(nextProps).filter(isOrderedProperty).forEach(key => {
    attemptSetProperty(frame, key, nextProps[key]);
  });
}

function updateRemainingProperties(
    frame: WowRegion, prevProps: Props, nextProps: Props) {
  // Remove properties that are no longer specified
  Object.keys(prevProps)
      .filter(isStandardProperty)
      .filter(key => !nextProps[key])
      .forEach(key => {
        attemptSetProperty(frame, key, null);
      });
  // Set properties
  Object.keys(nextProps).filter(isStandardProperty).forEach(key => {
    attemptSetProperty(frame, key, nextProps[key]);
  });
}

function updateFrameEvents(
    frame: WowRegion, prevProps: Props, nextProps: Props) {
  Object.keys(prevProps)
      .filter(isEvent)
      .filter(key => !nextProps[key])
      .forEach(event => {
        (frame as WowFrame).SetScript(event as WowEventOnAny, null);
      });
  // Add event listeners
  Object.keys(nextProps)
      .filter(isEvent)
      .filter(key => prevProps[key] !== nextProps[key])
      .forEach(event => {
        (frame as WowFrame).SetScript(event as WowEventOnAny, nextProps[event]);
      });
}

/** Handle frame points, size to parent unless specified. */
function updateFramePoints(frame: WowRegion, nextProps: Props) {
  frame.ClearAllPoints();
  if (nextProps['Point']) {
    frame.SetPoint(nextProps['Point']);
    return;
  }
  if (nextProps['Points']) {
    const points = (nextProps as JSX.BaseFrameProps).Points!;
    points.forEach(point => {
      if (typeof point === 'string') {
        frame.SetPoint(point);
      } else {
        const [thisPoint, relativeTo, parentPoint, x, y] = point;
        if (relativeTo && parentPoint) {
          frame.SetPoint(thisPoint, relativeTo, parentPoint, x || 0, y || 0);
        } else {
          frame.SetPoint(thisPoint, x || 0, y || 0);
        }
      }
    });
  } else {
    // Fill to parent
    frame.SetAllPoints();
  }
}

function attemptSetProperty(frame: WowRegion, key: string, value: any) {
  const region = frame as any as Record<string, (v: any) => void>;
  const setter = `Set${key}`;
  const setterFn = region[setter];
  if (setterFn && typeof setterFn == 'function') {
    if (typeof value === 'string' || typeof value === 'number' ||
        isTableValue(key)) {
      region[setter](value);
    } else {
      console.log(
          `calling ${setter} with array elements as args:`,
          (value as any[]).join(', '));
      setterFn.apply(region, value);
    }
  }
}

export function sentenceCase(str: string) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function pascalCase(kebabCase: string) {
  return kebabCase.split('-').map(sentenceCase).join('');
}
