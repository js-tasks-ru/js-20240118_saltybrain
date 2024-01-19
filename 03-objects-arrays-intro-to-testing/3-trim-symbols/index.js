/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }
  let count = 0;
  let result = "";

  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    const lastSymbol = result[result.length - 1];
    if (char === lastSymbol) {
      count++;
    } else {
      count = 1;
    }

    if (count <= size) {
      result += char;
    }
  }

  return result;
}
