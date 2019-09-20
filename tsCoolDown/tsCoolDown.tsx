import * as Didact from './Lib/didact/didact';
import { ActiveCooldowns } from './Components/ActiveCooldowns';
import { BAR_HEIGHT, COOLDOWN_WIDTH } from './utils/constants';

const tsCoolDown = LibStub('AceAddon-3.0').NewAddon('tsCoolDown');

tsCoolDown.OnInitialize = function() {
  tsCoolDown_Db = tsCoolDown_Db || {};

  const { x = 200, y = 200 } = tsCoolDown_Db;

  const frame = CreateFrame('Frame', 'tsCoolDown_UIParent', UIParent);
  frame.SetPoint('CENTER', UIParent, 'CENTER', x, y);
  frame.SetSize(COOLDOWN_WIDTH, BAR_HEIGHT);

  Didact.render(<ActiveCooldowns />, frame);
};
