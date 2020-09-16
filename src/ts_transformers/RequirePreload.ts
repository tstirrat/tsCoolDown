/* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
import * as ts from "typescript";
import {
  createBlock,
  createCallExpression,
  createExpressionStatement,
  createFunctionExpression,
  createIdentifier,
  createStringLiteral,
  Plugin,
} from "typescript-to-lua";
import { transformSourceFileNode } from "typescript-to-lua/dist/transformation/visitors/sourceFile";

export default {
  visitors: {
    [ts.SyntaxKind.SourceFile]: (node, context) => {
      const block = transformSourceFileNode(node, context);
      if (context.isModule) {
        const moduleFunction = createFunctionExpression(
          block,
          undefined,
          undefined,
          undefined
        );
        
        let moduleName = context.sourceFile.fileName.split("src")[1];
        if(moduleName.startsWith("/")) moduleName = moduleName.substring(1);
        if(moduleName.endsWith(".tsx")) moduleName = moduleName.substring(0, moduleName.length - 4);
        if(moduleName.endsWith(".ts")) moduleName = moduleName.substring(0, moduleName.length - 3);
        moduleName = moduleName.split("/").join(".");
        moduleName = moduleName.replace(".index", "");

        // Skip init.lua so it can be the entry-point
        if (moduleName === "init") return block;

        // Generates:
        // tstl_register_module("module/name", function() ... end)
        const moduleCallExpression = createCallExpression(
          createIdentifier("tstl_register_module"),
          [createStringLiteral(moduleName), moduleFunction]
        );

        return createBlock([createExpressionStatement(moduleCallExpression)]);
      }
      return block;
    },
  },
} as Plugin;