declare namespace JSX {
  interface PointDefinition {
    point: WowPoint;
    relativePoint?: WowPoint;
    relativeFrame?: WowRegion|string;
    x?: number;
    y?: number;
  }

  type Point = PointDefinition|WowPoint;

  type Color4 = [number, number, number, number];
  type Tuple<T = number> = [T, T];
  type Size = Tuple;
  type Font = [string, number];

  interface BaseProps {
    key?: string;
    children?: string;
  }

  interface BaseFrameProps extends BaseProps {
    name?: string;
    layer?: WowLayer;
    inheritsFrom?: string;
    Width?: number;
    Height?: number;
    Size?: Size;
    Points?: Point[];
    Point?: Point;
    Backdrop?: WowBackdrop;
    BackdropBorderColor?: Color4;
    BackdropColor?: Color4;

    OnUpdate?: (frame: WowFrame, secondsElapsed: number) => void;
  }

  interface LayeredRegionProps extends BaseFrameProps {
    VertexColor?: Color4;
  }

  interface StatusBarProps extends BaseFrameProps {
    MinMaxValues?: Tuple;
    Value?: number;
    StatusBarTexture?: string;
    StatusBarColor?: Color4;
  }

  interface TextureProps extends LayeredRegionProps {
    Texture?: WowTexturePath;
  }

  interface FontInstanceProps extends LayeredRegionProps {
    Font?: Font;
  }

  interface FontStringProps extends FontInstanceProps {
    Text?: string;
    JustifyH?: WowHorizontalAlign;
    JustifyV?: WowVerticalAlign;
    TextColor?: Color4;
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
    slider: StatusBarProps;
    'status-bar': StatusBarProps;

    // Other things
    'font-string': FontStringProps;
    texture: TextureProps;
  }
}
