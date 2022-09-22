const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const baseUrl = "./src/client/js";
module.exports = {
  entry: {
    main: baseUrl + "/main.js",
    videoPlayer: baseUrl + "/videoPlayer.js",
    recoder: baseUrl + "/recoder.js",
    comment: baseUrl + "/comment.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "asset"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
