import * as Didact from '../Lib/didact/didact';
import { throttle, getRemainingTime, formatRemainingTime } from '../utils/time';

const BACKDROP: WowBackdrop = {
  bgFile: 'Interface\\Tooltips\\UI-Tooltip-Background',
  edgeFile: 'Interface\\Tooltips\\UI-Tooltip-Border',
  tile: true,
  tileSize: 12,
  edgeSize: 12,
  insets: { left: 2, right: 2, top: 2, bottom: 2 }
};
const FONT: JSX.Font = ['Fonts\\FRIZQT__.TTF', 22];
const COLOR_BLACK: JSX.Color4 = [0, 0, 0, 1];
const TEXT_COLOR: JSX.Color4 = [1, 0.82, 0, 1];
const BAR_COLOR: JSX.Color4 = [0.4, 0.4, 0.95, 1];
const BORDER_SIZE: JSX.Size = [80, 32];
const BAR_SIZE: JSX.Size = [70, 22];

interface Props {
  start: number;
  duration: number;
  Point: JSX.Point;
}

interface State {
  secondsRemaining: number;
  label: string;
}

export class Bar extends Didact.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    assert(props.start, 'start is required');
    assert(props.duration, 'duration is required');

    const secondsRemaining = getRemainingTime(props.start, props.duration);
    this.state = {
      secondsRemaining,
      label: formatRemainingTime(secondsRemaining)
    };
  }

  private readonly onUpdate = throttle(() => {
    const { start, duration } = this.props;
    const secondsRemaining = getRemainingTime(start, duration);
    this.setState({
      secondsRemaining,
      label: formatRemainingTime(secondsRemaining)
    });
  }, 0.2);

  render() {
    const { secondsRemaining, label } = this.state;
    const { Point } = this.props;

    return (
      <frame
        Size={BORDER_SIZE}
        Backdrop={BACKDROP}
        BackdropBorderColor={COLOR_BLACK}
        BackdropColor={COLOR_BLACK}
        Point={Point}
      >
        <status-bar
          MinMaxValue={[0, this.props.duration] as JSX.Tuple}
          Value={secondsRemaining}
          Point="CENTER"
          Size={BAR_SIZE}
          StatusBarTexture="Interface\\AddOns\\tsCoolDown\\Textures\\Smooth"
          StatusBarColor={BAR_COLOR}
        >
          <font-string
            Text={label}
            layer="OVERLAY"
            Font={FONT}
            Point="CENTER"
            JustifyH="CENTER"
            TextColor={TEXT_COLOR}
          />
        </status-bar>
      </frame>
    );
  }
}
