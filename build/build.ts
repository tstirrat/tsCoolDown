import * as ts from 'typescript';
import * as tstl from 'typescript-to-lua';

import { CustomTransformer } from './custom_transformer';

const options: tstl.CompilerOptions = {
  luaTarget: tstl.LuaTarget.Lua51,
  luaLibImport: tstl.LuaLibImportKind.Require,
  jsxFactory: 'Didact.createElement',
  rootDir: './MyAddon',
  outDir: './MyAddon/build'
};
const program = ts.createProgram({
  rootNames: ['MyAddon/MyAddon.tsx', 'MyAddon/App.tsx'],
  options
});

const transformer = new CustomTransformer(program);
const printer = new tstl.LuaPrinter(options, ts.sys);

const result = tstl.transpile({ program, transformer, printer });

result.diagnostics.length && console.log(result.diagnostics);

const emitResult = tstl.emitTranspiledFiles(options, result.transpiledFiles);
emitResult.forEach(({ name, text }) => ts.sys.writeFile(name, text));
