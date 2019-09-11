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
  // console.log('created frame:', frameType);
  return frame;
}

export function cleanupFrame(frame: WowRegion) {
  // console.log('cleaning up frame');
  frame.Hide();
  frame.ClearAllPoints();
  frame.SetParent(null);
}

const isEvent = (name: string) => name.startsWith('On');
const isStandardProperty = (name: string) => !isEvent(name) &&
    !isOrderedProperty(name) && name !== 'children' && name !== 'Points' && name !== 'Point' &&
    name !== 'name' && name !== 'layer' && name !== 'inheritsFrom';

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
      .filter(key => isOrderedProperty(key) && !nextProps[key])
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
      .filter(key => isStandardProperty(key) && !nextProps[key])
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
  // Detach removed event listeners
  Object.keys(prevProps)
      .filter(key => isEvent(key) && !nextProps[key])
      .forEach(event => {
        (frame as WowFrame).SetScript(event as WowEventOnAny, null);
      });

  // Add new event listeners
  Object.keys(nextProps)
      .filter(key => isEvent(key) && prevProps[key] !== nextProps[key])
      .forEach(event => {
        console.log('attaching event', event);
        (frame as WowFrame).SetScript(event as WowEventOnAny, nextProps[event]);
      });
}

/** Handle frame points, size to parent unless specified. */
function updateFramePoints(frame: WowRegion, nextProps: JSX.BaseFrameProps) {
  frame.ClearAllPoints();
  if (nextProps.Point) {
    setPoint(frame, nextProps.Point);
    return;
  }
  if (nextProps.Points) {
    const points = nextProps.Points;
    points.forEach(pointDef => setPoint(frame, pointDef));
  } else {
    // Fill to parent
    frame.SetAllPoints();
  }
}

/** Create a point declaration */
export function P(
    point: WowPoint, x?: number, y?: number, relativePoint?: WowPoint,
    relativeFrame?: WowRegion): JSX.PointDefinition {
  // TODO: memoize for perf
  return {point, relativePoint, relativeFrame, x, y};
}

function setPoint(frame: WowRegion, pointDef: JSX.Point) {
  if (typeof pointDef === 'string') {
    frame.SetPoint(pointDef);
  } else {
    const {point, relativePoint, relativeFrame, x, y} = pointDef;
    const relativeTo = relativePoint || point;
    // console.log('setPoint', Object.keys(pointDef).join(', '));
    if (relativeFrame) {
      frame.SetPoint(point, relativeFrame, relativeTo, x || 0, y || 0);
    } else {
      const parent = frame.GetParent() as WowRegion;
      frame.SetPoint(point, parent, relativeTo, x || 0, y || 0);
    }
  }
}

function attemptSetProperty(frame: WowRegion, key: string, value: any) {
  const region = frame as any as Record<string, (v: any) => void>;
  const setter = `Set${key}`;
  const setterFn = region[setter];
  assert(setterFn, `Tried to use ${setter} and it did not exist`);

  if (setterFn && typeof setterFn == 'function') {
    if (typeof value === 'string' || typeof value === 'number' ||
        isTableValue(key)) {
      region[setter](value);
    } else {
      // console.log( `calling ${setter} with array elements as args:`,
          // (value as any[]).join(', '));
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
