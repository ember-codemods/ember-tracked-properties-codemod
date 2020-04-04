# replace-setters


## Usage

```
npx ember-tracked-properties-codemod replace-setters path/of/files/ or/some**/*glob.js

# or

yarn global add ember-tracked-properties-codemod
ember-tracked-properties-codemod replace-setters path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/replace-setters/__testfixtures__/basic.input.js)</small>):
```js
chad.set('firstName', 'Chad');
chad.set('lastName', 'Hietala');

```

**Output** (<small>[basic.output.js](transforms/replace-setters/__testfixtures__/basic.output.js)</small>):
```js
chad.firstName = 'Chad';
chad.lastName = 'Hietala';

```
<!--FIXTURES_CONTENT_END-->