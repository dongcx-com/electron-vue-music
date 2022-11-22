const { defineConfig } = require('@vue/cli-service')

const path = require('path')

const buildConfig = require('./build/config')

const { merge } = require("webpack-merge")

const commonWebpackConfig = require("./build/common.webpack.config")

const productionWebpackConfig = require("./build/prod.webpack.config")

const developmentWebpackConfig = require("./build/dev.webpack.config")

const utils = require('./build/utils')

const { pages } = utils.getMultiEntries()

module.exports = defineConfig({
  runtimeCompiler: true,
  lintOnSave: false,

  publicPath: `/${buildConfig.publicPath}/`,

  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: 'static',

  //生产环境关闭SourceMap，加速生产环境构建
  productionSourceMap: false,

  /* 通过 webpack-chain 维护webpack配置，这个库提供了一个 webpack 原始配置的上层抽象，
    使其可以定义具名的 loader 规则和具名插件，并有机会在后期进入这些规则并对它们的选项进行修改。
    通过链式操作，它允许我们更细粒度的控制其内部配置 */
  chainWebpack: config => {
    //修改模块解析别名
    config.resolve.alias
      .set('@', path.resolve('src'))
      .set('@utils', path.resolve('src/utils'))

    /* terser-webpack-plugin中drop_console默认值为false，这里需手动修改为true，
    丢弃对 console.*函数的调用 */
    config.optimization.minimizer('terser').tap(args => {
      args[0].terserOptions.compress.drop_console = true
      args[0].terserOptions.compress.drop_debugger = true
      return args
    })
  },

  configureWebpack: () => {
    //通过webpack-merge将公共配置与各环境配置合并后返回
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      return merge(commonWebpackConfig, productionWebpackConfig)
    } else {
      // 为开发环境修改配置...
      return merge(commonWebpackConfig, developmentWebpackConfig)
    }
  },

  pages: pages,

  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,

      //生成的生产环境构建文件的目录
      outputDir: buildConfig.outputDir,
    }
  },

})
