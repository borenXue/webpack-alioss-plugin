# [webpack-alioss-plugin](https://github.com/borenXue/webpack-alioss-plugin.git) 阿里 OSS webpack 自动上传插件

[![npm version](https://img.shields.io/npm/v/webpack.svg)](https://npmjs.com/package/webpack-alioss-plugin)
[![node version](https://img.shields.io/node/v/webpack-alioss-plugin.svg)](https://nodejs.org)
[![node version](https://img.shields.io/travis/borenXue/webpack-alioss-plugin/master.svg)](https://travis-ci.org/borenXue/webpack-alioss-plugin)

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

