/**
 * Exclusive disjunction implementation
 * @see https://en.wikipedia.org/wiki/Exclusive_or
 *
 * @param {boolean} a - first value
 * @param {boolean} b - second value
 * @returns {boolean}
 */
const xor = (a, b) => (a ? !b : b);


/**
 * Chat is Digit
 * @param {string} chr
 * @returns {boolean}
 */
const isDigit = (chr) => {
  const charCode = ch => ch.charCodeAt(0);
  const code = charCode(chr);
  return (code >= charCode('0')) && (code <= charCode('9'));
};


/**
 * Split string with create iterator by parts
 *
 * @param {string} str - string
 * @returns {object} - iterator by parts string
 */
const splitString = (str) => {
  // start index for slice()
  let from = 0;
  // index for iteration by string
  let index = 0;
  // count found parts
  let count = 0;

  // iterator object
  const splitter = {};

  splitter.count = () => count;

  splitter.next = () => {
    if (index === str.length) {
      return null;
    }

    while (index >= 0) {
      const currentIsDigit = isDigit(str.charAt(index - 1));
      const nextChar = str.charAt(index);
      const currentIsLast = (index === str.length);

      const isBorder = currentIsLast
          || xor(currentIsDigit, isDigit(nextChar));

      if (isBorder) {
        const part = str.slice(from, index);

        from = index;
        count += 1;
        index += 1;

        return {
          IsNumber: currentIsDigit,
          Value: currentIsDigit ? Number(part) : part,
        };
      }

      index += 1;
    }

    return null;
  };

  return splitter;
};


/**
 * Compare similar type value
 *
 * @param {any} a
 * @param {any} b
 * @returns {0 | 1}
 */
const compare = (a, b) => {
  if (a > b) {
    return 1;
  }

  if (a < b) {
    return -1;
  }

  return 0;
};


/**
 * Compare 2 strings by natural sort
 *
 * @param {string} str1
 * @param {string} str2
 * @returns {0 | 1}
 */
const compareStrings = (str1, str2) => {
  const splitter1 = splitString(str1);
  const splitter2 = splitString(str2);

  while (true) {
    const first = splitter1.next();
    const second = splitter2.next();

    if (first !== null && second !== null) {
      // compare parts of different types (numbers or non-numeric characters)
      if (xor(first.IsNumber, second.IsNumber)) {
        return first.IsNumber ? -1 : 1;
      }

      const comp = compare(first.Value, second.Value);

      if (comp !== 0) {
        return comp;
      }

      // ... if one of the lines is over, then it is "less"
    } else {
      return compare(splitter1.count(), splitter2.count());
    }
  }
};


/**
 * Natural Sort Function get from article habr.com
 * @see https://habr.com/ru/post/127943/
 *
 * @param {string[]} stringArray
 * @returns {string[]}
 */
function naturalSort(stringArray) {
  const arr = stringArray;
  return arr.sort(compareStrings);
}

module.exports = naturalSort;
