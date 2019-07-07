/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */

/**
 * Natural Sort Function get from article habr.com
 * @see https://habr.com/ru/post/127943/
 *
 * @param {*} array
 */
function naturalSort(stringArray) {
  // логическое исключающее "или"
  const xor = (a, b) => (a ? !b : b);

  // проверяет, является ли символ цифрой
  const isDigit = (chr) => {
    const charCode = ch => ch.charCodeAt(0);
    const code = charCode(chr);
    return (code >= charCode('0')) && (code <= charCode('9'));
  };
    // возвращает итератор для строки
  const splitString = (str) => {
    let from = 0; // начальный индекс для slice()
    let index = 0; // индекс для прохода по строке
    let count = 0; // количество уже найденных частей
    const splitter = {}; // будущий итератор
    // аналог свойства только для чтения
    splitter.count = () => count;
    // возвращает следующую часть строки
    splitter.next = () => {
      // если строка закончилось - вернём null
      if (index === str.length) {
        return null;
      }
      // перебираем символы до границы между нецифровыми символами и цифрами
      while (++index) {
        const currentIsDigit = isDigit(str.charAt(index - 1));
        const nextChar = str.charAt(index);
        const currentIsLast = (index === str.length);
        // граница - если символ последний,
        // или если текущий и следующий символы разнотипные (цифра / не цифра)
        const isBorder = currentIsLast
            || xor(currentIsDigit, isDigit(nextChar));
        if (isBorder) {
          const part = str.slice(from, index);
          from = index;
          count++;
          return {
            IsNumber: currentIsDigit,
            Value: currentIsDigit ? Number(part) : part,
          };
        } // end if
      } // end while

      return null;
    }; // end next()

    return splitter;
  };
    // сравнивает строки в "естественном" порядке
  const compareStrings = (str1, str2) => {
    // обычное сравнение строк или чисел
    const compare = (a, b) => ((a < b) ? -1 : (a > b) ? 1 : 0);

    // получаем итераторы для строк
    const splitter1 = splitString(str1);
    const splitter2 = splitString(str2);

    // перебираем части
    while (true) {
      const first = splitter1.next();
      const second = splitter2.next();

      // если обе части существуют ...
      if (first !== null && second !== null) {
        // части разных типов (цифры либо нецифровые символы)
        if (xor(first.IsNumber, second.IsNumber)) {
          // цифры всегда "меньше"
          return first.IsNumber ? -1 : 1;
        }

        // части одного типа можно просто сравнить
        const comp = compare(first.Value, second.Value);

        if (comp !== 0) {
          return comp;
        }

        // ... если же одна из строк закончилась - то она "меньше"
      } else {
        return compare(splitter1.count(), splitter2.count());
      }
    }
  };

  const arr = stringArray;
  return arr.sort(compareStrings);
}

module.exports = naturalSort;
