import ExpressEngine from './express-engine';

/**
 * Server engine factory
 */
class ServerEngineFactory {
  /**
   * Constructor
   * @param  {String} type Engine type
   */
  constructor(type = 'express') {
    this.factoryType = type;
  }

  /**
   * Creates factory.
   * @return {BaseEngine|Error}
   */
  create() {
    if(this.factoryType === 'express') {
      return new ExpressEngine();
    } else {
      throw new Error('Engine not implemented.');
    }
  }
}

export default ServerEngineFactory;
