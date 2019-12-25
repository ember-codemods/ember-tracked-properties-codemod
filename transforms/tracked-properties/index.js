const { getParser } = require('codemod-cli').jscodeshift;
const {
  addTrackedImport,
  getDependentKeys,
  buildTrackedDecorator,
  reformatTrackedDecorators,
} = require('./utils/helper');

const { getOptions } = require('codemod-cli');
const DEFAULT_OPTIONS = {
  alwaysPrefix: 'true',
};

module.exports = function transformer(file, api) {
  const configOptions = Object.assign({}, DEFAULT_OPTIONS, getOptions());
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
        if (classItem.type === 'ClassProperty' && !classItem.decorators) {
          classProps.push(classItem.key.name);
        }
        // Collect all the dependent keys of the computed properties present in the file
        // and add it to the computedProps array.
        if (
          classItem.type === 'ClassMethod' &&
          classItem.kind === 'get' &&
          classItem.decorators
        ) {
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
      });
    });

  // Iterate through all the class properties in the file and determine if
  // the property needs to be prefixed with @tracked.
  // If the class property exists in the `computedProps` array, then prefix
  // with @tracked. Also, set the `shouldImportBeAdded` to true which would help
  // determine if the import statement `@glimmer/tracking` needs to be added to
  // the file.
  let trackedConvertedSource = j(file.source)
    .find(j.ClassProperty)
    .forEach(path => {
      if (!path.node.decorators && computedProps.includes(path.node.key.name)) {
        shouldImportBeAdded = true;
        const trackedDecorator = buildTrackedDecorator(path.node.key.name, j);
        
        // @TODO: Determine if @tracked can be prefixed alongside other decorators in a property,
        // if yes, then change this code to push the trackedDecorator along with the
        // others.
        path.node.decorators = trackedDecorator;
      }
      return path;
    })
    .toSource();

  if (configOptions.alwaysPrefix === 'true') {
    trackedConvertedSource = reformatTrackedDecorators(trackedConvertedSource);
  }

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
