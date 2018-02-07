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
[![bitHound Dependencies](https://www.bithound.io/github/borenXue/webpack-alioss-plugin/badges/dependencies.svg)](https://www.bithound.io/github/borenXue/webpack-alioss-plugin/master/dependencies/npm)
<!-- [![node version](https://badges.gitter.im/borenXue/webpack-alioss-plugin.svg)](https://gitter.im/borenXue/webpack-alioss-plugin) -->
<!--[![node version](https://img.shields.io/coveralls/borenXue/webpack-alioss-plugin.svg)](https://coveralls.io/r/borenXue/webpack-alioss-plugin)-->

> Install

```
yarn add webpack-alioss-plugin --dev
```

> Example

```
const AliOssPlugin = require('webpack-alioss-plugin')

webpackConfig.plugins.push(new AliOSSPlugin({
  accessKeyId: 'your-key-id',
  accessKeySecret: 'your-key-secret',
  region: 'your-region', // eg: oss-cn-hangzhou
  bucket: '',
  prefix: '', // oss directory prefix; eg: auto_upload_ci/test
  exclude: /.*\.html$/,   // Optional, default: /.*/
  enableLog: true,        // Optional, default: true
  ignoreError: false,      // Optional, default: false
  deleteMode: true        // Optional, default: true
}))
```

> Options

* prefix: The directory name which will accept uploaded files.
* exclude: Support RegExp syntax, matched files will not be upload to oss
* enableLog: Whether or not show detail infos for you, just should be enable in development mode.
* ignoreError:  Whether or not stop build if upload error.
  - true: will be stop
  - false: will be not stop
* deleteMode: Whether or not delete file after the file uploaded succesfully.
  - true: delete
  - false: not delete

> security

You could set secretive param value by environment variable. We support follow keys.

* WEBPACK_ALIOSS_PLUGIN_ACCESS_KEY_ID: if options.accessKeyId is not given, this value will effect
* WEBPACK_ALIOSS_PLUGIN_ACCESS_KEY_SECRET: if options.accessKeySecret is not given, this value will effect
* WEBPACK_ALIOSS_PLUGIN_BUCKET: if options.bucket is not given, this value will effect
* WEBPACK_ALIOSS_PLUGIN_REGION: if options.region is not given, this value will effect
  
> CHANGELOG

* 1.4.6
  - fixed [issue 3](https://github.com/borenXue/webpack-alioss-plugin/issues/3): add environment variable setting support
* 1.4.5
  - exit process while upload failure
* 1.4.0
	- Modify README descs.

