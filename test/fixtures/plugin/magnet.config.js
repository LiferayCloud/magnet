const myPlugin = require('./my-plugin');

module.exports = {
  magnet: {
    port: 3000,
    host: 'localhost',
    logLevel: 'silent',
    plugins: [myPlugin],
  },
};
