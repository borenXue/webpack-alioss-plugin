const co = require('co')
const oss = require('ali-oss')
const chalk = require('chalk')
const _ = require('lodash')
const red = chalk.red
const green = chalk.bold.green

const config = {
  auth: {
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '',
    region: ''
  },
  prefix: '',
  exclude: /.*/,
  enableLog: '',
  ignoreError: false,
  removeMode: true
}
let store = null

const logInfo = (str) => {
  !config.enableLog || console.log(str)
}

module.exports = class WebpackAliOSSPlugin {
  constructor (cfg) {
    config.auth.accessKeyId = cfg.accessKeyId || process.env.WEBPACK_ALIOSS_PLUGIN_ACCESS_KEY_ID
    config.auth.accessKeySecret = cfg.accessKeySecret || process.env.WEBPACK_ALIOSS_PLUGIN_ACCESS_KEY_SECRET
    config.auth.bucket = cfg.bucket || process.env.WEBPACK_ALIOSS_PLUGIN_BUCKET
    config.auth.region = cfg.region || process.env.WEBPACK_ALIOSS_PLUGIN_REGION
    config.prefix = cfg.prefix.endsWith('/') ? cfg.prefix : `${cfg.prefix}/`
    config.exclude = cfg.exclude && cfg.exclude !== '' ? cfg.exclude : config.exclude
    config.ignoreError = cfg.ignoreError ? cfg.ignoreError : false
    config.enableLog = cfg.enableLog === false ? cfg.enableLog : true
    config.removeMode = cfg.deleteMode === false ? cfg.deleteMode : true
  }

  apply (compiler) {
    store = oss(config.auth)
    compiler.plugin('emit', (compilation, cb) => {
      uploadFiles(compilation)
        .then(() => {
          cb()
        })
        .catch((err) => {
          console.log('\n')
          console.log(`${red('OSS 上传出错')}:::: ${red(err.name)}-${red(err.code)}: ${red(err.message)}`)
          if (config.ignoreError) {
            cb()
          } else {
            compilation.errors.push(err)
            cb()
          }
        })
    })
  }
}

let uploadIndex = 0
const uploadFiles = (compilation) => {
  const files = getAssetsFiles(compilation)
  return Promise.all(files.map((file, index, arr) => {
    return uploadFile(file.name, file)
      .then((result) => {
        if (uploadIndex++ === 0) {
          logInfo(green('\n\n OSS 上传中......'))
        }
        logInfo(`上传成功: ${file.name}`)
        if (files.length === uploadIndex) {
          logInfo(green('OSS 上传完成\n'))
        }
        !config.removeMode || delete compilation.assets[file.name]
        // Promise.resolve('上传成功')
      }, (e) => {
        return Promise.reject(e)
      })
  }))
}

const uploadFile = (name, assetObj) => {
  return co(function *() {
    const uploadName = `${config.prefix}${name}`
    return yield store.put(uploadName, Buffer.from(assetObj.content))
  })
}

const getAssetsFiles = ({assets}) => {
  var items = _.map(assets, (value, name) => {
    if (!config.exclude.test(name)) {
      return {name, path: value.existsAt, content: value.source()}
    }
  })
  const newItems = []
  for (const item of items) {
    if (item && item.name) {
      newItems.push(item)
    }
  }
  return newItems
}
