import * as Didact from '../Lib/didact/didact';
import { Cooldown } from './Cooldown';
import { P } from '../Lib/didact/wow-utils';
import { subscribe } from '../utils/cooldowns';

interface Timer {
  start: number;
  duration: number;
  textures: WowTexturePath[];
}

interface State {
  cooldowns: Timer[];
}

const BAR_HEIGHT = 32;
const CONTAINER_NAME = 'tsCoolDown_ActiveCooldowns_Container';
const COOLDOWN_SIZE: JSX.Size = [80, BAR_HEIGHT];

const FAKE_COOLDOWNS: Timer[] = [
  {
    start: GetTime(),
    duration: 60 * 1,
    textures: [
      'Interface\\Icons\\INV_Potion_54',
      'Interface\\Icons\\INV_Potion_76'
    ]
  },
  {
    start: GetTime() - 12,
    duration: 60 * 2,
    textures: ['Interface\\Icons\\INV_Potion_76']
  }
];

export class ActiveCooldowns extends Didact.Component<{}, State> {
  state: State = { cooldowns: [] };

  constructor(props: {}) {
    super(props);

    subscribe(cooldowns => {
      assert(cooldowns, 'ActiveCooldowns: timers should exist');
      console.log('got new cooldowns', cooldowns.length);
      this.setState({ cooldowns });
    });
  }

  render() {
    const { cooldowns } = this.state;

    return (
      <frame name={CONTAINER_NAME} Point="BOTTOMLEFT" Size={COOLDOWN_SIZE}>
        {cooldowns.map((timer, i) => (
          <Cooldown
            Point={P('BOTTOMLEFT', 0, -(i * BAR_HEIGHT))}
            start={timer.start}
            duration={timer.duration}
            textures={timer.textures}
          />
        ))}
      </frame>
    );
  }
}
