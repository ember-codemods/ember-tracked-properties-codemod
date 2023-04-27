const Stack = require('./stack');

/**
 * Returns the file source with potentially adding the import statement for "@glimmer/tracking".
 * If `@glimmer/tracking` import is not present in the file:
 *  - If there are existing imports, then add the `@glimmer/tracking` import to the top of the imports.
 *  - If there are no imports then add the `@glimmer/tracking` import at the top of the file.
 * @param {string} fileSource
 * @param {*} j
 */
function addTrackedImport(fileSource, j) {
  const root = j(fileSource);
  const imports = root.find(j.ImportDeclaration);
  const trackedImport = imports.filter(path => {
    return path.node.source.value === '@glimmer/tracking';
  });

  if (!trackedImport.length) {
    const trackedImportStatement =
      "import { tracked } from '@glimmer/tracking';";
    if (imports.length) {
      j(imports.at(0).get()).insertBefore(trackedImportStatement); // before the imports
    } else {
      root.get().node.program.body.unshift(trackedImportStatement); // begining of file
    }
    return root.toSource();
  }
  return fileSource;
}

/**
 * Return the array of arguments that are not local to the current class.
 * @param {*} computedArgs
 * @param {*} computedPropsMap
 * @param {*} classProperties
 */
function getDependentKeys(computedArgs, computedPropsMap, classProperties) {
  return computedArgs.filter(argItem => {
    return _doesContainNonLocalArgs(
      argItem.value,
      computedPropsMap,
      classProperties
    );
  });
}

/**
 * Return the array of arguments that are not simple, non-nested, Glimmer component arguments.
 * @param {*} computedArgs
 */
function filterGlimmerArgs(computedArgs) {
  return computedArgs.filter(argItem => !(argItem.value.startsWith('args.') && argItem.value.split('.').length === 2))
}

/**
 * Checks the chained dependency among the arguments to see if there is any
 * value that is not a local class property.
 * Returns true if there is any property that is not a local class property.
 * @param {*} argItem
 * @param {*} computedMap
 * @param {*} classProperties
 */
function _doesContainNonLocalArgs(argItem, computedMap, classProperties) {
  const stack = new Stack();
  let currItem = argItem;
  stack.push(argItem);

  while (stack.size() > 0) {
    currItem = stack.pop();
    const dependentKeys = computedMap[currItem];

    // If currItem is not a class property and
    // if it is not a computed property with dependent keys, return true.
    if (!classProperties.includes(currItem) && !dependentKeys) {
      return true;
    }
    // If currItem itself is a computed property, then it would have dependent keys.
    // Get the dependent keys and push them in the stack.
    if (dependentKeys) {
      stack.push(...dependentKeys);
    }
  }
  return false;
}

/**
 * Create and return a new tracked decorator node based on
 * the key and values provided.
 * @param {*} macroName
 * @param {*} name
 * @param {*} j
 */
function buildTrackedDecorator(name, j) {
  var node = j('class Fake { @tracked' + ' ' + name + '; \n}')
    .find(j.ClassProperty)
    .get().node;
  return node.decorators;
}

/**
 * Returns the formatted @tracked signature. After adding the @tracked decorator
 * to the source, if the class property has a value associated with it,
 * the @tracked decorator is add above the property instead of prefixing it inline.
 * This function will check if the length of characters including the @tracked addition
 * doesn't add up to more than 50 characters, then reformat it to be prefixed instead
 * of being on a separate line.
 * @param {string} trackedConvertedSource
 */
function reformatTrackedDecorators(trackedConvertedSource) {
  const matchedTracked = trackedConvertedSource.match(/@tracked\n(.*)\n/g);
  if (matchedTracked) {
    matchedTracked.forEach(matchedData => {
      const convertedMatchedData = matchedData.replace(
        /@tracked\n\s+/,
        '@tracked '
      );
      trackedConvertedSource = trackedConvertedSource.replace(
        matchedData,
        convertedMatchedData
      );
    });
  }
  return trackedConvertedSource;
}

module.exports = {
  addTrackedImport,
  getDependentKeys,
  buildTrackedDecorator,
  reformatTrackedDecorators,
  filterGlimmerArgs,
};
