const path = require('path');
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  chainWebpack: config => {
    // config.module
    //   .rule("i18n")
    //   .resourceQuery(/blockType=i18n/)
    //   .type('javascript/auto')
    //   .use("i18n")
    //   .loader("@kazupon/vue-i18n-loader")
    //   .end()
    //   .use('yaml')
    //   .loader('yaml-loader')
    //   .end(),
    //修改文件引入自定义路径
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
  }
}