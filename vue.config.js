const { defineConfig } = require('@vue/cli-service')
const path = require('path');
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.test.app",
        productName: "微微信", //项目名，也是生成的安装文件名，即aDemo.exe
        copyright: "Copyright © 2021", //版权信息
        directories: {
          output: "./dist" //输出文件路径
        },
        win: {
          //win相关配置
          icon: "./public/xiaoxi.png", //图标，当前图标在根目录下，注意这里有两个坑
          target: [
            {
              target: "nsis", //利用nsis制作安装程序,打包文件的后缀为exe
              arch: [
                "x64", //64位
                "ia32" //32位
              ]
            }
          ]
        },
        nsis: {
          oneClick: false, //一键安装
          language: "2052", //安装语言
          perMachine: true, //应用所有用户
          allowToChangeInstallationDirectory: true //用户可以选择路径
        }
      },
      nodeIntegration: true
    }
  },
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
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => ({
        ...options,
      compilerOptions: {
        // 忽略自定义标签警告 vue3 app.config.compilerOptions.isCustomElement 配置有问题
        isCustomElement: (tag) => {
          return ["xml", "block", "mutation", "category"].includes(tag)
        },
      },
    }))
  },
  devServer: {
    proxy: { // 设置代理
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      fallback: {
        path: require.resolve("path-browserify"),
        stream: require.resolve("readable-stream"),
        crypto: require.resolve("crypto-browserify"),
        perf_hooks: false,
        module: false,
        "@blueprintjs/core": false,
        "@blueprintjs/icons": false,
        domain: false,
        fs: false,
        pnpapi: false,
        punycode: false,
      }
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        },
      ],
    }
  }
})
