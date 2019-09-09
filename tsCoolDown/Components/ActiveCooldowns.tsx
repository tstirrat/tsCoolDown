import * as Didact from '../Lib/didact/didact';
import { Cooldown } from './Cooldown';
import { P } from '../Lib/didact/wow-utils';

interface Timer {
  start: number;
  duration: number;
  textures: string[];
}

interface State {
  cooldowns: Timer[];
}

const BAR_HEIGHT = 32;
const CONTAINER_NAME = 'tsCoolDown_ActiveCooldowns_Container';

const FAKE_COOLDOWNS = [
  {
    textures: [
      'Interface\\Icons\\INV_Potion_54',
      'Interface\\Icons\\INV_Potion_76'
    ],
    start: GetTime(),
    duration: 60 * 1
  },
  {
    textures: ['Interface\\Icons\\INV_Potion_76'],
    start: GetTime() - 12,
    duration: 60 * 2
  }
];

export class ActiveCooldowns extends Didact.Component<{}, State> {
  readonly state: State = {
    cooldowns: FAKE_COOLDOWNS
  };

  render() {
    const { cooldowns } = this.state;

    return (
      <frame name={CONTAINER_NAME} Point="BOTTOMLEFT" Width={80} Height={32}>
        {cooldowns.map((timer, i) => (
          <Cooldown
            key={timer.textures[0]}
            Point={P('BOTTOMLEFT', undefined, 0, -(i * BAR_HEIGHT))}
            start={timer.start}
            duration={timer.duration}
            textures={timer.textures}
          />
        ))}
      </frame>
    );
  }
}
