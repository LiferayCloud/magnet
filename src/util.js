/**
 * Returns true if the specified value is a boolean.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
export function isBoolean(val) {
  return typeof val === 'boolean';
}

/**
 * Returns true if the specified value is not undefined.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
export function isDef(val) {
  return val !== undefined;
}

/**
 * Returns true if value is not undefined or null.
 * @param {*} val
 * @return {boolean}
 */
export function isDefAndNotNull(val) {
  return isDef(val) && !isNull(val);
}

/**
 * Returns true if the specified value is a function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
export function isFunction(val) {
  return typeof val === 'function';
}

/**
 * Returns true if value is null.
 * @param {*} val
 * @return {boolean}
 */
export function isNull(val) {
  return val === null;
}

/**
 * Returns true if the specified value is a number.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
export function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Returns true if the specified value is an object. This includes arrays
 * and functions.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
export function isObject(val) {
  const type = typeof val;
  return type === 'object' && val !== null || type === 'function';
}

/**
 * Returns true if value is a Promise.
 * @param {*} val
 * @return {boolean}
 */
export function isPromise(val) {
  return val && typeof val === 'object' && typeof val.then === 'function';
}

/**
 * Returns true if value is a string.
 * @param {*} val
 * @return {boolean}
 */
export function isString(val) {
  return typeof val === 'string' || val instanceof String;
}
