export default class WebpackAliOSSPlugin {
  constructor(cfg: WebpackAliOSSPluginOptions)
}

export interface WebpackAliOSSPluginOptions {
  /**
   * 阿里 oss 认证相关信息, 全部支持环境变量
   */
  auth?: {
    /**
     * OSS 访问 key
     *
     * 环境变量: WEBPACK_ALIOSS_PLUGIN_ACCESS_KEY_ID
     */
    accessKeyId?: string;
    /**
     * OSS 访问 secret
     *
     * 环境变量: WEBPACK_ALIOSS_PLUGIN_ACCESS_KEY_SECRET
     */
    accessKeySecret?: string;
    /**
     * OSS 存储空间
     *
     * 环境变量: WEBPACK_ALIOSS_PLUGIN_BUCKET
     */
    bucket?: string;
    /**
     * OSS 服务节点, eg: oss-cn-hangzhou
     *
     * 环境变量: WEBPACK_ALIOSS_PLUGIN_REGION
     */
    region?: string;
  };
  /**
   * 要排除的文件, 符合该正则表达式的文件不会上传
   *
   * 默认值: /.*\.html$/
   */
  exclude?: RegExp;
  /**
   * 是否开启调试日志
   *
   * 默认不开启 (false)
   *
   * 环境变量: WEBPACK_ALIOSS_PLUGIN_ENABLE_LOG
   */
  enableLog?: boolean;
  /**
   * 上传过程中出现错误是否忽略该错误继续 webpack 构建
   *
   * 默认不忽略 (false)
   *
   * 环境变量: WEBPACK_ALIOSS_PLUGIN_IGNORE_ERROR
   */
  ignoreError?: boolean;
  /**
   * 生成的文件自动上传至 OSS 后, 是否删除本地的对应文件
   *
   * 默认删除 (true)
   *
   * 环境变量: WEBPACK_ALIOSS_PLUGIN_REMOVE_MODE
   */
  removeMode?: boolean;
  /**
   * OSS 中存放上传文件的目录名 (文件最终会上传至 `${ossBaseDir}/${project}` 目录下)
   *
   * 默认值: 'auto_upload_ci'
   *
   * 环境变量: WEBPACK_ALIOSS_PLUGIN_OSS_BASE_DIR
   */
  ossBaseDir?: string;
  /**
   * 项目名 (文件最终会上传至 `${ossBaseDir}/${project}` 目录下)
   *
   * 默认值: package.json 中的 name 值
   */
  project?: string;
  /**
   * 上传失败时的重试次数
   *
   * 默认值: 3
   */
  retry?: number;
  /**
   * 上传前是否检测该文件名是否已经存在
   *
   * true: 先检测同名文件是否已存在, 已存在则不上传, 否则上传
   * false: 直接上传访文件, 如已存在则覆盖
   *
   * 默认值: true 代表会检测
   */
  existCheck?: boolean;
  /**
   * 是否先进行 gzip 压缩后再上传
   *
   * 默认值: true
   */
  gzip?: boolean;
  /**
   * 可用于设置文件的请求头、超时时间等
   *
   * 参考: https://github.com/ali-sdk/ali-oss#putname-file-options
   *
   * 默认值: undefined
   */
  options?: object;
  /**
   * 已弃用 - 请使用 ossBaseDir + project 替代
   */
  prefix?: string;
}
