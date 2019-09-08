import * as Didact from './Lib/didact/didact';

const rootFrame = CreateFrame('Frame', undefined, UIParent);
rootFrame.SetPoint('CENTER', UIParent, 'CENTER', -200, 0);
rootFrame.SetSize(300, 300);

Didact.render(<frame Points={['CENTER']} />, rootFrame);
