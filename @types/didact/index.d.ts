declare namespace JSX {
  type Point = WowPoint|[WowPoint, string, WowPoint, number, number]|
      [WowPoint, string, WowPoint,
       number]|[WowPoint, string, WowPoint]|[WowPoint, string]|[WowPoint];

  type Color4 = [number, number, number, number];
  type Size = [number, number];
  type Font = [string, number];

  interface BaseFrameProps {
    name?: string;
    layer?: WowLayer;
    inheritsFrom?: string;
    Width?: number;
    Height?: number;
    Size?: Size;
    Points?: Point[];
    Point?: Point|WowPoint;
  }

  interface LayeredRegionProps extends BaseFrameProps {
    VertexColor?: Color4;
  }

  interface TextureProps extends LayeredRegionProps {
    Texture?: string;
  }

  interface FontInstanceProps extends LayeredRegionProps {
    Font?: Font;
  }

  interface FontStringProps extends FontInstanceProps {
    Text?: string;
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
    'font-string': FontStringProps;
    texture: TextureProps;
  }
}
