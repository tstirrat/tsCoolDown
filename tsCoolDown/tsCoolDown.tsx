import * as Didact from './Lib/didact/didact';
import { ActiveCooldowns } from './Components/ActiveCooldowns';

const frame = CreateFrame('Frame', 'tsCoolDown_UIParent', UIParent);
frame.SetPoint('CENTER', UIParent, 'CENTER', -200, 0);
frame.SetSize(300, 300);

Didact.render(<ActiveCooldowns />, frame);
