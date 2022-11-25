function copy(obj) {
  /**
   * Deep copy 
   * @param { Object, Array } obj
   */
  return JSON.parse(JSON.stringify(obj));
}

function ObjectFilter(obj, f) {
  /**
   * Filter entries of an object `obj` according to function `f` 
   * @param {Object} obj 
   * @param {Function} f 
   */
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => f(key, value))
  ); 
}

function ObjIsEmpty(obj) {
  return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
}

function minNumber(...args) {
  let ret = Infinity; 
  for (let i = 0; i < args.length; i++) {
    ret = (args[i] < ret ? args[i] : ret); 
  }
  return ret; 
}

module.exports = { copy, ObjectFilter, ObjIsEmpty, minNumber }; 