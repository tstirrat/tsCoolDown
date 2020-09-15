import * as Didact from '../Lib/didact/didact';
import { Icon } from './Icon';
import { Bar } from './Bar';
import { P } from '../Lib/didact/wow-utils';
import { ICON_SIZE, COOLDOWN_FULL_SIZE } from '../utils/constants';
import "@wartoshika/wow-declarations";

export interface Props {
  start: number;
  duration: number;
  textures: WoWAPI.TexturePath[];
  Point: JSX.Point;
}

export class Cooldown extends Didact.Component<Props> {
  render() {
    const { start, duration, textures, Point } = this.props;

    assert(start, 'start is required');
    assert(duration, 'duration is required');
    assert(textures && textures.length, 'at least one texture is required');

    return (
      <frame Size={COOLDOWN_FULL_SIZE} Point={Point}>
        <frame Point="LEFT" Width={ICON_SIZE} Height={ICON_SIZE}>
          {textures.map((texture, i) => (
            <Icon texture={texture} Point={P('LEFT', -(i * ICON_SIZE))} />
          ))}
        </frame>
        <Bar start={start} duration={duration} Point="RIGHT" />
      </frame>
    );
  }
}
