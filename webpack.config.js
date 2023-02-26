const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  env: {
    REACT_APP_API_HOST: process.env.REACT_APP_API_HOST,
    REACT_APP_GOOGLE_MAPS_KEY: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    REACT_APP_CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
    REACT_APP_AUTH0_DOMAIN: process.env.REACT_APP_AUTH0_DOMAIN,
    REACT_APP_AUTH0_CLIENT_ID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    SKIP_PREFLIGHT_CHECK: process.env.SKIP_PREFLIGHT_CHECK,
  },
  resolve: {
    fallback: {
      fs: false,
      os: false,
    },
  },
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
