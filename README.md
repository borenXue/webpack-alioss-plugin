# [webpack-alioss-plugin](https://github.com/borenXue/webpack-alioss-plugin.git) 阿里 OSS webpack 自动上传插件

> 安装

```
yarn add webpack-alioss-plugin --dev
```

> 使用示例

```
const AliOssPlugin = require('webpack-alioss-plugin')
webpackConfig.plugins.push(new AliOSSPlugin({
  accessKeyId: 'your-key-id',
  accessKeySecret: 'your-key-secret',
  region: 'your-region', // eg: oss-cn-hangzhou
  bucket: '',
  prefix: '', // eg: auto_upload_ci/test
  exclude: /.*\.html$/,   // 选填, 默认: /.*/
  enableLog: true,        // 选填, 默认: true
  ignoreError: false      // 选填, 默认: false
}))
```
