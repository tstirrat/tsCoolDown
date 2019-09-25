import * as Didact from './Lib/didact/didact';
import { ActiveCooldowns } from './Components/ActiveCooldowns';
import { BAR_HEIGHT, COOLDOWN_WIDTH } from './utils/constants';

const tsCoolDown = LibStub('AceAddon-3.0').NewAddon(
  'tsCoolDown',
  'AceConsole-3.0'
);

tsCoolDown.OnInitialize = function() {
  tsCoolDown.RegisterChatCommand('tsc', input => {
    console.log('/tsc', input);
  });
  const db = LibStub('AceDB-3.0').New<GlobalOptions>(
    'tsCoolDown_Db',
    { x: 200, y: 200 },
    true /* use global "Default" profile */
  );

  const { x, y } = db.profile;

  const frame = CreateFrame('Frame', 'tsCoolDown_UIParent', UIParent);
  frame.SetPoint('CENTER', UIParent, 'CENTER', x, y);
  frame.SetSize(COOLDOWN_WIDTH, BAR_HEIGHT);

  Didact.render(<ActiveCooldowns />, frame);
};
