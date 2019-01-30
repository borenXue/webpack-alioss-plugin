var _ = require('lodash');
var assert = require('assert');
var WebpackAliOSSPlugin = require('../src/index');

var message = 'config 计算出错'

var config = {
  auth: {
    accessKeyId: '001',
    accessKeySecret: '002',
    bucket: '003',
    region: '004'
  },
  prefix: 'aa',
  exclude: /aa.*/,
  enableLog: true,
  ignoreError: true,
  removeMode: false,
  options: 'a'
}

describe('Array', function() {
  describe('#calc-config', function() {
    it('用户参数、默认参数合并: 用户设置所有选项 - 不使用环境变量', function() {
      var plugin = new WebpackAliOSSPlugin(config)
      assert(_.isEqual(plugin.config, config), message);
    });
  });

  describe('#calc-config', function() {
    it('用户参数、环境变量、默认参数合并: auth.region 使用环境变量', function() {
      var cfg = _.cloneDeep(config)
      delete cfg.auth.region
      process.env.WEBPACK_ALIOSS_PLUGIN_REGION = '004'
      var plugin = new WebpackAliOSSPlugin(cfg)
      cfg.auth.region = '004'
      assert(_.isEqual(plugin.config, cfg), message);
    });
  });

  describe('#calc-config', function() {
    it('环境变量、默认参数合并: auth.region 使用环境变量', function() {
      process.env.WEBPACK_ALIOSS_PLUGIN_ACCESS_KEY_ID = '001'
      process.env.WEBPACK_ALIOSS_PLUGIN_ACCESS_KEY_SECRET = '002'
      process.env.WEBPACK_ALIOSS_PLUGIN_BUCKET = '003'
      process.env.WEBPACK_ALIOSS_PLUGIN_REGION = '004'
      process.env.WEBPACK_ALIOSS_PLUGIN_ENABLE_LOG = true
      process.env.WEBPACK_ALIOSS_PLUGIN_IGNORE_ERROR = true
      process.env.WEBPACK_ALIOSS_PLUGIN_REMOVE_MODE = false
      process.env.WEBPACK_ALIOSS_PLUGIN_PREFIX = 'aa'
      process.env.WEBPACK_ALIOSS_PLUGIN_EXCLUDE = /aa.*/
      var plugin = new WebpackAliOSSPlugin({
        options: 'a',
        exclude: /aa.*/,
      })
      assert(_.isEqual(plugin.config, config), message);
    });
  });
});
