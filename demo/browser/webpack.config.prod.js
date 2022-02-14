const config = require('./webpack.config');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  ...config,
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  plugins: [...(config.plugins || []), new CleanWebpackPlugin()]
};
