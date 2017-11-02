import Server from './server';
import ServerFactory from './server-factory';

describe('ServerFactory', () => {
  test('creates an instance of a server', () => {
    let server = ServerFactory.create();
    expect(server instanceof Server).toBeTruthy();
  });

  test('creates an instance of a server with express by default', () => {
    let server = ServerFactory.create();
    expect(isExpress(server.getEngine())).toBeTruthy();
  });

  test('creates an instance of a express by passing a param', () => {
    const server = ServerFactory.create(ServerFactory.Types.EXPRESS);
    expect(isExpress(server.getEngine())).toBeTruthy();
  });

  test('throws an error if the specified type is not implemented', () => {
    expect(() => {
      ServerFactory.create('notImplemented');
    }).toThrow('Engine not implemented');
  });
});
