import * as Didact from '../../Lib/didact/didact';
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
  onMoved?: (frame: WowFrame) => void;
}

export class ConfigAnchor extends Didact.Component<Props, {}> {
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

  private readonly onDragStart = (frame: WowFrame) => {
    console.log('OnDragStart before', ...frame.GetPoint(1));
    frame.StartMoving();
    console.log('OnDragStart after', ...frame.GetPoint(1));
  };

  private readonly onDragStop = (frame: WowFrame) => {
    console.log('OnDragStop', ...frame.GetPoint(1));
    frame.StopMovingOrSizing();
    this.props.onMoved && this.props.onMoved(frame);
  };
}
