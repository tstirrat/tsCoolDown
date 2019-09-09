import * as Didact from '../Lib/didact/didact';
import { Icon } from './Icon';
import { Bar } from './Bar';
import { P } from '../Lib/didact/wow-utils';

export interface Props {
  start: number;
  duration: number;
  textures: string[];
  key?: string;
  Point: JSX.PointDefinition;
}

const ICON_SIZE = 32;
const BAR_WIDTH = 80;
const CONTAINER_SIZE: JSX.Size = [BAR_WIDTH + ICON_SIZE, ICON_SIZE];

export class Cooldown extends Didact.Component<Props> {
  render() {
    const { start, duration, textures, Point } = this.props;

    assert(start, 'start is required');
    assert(duration, 'duration is required');
    assert(textures && textures.length, 'at least one texture is required');

    return (
      <frame Size={CONTAINER_SIZE} Point={Point}>
        <frame Point="LEFT">
          {textures.map((texture, i) => (
            <Icon
              key={texture}
              texture={texture}
              Point={P('LEFT', 'RIGHT', -(i * ICON_SIZE), 0)}
            />
          ))}
        </frame>
        <Bar start={start} duration={duration} Point="RIGHT" />
      </frame>
    );
  }
}
