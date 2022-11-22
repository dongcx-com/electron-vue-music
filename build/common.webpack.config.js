const path = require('path')
const webpack = require("webpack")

//公共配置
module.exports = {
    plugins: [
        //Shimming 预置全局变量，可在任意文件无需通过import或者require引入，便可直接使用
        new webpack.ProvidePlugin({
            buildConfig: [path.resolve('build/config.js')]
        }),
    ],
    module: {
        rules: [{
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto'
        }]
    }

}
