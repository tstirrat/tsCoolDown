import * as Didact from './Lib/didact/didact';
import { ActiveCooldowns } from './Components/ActiveCooldowns';

const frame = CreateFrame('Frame', 'tsCoolDown_UIParent', UIParent);
frame.SetPoint('CENTER', UIParent, 'CENTER', -200, 0);
frame.SetSize(80 + 32, 32);

Didact.render(<ActiveCooldowns />, frame);
