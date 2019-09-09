import * as Didact from '../Lib/didact/didact';

const formatRemainingTime = (time: number) => {
  const min = Math.floor(time / 60);
  const sec = Math.floor(Math.fmod(time, 60));
  return string.format('%02d:%02s', min, sec);
};

const getRemainingTime = (
  start: number,
  duration: number
): [number, string] => {
  const secsRemain = start + duration - GetTime();

  let label = '0:00';
  if (secsRemain > 0) {
    label = formatRemainingTime(secsRemain);
  }

  return [secsRemain, label];
};

const throttle = (fn: CallableFunction, threshold: number) => {
  assert(threshold, 'threshold is required');
  let t = 0;
  return function(frame: WowFrame, elapsed: number) {
    t = t + elapsed;
    if (t > threshold) {
      t = 0;
      fn(frame, elapsed);
    }
  };
};
const BACKDROP_TABLE = {
  bgFile: 'Interface\\Tooltips\\UI-Tooltip-Background',
  edgeFile: 'Interface\\Tooltips\\UI-Tooltip-Border',
  tile: true,
  tileSize: 12,
  edgeSize: 12,
  insets: { left: 2, right: 2, top: 2, bottom: 2 }
};

const COLOR_BLACK: JSX.Color4 = [0, 0, 0, 1];

const BACKDROP = BACKDROP_TABLE;
const FONT = ['Interface\\AddOns\\tsCoolDown\\Fonts\\coolDownFont.ttf', 22];
const TEXT_COLOR: JSX.Color4 = [1, 0.82, 0, 1];
const BAR_COLOR: JSX.Color4 = [0.4, 0.4, 0.95, 1];
const BORDER_SIZE: JSX.Size = [80, 32];
const BAR_SIZE: JSX.Size = [70, 22];

interface Props {
  start: number;
  duration: number;
}

interface State {
  secondsRemaining: number;
  label: string;
}

export class Bar extends Didact.Component<Props, State> {
  private readonly onUpdate = throttle(() => {
    const [t, l] = getRemainingTime(this.props.start, this.props.duration);
    this.setState({ secondsRemaining: t, label: l });
  }, 0.2);

  constructor(props: Props) {
    super(props);
    assert(props.start, 'start is required');
    assert(props.duration, 'duration is required');

    const [secondsRemaining, label] = getRemainingTime(
      props.start,
      props.duration
    );
    this.state = { secondsRemaining, label };
  }

  render() {
    const secondsRemaining = this.state.secondsRemaining;
    const label = this.state.label;

    return (
      <frame
        Size={BORDER_SIZE}
        Backdrop={BACKDROP}
        BackdropBorderColor={COLOR_BLACK}
        BackdropColor={COLOR_BLACK}
        Point="RIGHT"
        OnUpdate={this.onUpdate}
      >
        <status-bar
          MinValue={0}
          MaxValue={this.props.duration}
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
