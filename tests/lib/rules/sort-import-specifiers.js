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


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("sort-import-specifiers", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "WIP",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
