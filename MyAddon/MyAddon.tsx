import * as Didact from './Lib/didact/didact';

import { App } from './App';

const rootFrame = CreateFrame('Frame', undefined, UIParent);

Didact.render(<App />, rootFrame);
