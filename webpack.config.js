var webpack = require('webpack');
var JS_REGEX = /\.js$|\.jsx$|\.es6$|\.babel$/;

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"dev"'
      }
    })
  ],
  context: __dirname + "/src",
  entry: {
    javascript: "./example/main.js",
    html: "./example/index.html"
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  output: {
    filename: "example/main.js",
    path: __dirname + "/dist"
  },

  module: {
    preLoaders: [{test: JS_REGEX, exclude: /node_modules|libs/, loader: 'eslint'}],
    loaders: [
      {test: JS_REGEX, exclude: /node_modules/, loaders: ["babel-loader"]},
      {test: JS_REGEX, exclude: /node_modules|libs/, loaders: ["react-hot", "babel-loader"]},
      {test: /\.html$/, loader: "file?name=[name].[ext]"},
      {test: /\.scss$/, loader: 'style!css!sass'},
      {test: /\.css$/, loader: 'style!css'},
      {test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=application/octet-stream'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=image/svg+xml'},
      {test: /\.png$/, loader: "url-loader?mimetype=image/png"},
      {test: /\.jpg$|\.jpeg$/, loader: "url-loader?mimetype=image/jpeg"}
    ]
  }
};
