const path = require('path');

module.exports = {
  resolve: {
    alias: {
      compounds: path.resolve(__dirname, "src/compounds/"),
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /node_modules[\\/]canvg/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
};
