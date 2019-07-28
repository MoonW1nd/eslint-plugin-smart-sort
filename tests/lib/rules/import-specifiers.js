/**
 * @fileoverview WIP
 * @author Alexander Ivankov
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/import-specifiers');


RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('sort-import-specifiers', rule, {

  valid: [
    "import {a, b, c} from './';",
    "import React from 'react';",
    "import {connect} from 'react-redux';",
    "import {a1, a2, a10} from './';",
    "import {A, a1,  a2, a10} from './';",
    'import * as numbers from "./nums";',
    "import {A, B,  a2, a10} from './';",
  ],

  invalid: [
    {
      code: 'import {b, a, c} from \'../\';',
      errors: [{
        message: 'Invalid sort import specifiers',
        type: 'ImportDeclaration',
      }],
      output: 'import {a, b, c} from \'../\';',
    },
    {
      code: 'import t, {b, a, f, c} from \'../\';',
      errors: [{
        message: 'Invalid sort import specifiers',
        type: 'ImportDeclaration',
      }],
      output: 'import t, {a, b, c, f} from \'../\';',
    },
    {
      code: 'import t, {b, a10, a1, a2} from \'../\';',
      errors: [{
        message: 'Invalid sort import specifiers',
        type: 'ImportDeclaration',
      }],
      output: 'import t, {a1, a2, a10, b} from \'../\';',
    },
    {
      code: 'import t, {b, B, a2, a10, A} from \'../\';',
      errors: [{
        message: 'Invalid sort import specifiers',
        type: 'ImportDeclaration',
      }],
      output: 'import t, {A, B, a2, a10, b} from \'../\';',
    },
    {
      code: 'import t, {  b  ,  B  ,  a2  ,  a10  ,  A  } from \'../\';',
      errors: [{
        message: 'Invalid sort import specifiers',
        type: 'ImportDeclaration',
      }],
      output: 'import t, {  A  ,  B  ,  a2  ,  a10  ,  b  } from \'../\';',
    },
    {
      code: 'import t, { b as d, B, a2, a10, A } from \'../\';',
      errors: [{
        message: 'Invalid sort import specifiers',
        type: 'ImportDeclaration',
      }],
      output: 'import t, { A, B, a2, a10, b as d } from \'../\';',
    },
    {
      code: `
      import t, {
        b,
        B,
        a2,
        a10,
        A,
      } from '../';
      `,
      errors: [{
        message: 'Invalid sort import specifiers',
        type: 'ImportDeclaration',
      }],
      output: `
      import t, {
        A,
        B,
        a2,
        a10,
        b,
      } from '../';
      `,
    },
  ],
});
