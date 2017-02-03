/**
 * Base Engine.
 */
class BaseEngine {

  /**
   * Constructor.
   */
  constructor() {
    if (new.target === BaseEngine) {
      throw new TypeError('Cannot construct BaseEngine instances directly.');
    }
  }

  /**
   * Gets server engine.
   * @return {Object}
   */
  getEngine() {
    return this.engine_;
  }

  /**
   * Sets server engine.
   * @param {Object} engine
   */
  setEngine(engine) {
    this.engine_ = engine;
  }
}

export default BaseEngine;
