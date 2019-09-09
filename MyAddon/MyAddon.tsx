import * as Didact from './Lib/didact/didact';
import { Icon } from './Components/Icon';

const frame = CreateFrame('Frame', 'tsCoolDown_UIParent', UIParent);
frame.SetPoint('CENTER', UIParent, 'CENTER', -200, 0);
frame.SetSize(300, 300);

const FONT: JSX.Font = ['Fonts\\FRIZQT__.TTF', 22];

Didact.render(
  <frame name="tsCoolDown_test">
    <Icon texture="Interface\Icons\INV_Potion_54" />
  </frame>,
  frame
);
