import * as Didact from './Lib/didact/didact';

const frame = CreateFrame('Frame', 'tsCoolDown_UIParent', UIParent);
frame.SetPoint('CENTER', UIParent, 'CENTER', -200, 0);
frame.SetSize(300, 300);

Didact.render(
  <frame name="tsCoolDown_test">
    <font-string Text="Test" />
  </frame>,
  frame
);
