/**
 * @fileoverview WIP
 * @author Alexander Ivankov
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/sort-import-specifiers');


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
    "import {a, b, c} from './'",
  ],

  invalid: [
    {
      code: "import {b, c, a} from './'",
      errors: [{
        message: 'Invalid sort import specifiers',
        type: 'ImportDeclaration',
      }],
      output: "import {a, b, c} from './'",
    },
  ],
});
