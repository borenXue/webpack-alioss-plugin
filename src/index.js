const chalk = require('chalk')
const _ = require('lodash');
const AliOSS = require('ali-oss')
const defaultConfig = {
  auth: {
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '',
    region: ''
  },
  prefix: '',
  exclude: /.*\.html$/,
  enableLog: false,
  ignoreError: false,
  removeMode: true,
  options: undefined
}

const red = chalk.red
const green = chalk.bold.green

module.exports = class WebpackAliOSSPlugin {

  // config = {} // 最终计算出来的配置参数
  // client = null // 阿里云 OSS 客户端

  constructor (cfg) {
    // 优化级顺序: 项目配置 > 环境变量 > 默认配置
    this.config = _.mergeWith(defaultConfig, {
      auth: {
        accessKeyId: process.env.WEBPACK_ALIOSS_PLUGIN_ACCESS_KEY_ID,
        accessKeySecret: process.env.WEBPACK_ALIOSS_PLUGIN_ACCESS_KEY_SECRET,
        bucket: process.env.WEBPACK_ALIOSS_PLUGIN_BUCKET,
        region: process.env.WEBPACK_ALIOSS_PLUGIN_REGION,
      },
      enableLog: extraEnvBoolean(process.env.WEBPACK_ALIOSS_PLUGIN_ENABLE_LOG),
      ignoreError: extraEnvBoolean(process.env.WEBPACK_ALIOSS_PLUGIN_IGNORE_ERROR),
      removeMode: extraEnvBoolean(process.env.WEBPACK_ALIOSS_PLUGIN_REMOVE_MODE),
      prefix: process.env.WEBPACK_ALIOSS_PLUGIN_PREFIX,
      // exclude: process.env.WEBPACK_ALIOSS_PLUGIN_EXCLUDE,
    }, cfg || {}, configMergeCustomizer)
    // 初始化阿里云 OSS 客户端
    this.client = AliOSS(this.config.auth)
  }

  apply (compiler) {
    compiler.plugin('emit', (compilation, cb) => {
      const files = this.pickupAssetsFiles(compilation)
      this.uploadFiles(files, compilation)
        .then(() => {
          log(`\n${green('OSS 上传完成\n')}`)
          cb()
        })
        .catch((err) => {
          log(`\n${red('OSS 上传出错')}::: ${red(err.code)}-${red(err.name)}: ${red(err.message)}`)
          this.config.ignoreError || compilation.errors.push(err)
          cb()
        })
    })
  }

  uploadFiles(files, compilation) {
    return Promise.all(_.map(files, (file) => {
      const uploadName = `${this.config.prefix}/${file.name}`.replace('//', '/')
      log(green('\n\n 开始上传......'))
      return new Promise((resolve, reject) => {
        this.client.put(uploadName, Buffer.from(file.content), this.getOptions())
          .then(() => {
            log(`上传成功: ${file.name}`)
            this.config.removeMode && delete compilation.assets[file.name]
          })
          .catch(err => reject(err))
      })
    }))
  }
  getOptions() {
    return _.isPlainObject(this.config.options) ? this.config.options : undefined
  }

  // 从 compilation 对象中提取资源文件
  pickupAssetsFiles(compilation) {
    const matched = _.filter(compilation.asserts, (value, name) => !this.config.exclude.test(name))
    return _.map(matched, (value, name) => ({
      name,
      path: value.existsAt,
      content: value.source()
    }))
  }

  logDebug(...rest) {
    this.config.enableLog && log(...rest)
  }
}

function extraEnvBoolean(val) {
  if (val && val === 'true') {
    return true
  }
  if (val && val === 'false') {
    return false
  }
}

function log(...rest) {
  console.log('[webpack-alioss-plugin]: ', ...rest) // eslint-disable-line
}

// 配置合并器
function configMergeCustomizer(objVal, srcVal) {
  if (_.isPlainObject(objVal) && _.isPlainObject(srcVal)) {
    return _.merge(objVal, srcVal)
  } else {
    return srcVal
  }
}
