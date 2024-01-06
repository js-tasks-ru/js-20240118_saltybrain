/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const set = new Set(fields);
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (!set.has(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

const obj = {foo: 'foo', bar: 'bar', baz: 'baz'};
console.log(omit(obj, 'test'));