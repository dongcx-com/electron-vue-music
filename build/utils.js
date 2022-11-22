'use strict'
const glob = require('glob')
const path = require('path')
const buildConfig = require('../build/config')

// build tool set

module.exports = {
  getMultiFiles: function (globPath) {
    let entries = {}

    glob.sync(globPath).forEach(function (entry) {
      let pathList = entry.split('/')
      let baseConfig = require('.' + entry)
      pathList.splice(-1)
      let pathname = 'main'
      let chunks
      if (process.env.NODE_ENV === 'production') {
        chunks = ['chunk-vendors', 'chunk-common', 'vendor-' + pathname, pathname]
      } else {
        chunks = ['chunk-vendors', 'chunk-common', 'vendor-' + pathname, pathname]
      }

      let filename = pathname + '.html'
      entries[pathname] = Object.assign({
        entry: pathList.join('/') + '/' + pathname + '.js',
        template: 'public/index.html',
        filename: filename,
        chunks: chunks
      }, baseConfig)
    })
    // console.log(entries)
    return entries
  },
  getMultiEntries: function () {
    let self = this
    let globPath = './src/**/page.config.json'
    let pages = self.getMultiFiles(globPath)
    let chunks = Object.keys(pages)
    let chunksPlugin = {}
    let devRewriteUrl = []
    chunks.forEach(function (item, index) {
      let newName = 'vendor-' + item
      chunksPlugin[item] = {
        name: newName,
        chunks: 'initial',
        minChunks: 1,
        priority: index
      }
      let devRewriteUrlFrom = `^/${buildConfig.publicPath}/?.*`
      let devRewriteUrlTo = `${buildConfig.publicPath}/${item}.html`
      devRewriteUrl.push(
        {
          from: new RegExp(devRewriteUrlFrom),
          to: path.posix.join('/', devRewriteUrlTo)
        }
      )
    })
    return {
      pages: pages,
      plugins: chunksPlugin,
      devRewriteUrl: devRewriteUrl
    }
  }
}
