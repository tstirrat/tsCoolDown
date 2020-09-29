import * as ReactWowAddon from '@brusalk/react-wow-addon';
import { throttle, getRemainingTime, formatRemainingTime } from '../utils/time';
import {
  BACKDROP,
  COLOR_BLACK,
  COOLDOWN_FONT,
  BAR_SIZE
} from '../utils/constants';

const TEXT_COLOR: JSX.Color4 = [1, 0.82, 0, 1];
const PROGRESS_BAR_COLOR: JSX.Color4 = [0.4, 0.4, 0.95, 1];
const PROGRESS_BAR_SIZE: JSX.Size = [70, 22];

interface Props {
  start: number;
  duration: number;
  Point: JSX.Point;
}

interface State {
  secondsRemaining: number;
  label: string;
}

export class Bar extends ReactWowAddon.Component<Props, State> {
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

  private readonly minMaxValues: JSX.Tuple = [0, this.props.duration];

  render() {
    const { secondsRemaining, label } = this.state;
    const { Point } = this.props;

    return (
      <frame
        Size={BAR_SIZE}
        Backdrop={BACKDROP}
        BackdropBorderColor={COLOR_BLACK}
        BackdropColor={COLOR_BLACK}
        Point={Point}
        OnUpdate={this.onUpdate}
      >
        <status-bar
          MinMaxValues={this.minMaxValues}
          Value={secondsRemaining}
          Point="CENTER"
          Size={PROGRESS_BAR_SIZE}
          StatusBarTexture="Interface\AddOns\tsCoolDown\Textures\Smooth"
          StatusBarColor={PROGRESS_BAR_COLOR}
        >
          <font-string
            Text={label}
            DrawLayer="OVERLAY"
            Font={COOLDOWN_FONT}
            Point="CENTER"
            JustifyH="CENTER"
            TextColor={TEXT_COLOR}
          />
        </status-bar>
      </frame>
    );
  }
}
