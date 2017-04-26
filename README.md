# [webpack-alioss-plugin](https://github.com/borenXue/webpack-alioss-plugin.git) 阿里 OSS webpack 自动上传插件

[![npm version](https://img.shields.io/npm/v/webpack.svg)](https://npmjs.com/package/webpack-alioss-plugin)
[![node version](https://img.shields.io/node/v/webpack-alioss-plugin.svg)](https://nodejs.org)
[![dependencies Status](https://david-dm.org/borenxue/webpack-alioss-plugin/status.svg)](https://david-dm.org/borenxue/webpack-alioss-plugin)
[![node version](https://img.shields.io/travis/borenXue/webpack-alioss-plugin/master.svg)](https://travis-ci.org/borenXue/webpack-alioss-plugin)
[![node version](https://ci.appveyor.com/api/projects/status/github/borenXue/webpack-alioss-plugin?svg=true)](https://ci.appveyor.com/project/borenXue/webpack-alioss-plugin/branch/master)
[![CircleCI](https://circleci.com/gh/borenXue/webpack-alioss-plugin/tree/master.svg?style=svg)](https://circleci.com/gh/borenXue/webpack-alioss-plugin/tree/master)
[![dependencies Status](https://img.shields.io/npm/l/webpack-alioss-plugin.svg)](https://github.com/borenXue/webpack-alioss-plugin/blob/master/LICENCE)
[![node version](https://img.shields.io/npm/dm/webpack-alioss-plugin.svg)](ttps://npmjs.com/package/webpack-alioss-plugin)
[![Join the chat at https://gitter.im/webpack-alioss-plugin/Lobby](https://badges.gitter.im/webpack-alioss-plugin/Lobby.svg)](https://gitter.im/webpack-alioss-plugin/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
<!-- [![node version](https://badges.gitter.im/borenXue/webpack-alioss-plugin.svg)](https://gitter.im/borenXue/webpack-alioss-plugin) -->
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
  prefix: '', // oss目录前缀; eg: auto_upload_ci/test
  exclude: /.*\.html$/,   // 选填, 默认: /.*/
  enableLog: true,        // 选填, 默认: true
  ignoreError: false,      // 选填, 默认: false
  deleteMode: true        // 选填, 默认: true
}))
```

> 参数说明

* prefix: oss 指定 bucket 下目录名, 文件会上传到该目录下面
* exclude: 忽略文件, 支持正则表达式, 符合该表达式的文件不会被上传到 oss
* enableLog: 是否输出详细日志, 用于调试
* ignoreError: 上传失败是否终止构建
  - true: 上传失败被忽略, 继续构建, 但文件不会上传oss, 同时文件也会本地生成; 效果等同于未使用该插件
  - false: 上传失败则终止构建
* deleteMode: 删除模式
  - true: 上传的文件将不会本地生成
  - false: 上传的文件也会在本地生成一份
