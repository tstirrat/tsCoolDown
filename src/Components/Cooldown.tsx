import * as ReactWowAddon from '@brusalk/react-wow-addon';
import { Icon } from './Icon';
import { Bar } from './Bar';
import { ICON_SIZE, COOLDOWN_FULL_SIZE } from '../utils/constants';

export interface Props {
  start: number;
  duration: number;
  textures: WoWAPI.TexturePath[];
  Point: JSX.Point;
}

export class Cooldown extends ReactWowAddon.Component<Props> {
  render() {
    const { start, duration, textures, Point } = this.props;

    assert(start, 'start is required');
    assert(duration, 'duration is required');
    assert(textures && textures.length, 'at least one texture is required');

    return (
      <frame Size={COOLDOWN_FULL_SIZE} Point={Point}>
        <frame Point="LEFT" Width={ICON_SIZE} Height={ICON_SIZE}>
          {textures.map((texture, i) => (
            <Icon texture={texture} Point={{point: 'LEFT', x: -i * ICON_SIZE}} />
          ))}
        </frame>
        <Bar start={start} duration={duration} Point="RIGHT" />
      </frame>
    );
  }
}
