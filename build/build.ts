import * as ts from 'typescript';
import * as tstl from 'typescript-to-lua';

import {CustomTransformer} from './custom_transformer';

const options: tstl.CompilerOptions = {
  target: ts.ScriptTarget.ESNext,
  lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'],
  strict: true,
  jsx: ts.JsxEmit.React,
  jsxFactory: 'Didact.createElement',
  rootDir: './tsCoolDown',
  outDir: './tsCoolDown/build',
  typeRoots: ['@types', 'node_modules/@types', 'node_modules/@wartoshika'],
  luaTarget: tstl.LuaTarget.Lua51,
  luaLibImport: tstl.LuaLibImportKind.Require,
};
const program = ts.createProgram({rootNames: ['tsCoolDown/tsCoolDown.tsx'], options});

const transformer = new CustomTransformer(program);
const printer = new tstl.LuaPrinter(options, ts.sys);

const preDiagnostics = ts.getPreEmitDiagnostics(program);

if (preDiagnostics.length) {
  console.warn(preDiagnostics.map(
      d => log(d)));
}

const result = tstl.transpile({program, transformer, printer});

result.diagnostics.length &&
    console.warn(result.diagnostics.map(d => log(d)));

const emitResult = tstl.emitTranspiledFiles(options, result.transpiledFiles);
emitResult.forEach(({name, text}) => ts.sys.writeFile(name, text));

function log(d: ts.Diagnostic) {
  // return d;
  if (d.file) {
    return `${d.file.fileName}: ${d.messageText}`;
  }
  return `${d.messageText}`;
}