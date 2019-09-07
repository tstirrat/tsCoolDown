import * as ts from 'typescript';
import * as tstl from 'typescript-to-lua';

export class CustomTransformer extends tstl.LuaTransformer {
  public transformExpression(expression: ts.Expression):
      tstl.ExpressionVisitResult {
    if (ts.isJsxSelfClosingElement(expression)) {
      return this.transformJsxElement(expression);
    }
    if (ts.isJsxElement(expression)) {
      return this.transformJsxElement(expression);
    }
    if (ts.isJsxExpression(expression)) {
      if (!expression.expression) {
        throw new Error('JsxExpression has no .expression');
      }
      return this.transformExpression(expression.expression)
    }
    return super.transformExpression(expression);
  }

  protected transformJsxElement(expression: ts.JsxElement|
                                ts.JsxSelfClosingElement): tstl.Expression {
    if (ts.isJsxSelfClosingElement(expression)) {
      return this.transformJsxOpeningElement(expression);
    }
    return this.transformJsxOpeningElement(
        expression.openingElement,
        expression.children,
    );
  }

  protected transformJsxOpeningElement(
      expression: ts.JsxSelfClosingElement|ts.JsxOpeningElement,
      children?: ts.NodeArray<ts.JsxChild>,
      ): tstl.ExpressionVisitResult {
    // <Something a="b" />
    // React.createElement(Something, {a = 'b'})
    const createElement = tstl.createTableIndexExpression(
        tstl.createIdentifier('React'),
        tstl.createStringLiteral('createElement'));
    const tagName = expression.tagName.getText();

    const tag = tagName.toLowerCase() === tagName ?
        tstl.createStringLiteral(tagName) :
        tstl.createIdentifier(tagName);


    const props = this.transformJsxAttributesExpression(expression.attributes);

    if (children) {
      const childrenOrStringLiterals =
          children
              .filter(child => !ts.isJsxText(child) || child.text.trim() !== '')
              .map(
                  child => ts.isJsxText(child) ?
                      ts.createStringLiteral(child.text.trim()) :
                      child);
      const arrayLiteral =
          ts.createArrayLiteral(childrenOrStringLiterals, true);

      return tstl.createCallExpression(
          createElement, [tag, props, this.transformArrayLiteral(arrayLiteral)],
          expression);
    }

    return tstl.createCallExpression(createElement, [tag, props], expression);
  }

  public transformJsxAttributesExpression(expression: ts.JsxAttributes):
      tstl.ExpressionVisitResult {
    if (expression.properties.find(
            element => element.kind === ts.SyntaxKind.JsxSpreadAttribute)) {
      throw new Error('Unsupported: JsxSpreadAttribute');
    }
    const properties =
        expression.properties
            .filter(
                (element): element is ts.JsxAttribute =>
                    element.kind !== ts.SyntaxKind.JsxSpreadAttribute)
            .map(element => {
              const valueOrExpression = element.initializer ?
                  element.initializer :
                  ts.createLiteral(true);
              return ts.createPropertyAssignment(
                  element.name, valueOrExpression);
            });

    return this.transformObjectLiteral(ts.createObjectLiteral(properties));
  }

  public transformSourceFile(sourceFile: ts.SourceFile): tstl.Block {
    let statements: tstl.Statement[] = [];
    if (sourceFile.flags & ts.NodeFlags.JsonFile) {
      const statement = sourceFile.statements[0];
      if (!statement || !ts.isExpressionStatement(statement)) {
        throw new Error(`Invalid JSON ${sourceFile}`);
      }

      statements.push(tstl.createReturnStatement(
          [this.transformExpression(statement.expression)]));
    } else {
      this.pushScope(tstl.ScopeType.File);
      statements =
          this.performHoisting(this.transformStatements(sourceFile.statements));
      this.popScope();

      if (this.isModule) {
        // If export equals was not used. Create the exports table.
        // local exports = {}
        if (!this.visitedExportEquals) {
          statements.unshift(tstl.createVariableDeclarationStatement(
              this.createExportsIdentifier(), tstl.createTableExpression()));
        }

        // return exports
        // statements.push(
        //     tstl.createReturnStatement([this.createExportsIdentifier()]));
        const moduleCallExpression = tstl.createCallExpression(
            tstl.createIdentifier('tstl_register_module'), [
              tstl.createStringLiteral(this.currentSourceFile.fileName),
              this.createExportsIdentifier()
            ]);
        statements.push(tstl.createExpressionStatement(moduleCallExpression));
      }
    }

    return tstl.createBlock(statements, sourceFile);
  }
}
