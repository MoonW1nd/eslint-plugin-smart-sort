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
    fixable: 'code', // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },

  create(context) {
    // variables should be defined here
    const NEWLINE = /(\r?\n)/;
    const NODE_TYPE = {
      IDENTIFIER: 'Identifier',
      PUNCTUATOR: 'Punctuator',
      IMPORT_SPECIFIER: 'ImportSpecifier',
    };

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const getSpecifiersMap = (specifiers) => {
      const specifiersMap = {};

      specifiers.forEach((specifier) => { specifiersMap[specifier.imported.name] = specifier; });

      return specifiersMap;
    };

    // Like `Array.prototype.flatMap`, had it been available.
    function flatMap(array, fn) {
      return [].concat(...array.map(fn));
    }

    function parseWhitespace(whitespace) {
      const allItems = whitespace.split(NEWLINE);

      // Remove blank lines. `allItems` contains alternating `spaces` (which can be
      // the empty string) and `newline` (which is either "\r\n" or "\n"). So in
      // practice `allItems` grows like this as there are more newlines in
      // `whitespace`:
      //
      //     [spaces]
      //     [spaces, newline, spaces]
      //     [spaces, newline, spaces, newline, spaces]
      //     [spaces, newline, spaces, newline, spaces, newline, spaces]
      //
      // If there are 5 or more items we have at least one blank line. If so, keep
      // the first `spaces`, the first `newline` and the last `spaces`.
      const items = allItems.length >= 5
        ? allItems.slice(0, 2).concat(allItems.slice(-1))
        : allItems;

      return (
        items
          .map((spacesOrNewline, index) => (index % 2 === 0
            ? { type: 'Spaces', code: spacesOrNewline }
            : { type: 'Newline', code: spacesOrNewline }))
        // Remove empty spaces since it makes debugging easier.
          .filter(token => token.code !== '')
      );
    }

    const isIdentifier = node => node.type === NODE_TYPE.IDENTIFIER;

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

    function printSortedSpecifiers(importNode, sourceCode, sortedNames) {
      const allTokens = getAllTokens(importNode, sourceCode);
      const openBraceIndex = allTokens.findIndex(token => isPunctuator(token, '{'));
      const closeBraceIndex = allTokens.findIndex(token => isPunctuator(token, '}'));

      // Exclude "ImportDefaultSpecifier" – the "def" in `import def, {a, b}`.
      const specifiers = importNode.specifiers.filter(node => isImportSpecifier(node));

      if (
        openBraceIndex === -1
          || closeBraceIndex === -1
          || specifiers.length <= 1
      ) {
        return printTokens(allTokens);
      }

      const specifierTokens = allTokens.slice(openBraceIndex + 1, closeBraceIndex);

      const processSpecifiersTokens = (tokens) => {
        const result = {
          specifiers: {
          },
          shape: [],
        };
        let isTokenStart = false;
        let currentSpecifierName = null;
        let indexSpecifierPosition = 0;

        tokens.forEach((token, i) => {
          if (isIdentifier(token) && !isTokenStart) {
            isTokenStart = true;
            currentSpecifierName = token.value;
            result.specifiers[currentSpecifierName] = [token];
            if (tokens.length - 1 === i) {
              result.shape.push(String(indexSpecifierPosition));
            }
          } else if (isPunctuator(token, ',')) {
            isTokenStart = false;
            result.shape.push(String(indexSpecifierPosition));
            indexSpecifierPosition += 1;
            currentSpecifierName = null;
            result.shape.push(token);
          } else if (isTokenStart) {
            result.specifiers[currentSpecifierName].push(token);
          } else {
            result.shape.push(token);
          }
        });

        return result;
      };

      const procesedSpecifiers = processSpecifiersTokens(specifierTokens);

      const constructTokens = (sortedNameItems, processedSpecifiers) => {
        const tokens = processedSpecifiers.shape.slice();
        let indexOverhead = 0;
        processedSpecifiers.shape.forEach((item, i) => {
          if (typeof item === 'string') {
            const name = sortedNameItems[Number(item)];


            tokens.splice(i + indexOverhead, 1, ...processedSpecifiers.specifiers[name]);
            if (processedSpecifiers.specifiers[name].length > 1) {
              indexOverhead = processedSpecifiers.specifiers[name].length - 1;
            }
          }
        });

        return tokens;
      };

      const newTokens = constructTokens(sortedNames, procesedSpecifiers);

      return printTokens([
        ...allTokens.slice(0, openBraceIndex + 1),
        ...newTokens,
        ...allTokens.slice(closeBraceIndex),
      ]);
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
      ImportDeclaration(node) {
        const { specifiers } = node;
        const specifiersMap = getSpecifiersMap(specifiers);
        const names = Object.keys(specifiersMap);
        const sortedNames = naturalSort(names.slice());
        const sourceCode = context.getSourceCode();

        const isCorrectSorted = names.every((name, i) => name === sortedNames[i]);

        if (!isCorrectSorted) {
          context.report({
            node,
            message: 'Not correct sort import specifiers',
            fix(fixer) {
              return fixer.replaceText(node, printSortedSpecifiers(node, sourceCode, sortedNames));
            },
          });
        }
      },

      // give me methods

    };
  },
};
