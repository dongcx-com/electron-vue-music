const utils = require('./utils')
const buildConfig = require('./config')

const { devRewriteUrl } = utils.getMultiEntries()

module.exports = {
    devtool: "inline-source-map",//将编译后的代码映射回源代码，便于追踪报错
    devServer: {

        //指定监听请求的端口号
        port: buildConfig.port,

        //代理，mock环境注释此处
        // proxy: {
        //     '/qqMusic': {
        //         // target: 'http://172.16.52.36:8800/',
        //         target: 'https://c.y.qq.com/splcloud/',
        //         ws: true,
        //         secure: false, // 如果是https接口，需要配置这个参数
        //         changeOrigin: true,

        //         //重写路径
        //         pathRewrite: {
        //             '^/qqMusic': ''
        //         },
        //         // 突破host和origin的限制
        //         headers: {
        //             referer: 'https://y.qq.com/',
        //             origin: 'https://y.qq.com',
        //             cookie: 'RK=iZmclSdR8/; ptcz=4321a04ef4ae96ff80185e1afa17b00182f45f305966cdcc20d4abc49671ec45; pgv_pvid=8691139687'
        //         }
        //     }
        // },

        //根据不同的url映射到不同的入口
        // historyApiFallback: {
        //     rewrites: devRewriteUrl
        // },

        //该选项允许将允许访问开发服务器的服务列入白名单
        allowedHosts: [buildConfig.host]
    }
}
