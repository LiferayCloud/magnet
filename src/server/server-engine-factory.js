import ExpressEngine from "./express-engine";

class ServerEngineFactory {
  constructor(type = 'express') {
    this.factoryType = type;
  }

  create() {
    if(this.factoryType === 'express') {
      return new ExpressEngine();
    } else {
      throw new Error("Engine not implemented.");
    }
  }

}

export default ServerEngineFactory;
