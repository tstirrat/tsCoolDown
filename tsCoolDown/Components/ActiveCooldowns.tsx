import * as Didact from '../Lib/didact/didact';
import { Cooldown } from './Cooldown';
import { P } from '../Lib/didact/wow-utils';
import { subscribe } from '../utils/cooldowns';
import { ConfigAnchor } from './config/ConfigAnchor';
import { COOLDOWN_FULL_SIZE, BAR_HEIGHT } from '../utils/constants';

interface Timer {
  start: number;
  duration: number;
  textures: WowTexturePath[];
}

interface State {
  cooldowns: Timer[];
  isInConfigMode?: boolean;
}

const CONTAINER_NAME = 'tsCoolDown_ActiveCooldowns_Container';

export class ActiveCooldowns extends Didact.Component<{}, State> {
  state: State = { cooldowns: [], isInConfigMode: false };

  constructor(props: {}) {
    super(props);

    subscribe(cooldowns => {
      assert(cooldowns, 'ActiveCooldowns: timers should exist');
      // console.log('got new cooldowns', cooldowns.length);
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
            Size={COOLDOWN_FULL_SIZE}
          />
        )}
        {cooldowns.map((timer, i) => (
          <Cooldown
            Point={P('BOTTOMLEFT', 0, i * BAR_HEIGHT)}
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
    frame: WowFrame,
    button: WowMouseButton,
    down: boolean
  ) => {
    console.log('OnClick', frame, button, down);
    this.setState({ isInConfigMode: !this.state.isInConfigMode });
  };

  private readonly onMoved = (frame: WowFrame) => {
    console.log('onMoved', frame.GetPoint(1));
  };
}
