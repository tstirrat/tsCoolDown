import * as Didact from '../Lib/didact/didact';
import { Icon } from './Icon';
import { Bar } from './Bar';

interface Props {
  frameName: string;
  start: number;
  duration: number;
  textures: string[];
}

const BAR_SIZE: JSX.Size = [80 + 32, 32];

export class Cooldown extends Didact.Component<Props> {
  render() {
    const { frameName, start, duration, textures } = this.props;

    assert(frameName, 'frameName is required');
    assert(start, 'start is required');
    assert(duration, 'duration is required');
    assert(textures && textures[1], 'at least one texture is required');

    const containerFrame = frameName;

    const icons = textures.map((texture, i) => {
      let anchor = containerFrame + 'Icon' + (i - 1);
      if (i == 1) {
        anchor = containerFrame;
      }

      return (
        <Icon
          key={texture}
          texture={texture}
          name={containerFrame + 'Icon' + i}
          Points={['TOPRIGHT', anchor, 'TOPLEFT']}
        />
      );
    });

    return (
      <frame name={containerFrame} Size={BAR_SIZE}>
        <frame Point="LEFT">{icons}</frame>
        <Bar start={start} duration={duration} Point="RIGHT" />
      </frame>
    );
  }
}
