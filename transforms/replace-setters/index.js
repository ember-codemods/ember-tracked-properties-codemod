const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

module.exports = function transformer(file, api) {
  const j = getParser(api);

  const root = j(file.source);

  root.find(j.ExpressionStatement, {
    expression: {
      type: 'CallExpression',
      callee: {
        property: {
          name: "set"
        }
      }
    }
  }).replaceWith(path => {
    return j.expressionStatement(
      j.assignmentExpression(
        "=",
        j.memberExpression(
          path.value.expression.callee.object, 
          j.identifier(path.value.expression.arguments[0].value),
          false
        ),
        path.value.expression.arguments[1]
      )
    );
  });

  return root.toSource();

}