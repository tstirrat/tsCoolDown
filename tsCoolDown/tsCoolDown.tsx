import * as Didact from './Lib/didact/didact';
import { ActiveCooldowns } from './Components/ActiveCooldowns';
import { BAR_HEIGHT, COOLDOWN_WIDTH } from './utils/constants';

const frame = CreateFrame('Frame', 'tsCoolDown_UIParent', UIParent);
frame.SetPoint('CENTER', UIParent, 'CENTER', -200, 0);
frame.SetSize(COOLDOWN_WIDTH, BAR_HEIGHT);

Didact.render(<ActiveCooldowns />, frame);
