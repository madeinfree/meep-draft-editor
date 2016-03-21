var path = require("path");
module.exports = {
  entry: ["./server/index.js"],
  output: {
    path: path.resolve(__dirname, "examples/gh-pages/build"),
    filename: "bundle.js",
    publicPath: 'build/'
  },
  watch: true,
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.jsx$/, loader: "jsx-loader" },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel"},
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      }
    ]
  }
}
