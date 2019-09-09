import * as Didact from './Lib/didact/didact';
import { Cooldown, Props } from './Components/Cooldown';

const frame = CreateFrame('Frame', 'tsCoolDown_UIParent', UIParent);
frame.SetPoint('CENTER', UIParent, 'CENTER', -200, 0);
frame.SetSize(300, 300);

const t: Props = {
  textures: [
    'Interface\\Icons\\INV_Potion_54',
    'Interface\\Icons\\INV_Potion_76'
  ],
  start: GetTime(),
  duration: 60 * 3,
  name: 'tsCoolDown_Test_Timer'
};

Didact.render(
  <frame name="tsCoolDown_test">
    <Cooldown
      start={t.start}
      duration={t.duration}
      name={t.name}
      textures={t.textures}
    />
  </frame>,
  frame
);
