const { getParser } = require('codemod-cli').jscodeshift;
const {
  addTrackedImport,
  getDependentKeys,
  buildTrackedDecorator,
  reformatTrackedDecorators,
  filterGlimmerArgs,
} = require('./utils/helper');

const { getOptions } = require('codemod-cli');
const DEFAULT_OPTIONS = {
  alwaysPrefix: 'true',
};

/**
 * Return true if the computed property is readOnly.
 * @param {*} nodeItem
 */
function _isReadOnlyComputedProperty(nodeItem) {
  return (
    _isComputedProperty(nodeItem) &&
    nodeItem.expression.callee.property &&
    nodeItem.expression.callee.property.name === 'readOnly'
  );
}

/**
 * Return true if the nodeItem is a computed property. It could either
 * be a regular or readOnly computed property.
 * @param {*} nodeItem
 */
function _isComputedProperty(nodeItem) {
  return (
    nodeItem.expression.callee &&
    (nodeItem.expression.callee.name === 'computed' ||
      (nodeItem.expression.callee.object &&
        nodeItem.expression.callee.object.callee.name === 'computed'))
  );
}

/**
 * If the nodeItem is a computed property, then return an array of argument values.
 * @param {*} nodeItem
 */
function _getArgValues(nodeItem) {
  if (_isComputedProperty(nodeItem)) {
    const nodeArguments = _isReadOnlyComputedProperty(nodeItem)
      ? nodeItem.expression.callee.object.arguments
      : nodeItem.expression.arguments;

    return nodeArguments.map(item => item.value);
  }
}

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
        // classProps array. If there is a decorator associated with a class
        // property, then only add it to the array if it is a @tracked property.
        if (
          classItem.type === 'ClassProperty' &&
          (!classItem.decorators ||
            classItem.decorators.every(
              item => item.expression.name === 'tracked'
            ))
        ) {
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
            const argValues = _getArgValues(decoratorItem);
            if (argValues) {
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

  /**
   * Iterate on all the class items, if the class item has decorators and it is not a dependent
   * key of some other property, then go ahead and check if the `computed` decorator can be safely removed.
   */
  const convertedResult = j(trackedConvertedSource)
    .find(j.ClassBody)
    .forEach(path => {
      path.node.body.forEach(classItem => {
        const propName = classItem.key.name;
        // Check if the class item is not a dependent key of any other computed properties in the class
        // and if the item has any decorators.
        if (
          !Object.keys(computedPropsMap).some(item =>
            computedPropsMap[item].includes(propName)
          ) &&
          classItem.decorators
        ) {
          classItem.decorators.forEach((decoratorItem, i) => {
            if (
              decoratorItem.expression.type === 'CallExpression' &&
              _isComputedProperty(decoratorItem)
            ) {
              const isReadOnlyProperty = _isReadOnlyComputedProperty(
                decoratorItem
              );
              const computedPropArguments = isReadOnlyProperty
                ? decoratorItem.expression.callee.object.arguments
                : decoratorItem.expression.arguments;

              let dependentKeys = getDependentKeys(
                computedPropArguments,
                computedPropsMap,
                classProps
              );
              dependentKeys = filterGlimmerArgs(dependentKeys);
              // If all the arguments of the decorator are class properties, then remove the decorator completely
              // from the item.
              if (!dependentKeys.length) {
                classItem.decorators.splice(i, 1);
              }
            }
          });
        }
      });
    });

  return shouldImportBeAdded
    ? addTrackedImport(convertedResult.toSource(), j)
    : convertedResult.toSource();
};
