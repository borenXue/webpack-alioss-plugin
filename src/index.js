const path = require('path')
const chalk = require('chalk')
const _ = require('lodash');
const AliOSS = require('ali-oss')
const Buffer = require('buffer').Buffer
const zlib = require('zlib')

const defaultConfig = {
  auth: {
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '',
    region: ''
  },
  retry: 3, // 重试次数: number(>=0)
  existCheck: true, // true: 直接上传、false: 先检测,若已存在则不重新上传(不报错)
  // prefix 或者 ossBaseDir + project 二选一
  ossBaseDir: 'auto_upload_ci',
  project: '',
  prefix: '',
  exclude: /.*\.html$/,
  enableLog: false,
  ignoreError: false,
  removeMode: true,
  gzip: true,
  options: undefined
}

const red = chalk.red
const green = chalk.bold.green

module.exports = class WebpackAliOSSPlugin {

  // config = {} // 最终计算出来的配置参数
  // client = null // 阿里云 OSS 客户端
  // finalPrefix = '' // 最终计算出来的 prefix 路径

  constructor(cfg) {
    // 优化级顺序: 项目配置 > 环境变量 > 默认配置
    const envConfig = {
      auth: {
        accessKeyId: process.env.WEBPACK_ALIOSS_PLUGIN_ACCESS_KEY_ID,
        accessKeySecret: process.env.WEBPACK_ALIOSS_PLUGIN_ACCESS_KEY_SECRET,
        bucket: process.env.WEBPACK_ALIOSS_PLUGIN_BUCKET,
        region: process.env.WEBPACK_ALIOSS_PLUGIN_REGION,
      },
      enableLog: extraEnvBoolean(process.env.WEBPACK_ALIOSS_PLUGIN_ENABLE_LOG),
      ignoreError: extraEnvBoolean(process.env.WEBPACK_ALIOSS_PLUGIN_IGNORE_ERROR),
      removeMode: extraEnvBoolean(process.env.WEBPACK_ALIOSS_PLUGIN_REMOVE_MODE),
      ossBaseDir: process.env.WEBPACK_ALIOSS_PLUGIN_OSS_BASE_DIR || '',
      prefix: process.env.WEBPACK_ALIOSS_PLUGIN_PREFIX,
    }
    this.config = _.mergeWith(_.cloneDeep(defaultConfig), envConfig, cfg || {}, configMergeCustomizer)
    if (typeof this.config.retry !== 'number' || this.config.retry < 0) {
      this.config.retry = 0
    }
    this.calcPrefix()
    this.debug('默认配置:', defaultConfig)
    this.debug('环境变量配置:', envConfig)
    this.debug('项目配置:', cfg)
    this.debug('最终使用的配置:', this.config)
    // 初始化阿里云 OSS 客户端
    this.client = AliOSS(this.config.auth)
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, cb) => {
      const files = this.pickupAssetsFiles(compilation)
      log(`${green('\nOSS 上传开始......')}`)
      this.uploadFiles(files, compilation)
        .then(() => {
          log(`${green('OSS 上传完成\n')}`)
          cb()
        })
        .catch((err) => {
          log(`${red('OSS 上传出错')}::: ${red(err.code)}-${red(err.name)}: ${red(err.message)}`)
          this.config.ignoreError || compilation.errors.push(err)
          cb()
        })
    })
  }

  calcPrefix() {
    if (this.finalPrefix) return this.finalPrefix
    // 如果设置了 prefix, 则忽略 ossBaseDir 与 project
    if (this.config.prefix) {
      this.finalPrefix = this.config.prefix
    } else { // 使用 ossBaseDir 与 project
      // 如果 project 不存在, 则自动提取 package.json 中的 name 字段
      this.config.project = this.config.project || this.npmProjectName()
      if (!this.config.project) { // project 获取失败则直接使用 ossBaseDir 作为上传目录
        warn(`使用默认上传目录: ${this.config.ossBaseDir}`)
        this.finalPrefix = this.config.ossBaseDir
      } else {
        this.finalPrefix = `${this.config.ossBaseDir}/${this.config.project}`
      }

    }
    this.debug('使用的 OSS 目录:', this.finalPrefix)
    return this.finalPrefix
  }

  uploadFiles(files, compilation) {
    let i = 1
    return Promise.all(_.map(files, (file) => {
      file.$retryTime = 0
      const uploadName = `${this.calcPrefix()}/${file.name}`.replace('//', '/')
      // 先检测是否存在, 不存在则上传 TODO: 检测过程的日志打印
      if (this.config.existCheck !== true) {
        return this.uploadFile(file, i++, files, compilation, uploadName)
      } else {
        return new Promise((resolve, reject) => {
          this.client.list({
            prefix: uploadName,
            'max-keys': 1
          }).then(res => {
            if (res.objects && res.objects.length > 0) {
              const timeStr = getTimeStr(new Date(res.objects[0].lastModified))
              log(`${green('已存在,免上传')} (上传于 ${timeStr}) ${++i}/${files.length}: ${uploadName}`)
              this.config.removeMode && delete compilation.assets[file.name]
              resolve()
            } else {
              throw new Error('not exist & need upload')
            }
          }).catch(() => {
            this.uploadFile(file, i++, files, compilation, uploadName)
              .then((...rest) => resolve(rest))
              .catch(err => reject(err))
          })
        })
      }
    }))
  }
  uploadFile(file, idx, files, compilation, uploadName) {
    return new Promise((resolve, reject) => {
      const fileCount = files.length
      getFileContentBuffer(file, this.config.gzip).then((contentBuffer) => {
        const opt = this.getOptions(this.config.gzip)
        const self = this
        function _uploadAction() {
          file.$retryTime++
          log(`开始上传 ${idx}/${fileCount}: ${file.$retryTime > 1 ? '第' + (file.$retryTime - 1) + '次重试' : ''}`, uploadName)
          self.client.put(uploadName, contentBuffer, opt)
            .then(() => {
              log(`上传成功 ${idx}/${fileCount}: ${uploadName}`)
              self.config.removeMode && delete compilation.assets[file.name]
              resolve()
            })
            .catch(err => {
              if (file.$retryTime < self.config.retry + 1) {
                _uploadAction()
              } else {
                reject(err)
              }
            })
        }
        _uploadAction()
      }).catch(err => {
        reject(err)
      })
    })
  }
  getOptions(gzip) {
    const optValid = _.isPlainObject(this.config.options)
    if (gzip) {
      if (optValid) {
        if (!this.config.options.headers) this.config.options.headers = {}
        this.config.options.headers['Content-Encoding'] = 'gzip'
      } else {
        return {
          headers: { 'Content-Encoding': 'gzip' }
        }
      }
    } else {
      return optValid ? this.config.options : undefined
    }
    return undefined
  }

  // 从 compilation 对象中提取资源文件
  pickupAssetsFiles(compilation) {
    const matched = {}
    const keys = Object.keys(compilation.assets)
    for (let i = 0; i < keys.length; i++) {
      if (!this.config.exclude.test(keys[i])) {
        matched[keys[i]] = compilation.assets[keys[i]]
      }
    }
    return _.map(matched, (value, name) => ({
      name,
      path: value.existsAt,
      content: value.source()
    }))
  }

  // 提取所在项目 package.json 中的 name
  npmProjectName() {
    try {
      const pkg = require(path.resolve(process.env.PWD, 'package.json'))
      return pkg.name
    } catch (e) {
      return ''
    }
  }

  debug(...rest) {
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

function getTimeStr(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
}

function getFileContentBuffer(file, gzipVal) {
  const gzip = typeof gzipVal === 'number' || gzipVal === true ? true : false
  const opts = typeof gzipVal === 'number' ? { level: gzipVal } : {}
  if (!gzip) return Promise.resolve(Buffer.from(file.content))
  return new Promise((resolve, reject) => {
    zlib.gzip(Buffer.from(file.content), opts, (err, gzipBuffer) => {
      if (err) reject(err)
      resolve(gzipBuffer)
    })
  })
}

// 配置合并器
function configMergeCustomizer(objVal, srcVal) {
  if (_.isPlainObject(objVal) && _.isPlainObject(srcVal)) {
    return _.merge(objVal, srcVal)
  } else {
    return srcVal
  }
}

function log(...rest) {
  console.log(chalk.bgMagenta('[webpack-alioss-plugin]:'), ...rest) // eslint-disable-line
}
function warn(...rest) {
  console.warn(chalk.bgMagenta('[webpack-alioss-plugin]:'), ...rest) // eslint-disable-line
}
