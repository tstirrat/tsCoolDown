import * as ReactWowAddon from '@brusalk/react-wow-addon';
import { Cooldown } from './Cooldown';
import { subscribe } from '../utils/cooldowns';
import { ConfigAnchor } from './config/ConfigAnchor';
import { COOLDOWN_FULL_SIZE, BAR_HEIGHT } from '../utils/constants';

interface Timer {
  start: number;
  duration: number;
  textures: WoWAPI.TexturePath[];
}

interface State {
  cooldowns: Timer[];
  isInConfigMode?: boolean;
}

const CONTAINER_NAME = 'tsCoolDown_ActiveCooldowns_Container';

const hasPositionConfig = () => tsCoolDown_Db.x !== undefined;

export class ActiveCooldowns extends ReactWowAddon.Component<{}, State> {
  state: State = { cooldowns: [], isInConfigMode: !hasPositionConfig() };

  constructor(props: {}) {
    super(props);

    subscribe(cooldowns => {
      this.setState({ cooldowns });
    });
  }

  render() {
    const { cooldowns, isInConfigMode } = this.state;

    return (
      <frame name={CONTAINER_NAME} Point="BOTTOMLEFT" Size={COOLDOWN_FULL_SIZE}>
        {isInConfigMode && (
          <ConfigAnchor
            label="Main"
            Point="BOTTOMLEFT"
            onMoved={this.onMoved}
            onClick={this.onClick}
            Size={COOLDOWN_FULL_SIZE}
          />
        )}
        {cooldowns.map((timer, i) => (
          <Cooldown
            Point={{point: 'BOTTOMLEFT', x: 0, y: i * BAR_HEIGHT}}
            start={timer.start}
            duration={timer.duration}
            textures={timer.textures}
          />
        ))}
      </frame>
    );
  }

  /** Toggle config mode */
  private readonly onClick = (
    frame: WoWAPI.Frame,
    button: WoWAPI.MouseButton,
    down: boolean
  ) => {
    console.log('OnClick', frame, button, down);
    this.setState({ isInConfigMode: !this.state.isInConfigMode });
  };

  private readonly onMoved = (frame: WoWAPI.Frame) => {
    const [, , , x, y] = frame.GetPoint(1);
    tsCoolDown_Db.x = x;
    tsCoolDown_Db.y = y;
  };
}
