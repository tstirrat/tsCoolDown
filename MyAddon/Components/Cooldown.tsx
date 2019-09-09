import * as Didact from '../Lib/didact/didact';
import { Icon } from './Icon';
import { Bar } from './Bar';

export interface Props {
  name: string;
  start: number;
  duration: number;
  textures: string[];
}

const ICON_SIZE = 32;
const BAR_WIDTH = 80;
const CONTAINER_SIZE: JSX.Size = [BAR_WIDTH + ICON_SIZE, ICON_SIZE];

export class Cooldown extends Didact.Component<Props> {
  render() {
    const { name, start, duration, textures } = this.props;

    assert(name, 'frameName is required');
    assert(start, 'start is required');
    assert(duration, 'duration is required');
    assert(textures && textures.length, 'at least one texture is required');

    const containerFrame = name;

    const icons = textures.map((texture, i) => {
      return (
        <Icon
          key={texture}
          texture={texture}
          Points={[['LEFT', containerFrame, 'LEFT', -(i * ICON_SIZE), 0]]}
        />
      );
    });

    return (
      <frame name={containerFrame} Size={CONTAINER_SIZE} Point="BOTTOMLEFT">
        <frame Point="LEFT">{icons}</frame>
        <Bar start={start} duration={duration} Point="RIGHT" />
      </frame>
    );
  }
}
