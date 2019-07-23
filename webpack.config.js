const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = [{
  name: 'app',
  entry: './src/scripts/default.js',
  output: {
    filename: 'files_mediaviewer.js',
    path: path.resolve(__dirname, 'js')
  },
  resolve: {
    alias: {
        'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.js$/,
      loader: 'babel-loader'
    }, {
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"]
    }]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}, {
  name: 'init',
  entry: './src/scripts/init.js',
  output: {
    filename: 'files_mediaviewer_init.js',
    path: path.resolve(__dirname, 'js')
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }]
  }
}]