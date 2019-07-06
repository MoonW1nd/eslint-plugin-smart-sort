/**
 * @fileoverview WIP
 * @author Alexander Ivankov
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/sort-import-specifiers"),

RuleTester = require("eslint").RuleTester;

RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module"
    }
});


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("sort-import-specifiers", rule, {

    valid: [
        "import {a, b, c} from './'"
    ],

    invalid: [
        {
            code: "import {b, c, a} from './'",
            errors: [{
                message: 'Not correct sort import specifiers',
                type: 'ImportDeclaration'
              }]
        }
    ]
});
