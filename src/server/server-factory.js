import express from 'express';
import Server from '../../src/server/server';

/**
 * Server factory
 */
class ServerFactory {
  /**
   * Creates factory.
   * @param {ServerFactory.Types} type
   * @return {BaseEngine}
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
 * Types of server engines.
 * @enum {string}
 */
ServerFactory.Types = {
  EXPRESS: 'express',
};

export default ServerFactory;
