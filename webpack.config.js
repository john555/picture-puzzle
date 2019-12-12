const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { NODE_ENV } = process.env;

const config = {
  mode: NODE_ENV || 'production',
  target: 'web',
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'puzzle.js',
    library: '',
    libraryTarget: 'window',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};

const plugins = [];

const devServer = {
  contentBase: path.join(__dirname, 'dist'),
  compress: true,
  port: 3000,
};

if (NODE_ENV === 'development') {
  config.devtool = 'inline-source-map';
  config.devServer = devServer;

  plugins.push(
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
    }),
  );
}

config.plugins = plugins;

module.exports = config;
