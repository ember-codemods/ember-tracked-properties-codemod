const { getParser } = require('codemod-cli').jscodeshift;
const {
  addTrackedImport,
  getDependentKeys,
  buildTrackedDecorator,
} = require('./utils/helper');

module.exports = function transformer(file, api) {
  const classProps = [];
  let computedProps = [];
  let computedPropsMap = {};
  let shouldImportBeAdded = false;
  const j = getParser(api);

  j(file.source)
    .find(j.ClassBody)
    .forEach(path => {
      path.node.body.forEach(classItem => {
        // Collect all the class properties in the file and add it to the
        // classProps array.
        if (classItem.type === 'ClassProperty') {
          classProps.push(classItem.key.name);
        }
        // Collect all the dependent keys of the computed properties present in the file
        // and add it to the computedProps array.
        if (classItem.type === 'ClassMethod') {
          if (classItem.kind === 'get') {
            classProps.push(classItem.key.name);
          }
          if (classItem.decorators) {
            classItem.decorators.forEach(decoratorItem => {
              if (
                decoratorItem.expression.callee &&
                decoratorItem.expression.callee.name === 'computed'
              ) {
                const argValues = decoratorItem.expression.arguments.map(
                  item => item.value
                );
                computedPropsMap[classItem.key.name] = argValues;
                computedProps = computedProps.concat(argValues);
              }
            });
          }
        }
      });
    });

  // Iterate through all the class properties in the file and determine if
  // the property needs to be prefixed with @tracked.
  // If the class property exists in the `computedProps` array, then prefix
  // with @tracked. Also, set the `shouldImportBeAdded` to true which would help
  // determine if the import statement `@glimmer/tracking` needs to be added to
  // the file.
  const trackedConvertedSource = j(file.source)
    .find(j.ClassProperty)
    .forEach(path => {
      if (computedProps.includes(path.node.key.name)) {
        shouldImportBeAdded = true;
        var decorated = buildTrackedDecorator(
          path.node.key.name,
          path.node.value,
          j
        );
        path.replace(decorated);
      }
      return path;
    })
    .toSource();

  // Iterate on all the `computed` decorators and for each node, check if
  // all the arguments are a part of the `classProps` array, if so, then
  // remove the `@computed` decorator, else remove the arguments that are
  // defined locally in the class.
  const convertedResult = j(trackedConvertedSource)
    .find(j.Decorator)
    .filter(path => {
      return (
        path.node.expression.type === 'CallExpression' &&
        path.node.expression.callee &&
        path.node.expression.callee.name === 'computed'
      );
    })
    .forEach(path => {
      const dependentKeys = getDependentKeys(
        path.node.expression.arguments,
        computedPropsMap,
        classProps
      );
      if (!dependentKeys.length) {
        path.replace();
      } else {
        path.node.expression.arguments = dependentKeys;
      }
    });

  return shouldImportBeAdded
    ? addTrackedImport(convertedResult.toSource(), j)
    : convertedResult.toSource();
};
