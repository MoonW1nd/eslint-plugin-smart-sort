/**
 * @fileoverview sort specifiers import
 * @author Alexander Ivankov
 */

const naturalSort = require('../helpers/naturalSort');
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'WIP',
      category: 'Fill me in',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      // fill in your schema
    ],
  },

  create(context) {
    const NEWLINE = /(\r?\n)/;
    const NODE_TYPE = {
      IDENTIFIER: 'Identifier',
      PUNCTUATOR: 'Punctuator',
      IMPORT_SPECIFIER: 'ImportSpecifier',
      IMPORT_DECLARATION: 'ImportDeclaration',
    };

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    // Like `Array.prototype.flatMap`, had it been available.
    function flatMap(array, fn) {
      return [].concat(...array.map(fn));
    }

    function parseWhitespace(whitespace) {
      const allItems = whitespace.split(NEWLINE);
      const items = allItems.length >= 5
        ? allItems.slice(0, 2).concat(allItems.slice(-1))
        : allItems;

      return (
        items
          .map((spacesOrNewline, index) => (index % 2 === 0
            ? { type: 'Spaces', code: spacesOrNewline }
            : { type: 'Newline', code: spacesOrNewline }))
          .filter(token => token.code !== '')
      );
    }

    const isIdentifier = node => node.type === NODE_TYPE.IDENTIFIER;

    const isImportDeclaration = node => node.type === NODE_TYPE.IMPORT_DECLARATION;

    const isPunctuator = (node, value) => node.type === NODE_TYPE.PUNCTUATOR
      && node.value === value;

    const isImportSpecifier = node => node.type === NODE_TYPE.IMPORT_SPECIFIER;

    function getAllTokens(node, sourceCode) {
      const tokens = sourceCode.getTokens(node);
      const lastTokenIndex = tokens.length - 1;
      return flatMap(tokens, (token, tokenIndex) => {
        const newToken = Object.assign({}, token, {
          code: sourceCode.getText(token),
        });

        if (tokenIndex === lastTokenIndex) {
          return [newToken];
        }

        const comments = sourceCode.getCommentsAfter(token);
        const last = comments.length > 0 ? comments[comments.length - 1] : token;
        const nextToken = tokens[tokenIndex + 1];

        return [
          newToken,
          ...flatMap(comments, (comment, commentIndex) => {
            const previous = commentIndex === 0 ? token : comments[commentIndex - 1];
            return [
              ...parseWhitespace(
                sourceCode.text.slice(previous.range[1], comment.range[0]),
              ),
              Object.assign({}, comment, { code: sourceCode.getText(comment) }),
            ];
          }),
          ...parseWhitespace(
            sourceCode.text.slice(last.range[1], nextToken.range[0]),
          ),
        ];
      });
    }

    // Prints tokens that are enhanced with a `code` property – like those returned
    // by `getAllTokens` and `parseWhitespace`.
    function printTokens(tokens) {
      return tokens.map(token => token.code).join('');
    }

    const getTemplate = ({ tokens, specifiersMap }) => {
      const template = [];
      let specifierLength = 0;
      let currentSpecifierName = null;
      let indexSpecifierPosition = 0;

      tokens.forEach((token) => {
        if (specifierLength === 0) {
          if (isIdentifier(token)) {
            currentSpecifierName = token.value;
            const specifierTokens = specifiersMap[currentSpecifierName].tokens;
            specifierLength = specifierTokens.length - 1;
            template.push(String(indexSpecifierPosition));
            indexSpecifierPosition += 1;
          } else {
            template.push(token);
          }
        } else {
          specifierLength -= 1;
        }
      });

      return template;
    };

    const constructTokens = (sortedNameItems, template, specifiersMap) => {
      const tokens = template.slice();
      let indexOverhead = 0;
      template.forEach((item, i) => {
        if (typeof item === 'string') {
          const name = sortedNameItems[Number(item)];


          tokens.splice(i + indexOverhead, 1, ...specifiersMap[name].tokens);
          if (specifiersMap[name].tokens.length > 1) {
            indexOverhead += specifiersMap[name].tokens.length - 1;
          }
        }
      });

      return tokens;
    };

    function printSortedSpecifiers({
      importNode,
      sourceCode,
      sortedSpecifierNames,
      specifiersMap,
    }) {
      const allTokens = getAllTokens(importNode, sourceCode);
      const openBraceIndex = allTokens.findIndex(token => isPunctuator(token, '{'));
      const closeBraceIndex = allTokens.findIndex(token => isPunctuator(token, '}'));

      const specifierTokens = allTokens.slice(openBraceIndex + 1, closeBraceIndex);
      const template = getTemplate(
        { tokens: specifierTokens, specifiersMap },
      );

      const newTokens = constructTokens(sortedSpecifierNames, template, specifiersMap);

      return printTokens([
        ...allTokens.slice(0, openBraceIndex + 1),
        ...newTokens,
        ...allTokens.slice(closeBraceIndex),
      ]);
    }

    const getSpecifiersMap = (specifiers, sourceCode) => {
      const specifiersMap = {};

      specifiers.forEach((specifier) => {
        const { name } = specifier.imported;
        specifiersMap[name] = {
          specifier,
          tokens: getAllTokens(specifier, sourceCode),
        };
      });

      return specifiersMap;
    };


    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
      ImportDeclaration(node) {
        const { specifiers } = node;
        const sourceCode = context.getSourceCode();
        const importSpecifiers = isImportDeclaration(node)
          ? specifiers.filter(specifier => isImportSpecifier(specifier))
          : [];

        if (importSpecifiers.length > 1) {
          const specifiersMap = getSpecifiersMap(importSpecifiers, sourceCode);
          const names = Object.keys(specifiersMap);
          const sortedSpecifierNames = naturalSort(names.slice());

          const isCorrectSorted = names.every((name, i) => name === sortedSpecifierNames[i]);

          if (!isCorrectSorted) {
            context.report({
              node,
              message: 'Invalid sort import specifiers',
              fix(fixer) {
                return fixer
                  .replaceText(node, printSortedSpecifiers({
                    importNode: node,
                    sortedSpecifierNames,
                    specifiersMap,
                    sourceCode,
                  }));
              },
            });
          }
        }
      },
    };
  },
};
