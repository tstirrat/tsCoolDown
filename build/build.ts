import * as ts from 'typescript';
import * as tstl from 'typescript-to-lua';

import {CustomTransformer} from './custom_transformer';

const options: tstl.CompilerOptions = {
  luaTarget: tstl.LuaTarget.Lua51
};
const program = ts.createProgram({rootNames: ['MyAddon/MyAddon.tsx'], options});

const transformer = new CustomTransformer(program);
const printer = new tstl.LuaPrinter(options, ts.sys);

const result = tstl.transpile({
  program,
  transformer,
  printer,
});
console.log(result.diagnostics);

const emitResult = tstl.emitTranspiledFiles(options, result.transpiledFiles)
emitResult.forEach(({name, text}) => ts.sys.writeFile(name, text));
