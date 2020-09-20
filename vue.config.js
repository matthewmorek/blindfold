process.env.VUE_APP_VERSION = require("./package").version;

module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("vue-svg-loader").loader("vue-svg-loader");
  },

  productionSourceMap: false,

  pluginOptions: {
    express: {
      shouldServeApp: true,
      serverDir: "./app"
    }
  },

  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:3000",
        ws: true,
        changeOrigin: true
      }
    }
  }
};
