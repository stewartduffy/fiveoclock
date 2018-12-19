const webpack = require("webpack");

require("dotenv").config();

module.exports = {
  mode: "development",
  plugins: [new webpack.DefinePlugin({ "global.GENTLY": false })]
};
