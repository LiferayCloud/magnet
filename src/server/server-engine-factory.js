import ExpressEngine from './express-engine';

/**
 * Server engine factory
 */
class ServerEngineFactory {
  /**
   * Creates factory.
   * @param {ServerEngineFactory.Types} type
   * @return {BaseEngine}
   * @throws Error
   */
  static create(type = ServerEngineFactory.Types.EXPRESS) {
    switch (type) {
      case ServerEngineFactory.Types.EXPRESS:
        return new ExpressEngine();
      default:
        throw new Error('Engine not implemented');
    }
  }
}

/**
 * Types of server engines.
 * @enum {string}
 */
ServerEngineFactory.Types = {
  EXPRESS: 'express',
};

export default ServerEngineFactory;
