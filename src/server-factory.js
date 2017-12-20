import Server from './server';
import express from 'express';

/**
 * Server factory
 */
class ServerFactory {
  /**
   * Creates server instance based on engine type.
   * @param {ServerFactory.Types} type Server engine types.
   * @return {Server}
   * @throws Error
   */
  static create(type = ServerFactory.Types.EXPRESS) {
    switch (type) {
      case ServerFactory.Types.EXPRESS:
        return new Server(express());
      default:
        throw new Error('Engine not implemented');
    }
  }
}

/**
 * Server engine types.
 * @enum {string}
 */
ServerFactory.Types = {
  EXPRESS: 'express',
};

export default ServerFactory;
