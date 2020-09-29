import * as ReactWowAddon from '@brusalk/react-wow-addon';
import {
  BACKDROP,
  COLOR_WHITE,
  COLOR_BLACK,
  ANCHOR_FONT
} from '../../utils/constants';

export interface Props {
  label: string;
  Point: JSX.Point;
  Size: JSX.Size;
  onMoved?: (frame: WoWAPI.Frame) => void;
  onClick?: (frame: WoWAPI.Frame, button: WoWAPI.MouseButton, down: boolean) => void;
}

export class ConfigAnchor extends ReactWowAddon.Component<Props, {}> {
  render() {
    const { Point, Size, label } = this.props;

    return (
      <button
        Size={Size}
        Point={Point}
        Backdrop={BACKDROP}
        BackdropBorderColor={COLOR_WHITE}
        BackdropColor={COLOR_BLACK}
        Draggable={['LeftButton']}
        Movable
        OnDragStart={frame => this.onDragStart(frame)}
        OnDragStop={frame => this.onDragStop(frame)}
        OnClick={(frame, button, down) => this.onClick(frame, button, down)}
      >
        <font-string
          Text={label}
          DrawLayer="OVERLAY"
          Font={ANCHOR_FONT}
          Point="CENTER"
          JustifyH="CENTER"
          TextColor={COLOR_WHITE}
        />
      </button>
    );
  }

  private readonly onClick = (
    frame: WoWAPI.Frame,
    button: WoWAPI.MouseButton,
    down: boolean
  ) => {
    this.props.onClick && this.props.onClick(frame, button, down);
  };

  private readonly onDragStart = (frame: WoWAPI.Frame) => {
    frame.StartMoving();
  };

  private readonly onDragStop = (frame: WoWAPI.Frame) => {
    frame.StopMovingOrSizing();
    this.props.onMoved && this.props.onMoved(frame);
  };
}
