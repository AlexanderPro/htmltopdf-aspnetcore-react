const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');
const dist = '../HtmlToPdf/wwwroot';

module.exports = function(env) {
  const production = env && env.production;
  const postCssOptions = {
    context: '/',
    postcss: function() {
      return {
        defaults: [autoprefixer],
        custom: [
          autoprefixer({
            browsers: [
              'ie >= 11',
              'last 2 versions'
            ]
          })
        ]
      };
    }
  };

  const plugins = [
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin({
      filename: 'style.css'
      //allChunks: true
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: true
    })
  ];

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, dist),
      publicPath: '/',
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.min\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: {
              loader: 'css-loader?-url'
            }
          }),
        },
        {
          test: /\.(sass|scss)$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader?-url', {loader: 'postcss-loader', options: postCssOptions}, 'sass-loader']
          })
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: 'file?name=fonts/[name].[ext]'
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: 'file-loader?name=images/[name].[ext]'
        },
        {
          test: /\.(js|jsx)$/,
          use: {
            loader: 'babel?cacheDirectory'
          },
          exclude: /node_modules/
        }
      ]
    },
    plugins: plugins,
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    },
    resolveLoader: {
      moduleExtensions: ['-loader'],
    },
    devtool: production ? '' : 'inline-source-map',
    devServer: {
      hot: true,
      historyApiFallback: true,
      contentBase: path.resolve(__dirname, dist),
      publicPath: '/',
      proxy: {
        '/api': {
          target: 'http://localhost:5000'
        }
      }
    }
  };
};