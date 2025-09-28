const path = require('path');

module.exports = {
  mode: 'production',
  entry: './resources/download.js',
  output: {
    filename: 'download.bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  target: 'webworker',
};