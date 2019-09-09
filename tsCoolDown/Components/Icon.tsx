import * as Didact from '../Lib/didact/didact';

const COLOR_BLACK: JSX.Color4 = [0, 0, 0, 1];
const SIZE: JSX.Size = [31, 31];

export interface Props {
  texture: string;
  Point: JSX.PointDefinition;
  key?: string;
}

export class Icon extends Didact.Component<Props, {}> {
  render() {
    const { texture, Point } = this.props;
    assert(texture, 'texture is required');

    return (
      <frame Size={SIZE} Point={Point}>
        <texture
          layer="OVERLAY"
          Texture="Interface\Buttons\UI-Debuff-Border"
          Point="CENTER"
          VertexColor={COLOR_BLACK}
        />
        <texture
          layer="ARTWORK"
          Texture={texture}
          Width={29}
          Height={29}
          Point="CENTER"
        />
      </frame>
    );
  }
}
