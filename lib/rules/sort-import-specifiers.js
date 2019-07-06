/**
 * @fileoverview sort specifiers import
 * @author Alexander Ivankov
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "WIP",
            category: "Fill me in",
            recommended: false
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function(context) {

        // variables should be defined here

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------
        const getNameSpecifiers = specifiers => specifiers.map(specifier => specifier.imported.name);

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------
        return {
            ImportDeclaration: function(node) {
                const specifiers = node.specifiers;
                const names = getNameSpecifiers(specifiers);
                const sortedNames = names.slice().sort();

                const isCorrectSorted = names.every((name, i) => name === sortedNames[i]);

                if (!isCorrectSorted) {
                    context.report(node, 'Not correct sort import specifiers');
                }
            }

            // give me methods

        };
    }
};
