# ember-tracked-properties-codemod

[![Build Status](https://travis-ci.com/suchitadoshi1987/ember-tracked-properties-codemod.svg?branch=master)](https://travis-ci.com/suchitadoshi1987/ember-tracked-properties-codemod)
[![npm](https://img.shields.io/npm/v/ember-tracked-properties-codemod.svg?label=npm)](https://www.npmjs.com/package/ember-tracked-properties-codemod)
[![Coverage Status](https://coveralls.io/repos/github/ember-codemods/ember-tracked-properties-codemod/badge.svg?branch=master)](https://coveralls.io/github/ember-codemods/ember-tracked-properties-codemod?branch=master)
[![dependencies Status](https://david-dm.org/ember-codemods/ember-tracked-properties-codemod/status.svg)](https://david-dm.org/ember-codemods/ember-tracked-properties-codemod)
[![devDependencies Status](https://david-dm.org/ember-codemods/ember-tracked-properties-codemod/dev-status.svg)](https://david-dm.org/ember-codemods/ember-tracked-properties-codemod?type=dev)

A codemod for transforming your ember app code to start using `@tracked` properties.



## Pre-requisites

- Since `@tracked` properties is supported from the `3.13` version of Ember, this codemod should only be used for apps with version `3.13+`.
- This codemod only supports native classes. To get the most out of this codemod, you would need to run the [Ember Native class codemod](https://github.com/ember-codemods/ember-native-class-codemod) first.

## Usage

```
npx ember-tracked-properties-codemod path/of/files/ or/some**/*glob.js
```
    
The codemod accepts the following options:

|        Option         |  Value  |             Default             |                                                                     Details                                                                      |
| --------------------- | ------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--always-prefix`      | boolean | `true`                          | Always prefix `@tracked` inline                                                                             |

## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`

