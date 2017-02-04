import {isDefAndNotNull, isNull, isFunction, isObject} from './util';

/**
 * Asserts value is defined and not null.
 * @param  {Object} value
 * @param  {string} errorMessage Error message
 */
export function assertDefAndNotNull(value, errorMessage) {
  if (!isDefAndNotNull(value)) {
    throw new Error(errorMessage);
  }
}

/**
 * Asserts value is not null.
 * @param  {Object} value
 * @param  {string} errorMessage Error message
 */
export function assertNotNull(value, errorMessage) {
  if (isNull(value)) {
    throw new Error(errorMessage);
  }
}

/**
 * Asserts value is a function.
 * @param  {Function} value
 * @param  {string} errorMessage Error message
 */
export function assertFunction(value, errorMessage) {
  if (!isFunction(value)) {
    throw new Error(errorMessage);
  }
}

/**
 * Asserts value is an object.
 * @param  {Object} value
 * @param  {string} errorMessage Error message
 */
export function assertObject(value, errorMessage) {
  if (!isObject(value)) {
    throw new Error(errorMessage);
  }
}
