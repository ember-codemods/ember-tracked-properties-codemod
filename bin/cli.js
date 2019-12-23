#!/usr/bin/env node
'use strict';

require('codemod-cli').runTransform(
  __dirname,
  'tracked-properties' /* transform name */,
  process.argv.slice(2) /* paths or globs */
);
