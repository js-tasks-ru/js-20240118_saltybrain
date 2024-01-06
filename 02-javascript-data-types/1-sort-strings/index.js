/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
const compareStrs = (str1, str2) => str1.localeCompare(str2);

export function sortStrings(arr, param = "asc") {
  const temp = [...arr];
  return temp.sort((a, b) => {
    const isEqual = a.toLowerCase() === b.toLowerCase();
    const compareEqual = param === 'desc' ? compareStrs(a, b) : compareStrs(b, a);
    const compareOther = param === 'desc' ? compareStrs(b, a) : compareStrs(a, b);
    return isEqual ? compareEqual : compareOther;
  });
}
