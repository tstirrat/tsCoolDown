declare namespace JSX {
  type Point = WowPoint|[WowPoint, string, WowPoint, number, number]|
      [WowPoint, string, WowPoint,
       number]|[WowPoint, string, WowPoint]|[WowPoint, string]|[WowPoint];

  interface BaseFrameProps {
    name?: string;
    layer?: WowLayer;
    inheritsFrom?: string;
    Width?: number;
    Height?: number;
    Size?: [number, number];
    Points?: Point[];
  }

  interface IntrinsicElements {
    button: BaseFrameProps;
    'color-select': BaseFrameProps;
    cooldown: BaseFrameProps;
    'edit-box': BaseFrameProps;
    frame: BaseFrameProps;
    'game-tooltip': BaseFrameProps;
    'message-frame': BaseFrameProps;
    minimap: BaseFrameProps;
    model: BaseFrameProps;
    'scroll-frame': BaseFrameProps;
    'scrolling-message-frame': BaseFrameProps;
    'simple-html': BaseFrameProps;
    slider: BaseFrameProps;
    'status-bar': BaseFrameProps;

    // Other things
    'font-string': BaseFrameProps&{Text: string};
    texture: BaseFrameProps&{Text: string};
  }
}
