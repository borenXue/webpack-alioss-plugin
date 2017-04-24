# [webpack-alioss-plugin](https://github.com/borenXue/webpack-alioss-plugin.git) 阿里 OSS webpack 自动上传插件

<br/>

[![npm version](https://img.shields.io/npm/v/webpack.svg)](https://npmjs.com/package/webpack-alioss-plugin)
[![node version](https://img.shields.io/node/v/webpack-alioss-plugin.svg)](https://nodejs.org)
[![dependencies Status](https://david-dm.org/borenxue/webpack-alioss-plugin/status.svg)](https://david-dm.org/borenxue/webpack-alioss-plugin)
[![node version](https://img.shields.io/travis/borenXue/webpack-alioss-plugin/master.svg)](https://travis-ci.org/borenXue/webpack-alioss-plugin)
[![node version](https://ci.appveyor.com/api/projects/status/github/borenXue/webpack-alioss-plugin?svg=true)](https://ci.appveyor.com/project/borenXue/webpack-alioss-plugin/branch/master)
[![CircleCI](https://circleci.com/gh/borenXue/webpack-alioss-plugin/tree/master.svg?style=svg)](https://circleci.com/gh/borenXue/webpack-alioss-plugin/tree/master)
[![dependencies Status](https://img.shields.io/npm/l/webpack-alioss-plugin.svg)](https://github.com/borenXue/webpack-alioss-plugin/blob/master/LICENCE)
[![node version](https://img.shields.io/npm/dm/webpack-alioss-plugin.svg)](ttps://npmjs.com/package/webpack-alioss-plugin)
[![node version](https://badges.gitter.im/borenXue/webpack-alioss-plugin.svg)](https://gitter.im/borenXue/webpack-alioss-plugin)

<!--[![node version](https://img.shields.io/coveralls/borenXue/webpack-alioss-plugin.svg)](https://coveralls.io/r/borenXue/webpack-alioss-plugin)-->

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
