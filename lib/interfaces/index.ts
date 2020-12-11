export declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U> ? Array<DeepPartial<U>> : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : DeepPartial<T[P]>;
};

export interface BaseObject {
  [key: string]: string | any
}

/** 环境变量 */
export enum EnvEnum {
  /** 本地环境 */
  Local = 'local',
  /** 开发环境 */
  Dev = 'dev',
  /** 测试环境 */
  Test = 'test',
  /** 预生产环境 */
  Pre = 'pre',
  /** 生产环境 */
  Prd = 'prd',
}

export interface Config<T> {
  /** Apollo配置 */
  apolloConfig: ApolloConfig,
  /** 默认值（本地开发时使用） */
  defaultValue?: DeepPartial<T>,
  /** 覆盖值（本地开发时使用） */
  coverValue?: DeepPartial<T>,
  /**
   * 把配置Key的解析为对象
   *
   * 如：
   *  true：{"db.database": "production"} => {db: {database: "production"}}
   *  false: 将不做处理
   */
  parseKey?: boolean,
  /** 把配置设置到环境变量中 */
  setProcessEnv?: boolean,
}

/** Apollo相关配置 */
export interface ApolloConfig {
  /** Apollo服务地址（只包含协议|域名|端口） */
  url: string;
  /** 获取Apollo配置请求参数 */
  params?: ApolloParams,
  /** Apollo鉴权Token（或secret） */
  token: string;
  /** 应用的appId */
  appId: string;
  /**
   * 一般情况下传入 default 即可
   * 如果希望配置按集群划分，可以参考集群独立配置说明做相关配置，然后在这里填入对应的集群名
   * 集群独立配置文档：https://github.com/ctripcorp/apollo/wiki/
   */
  cluster: string;
  /**
   * 1. 如果没有新建过Namespace的话，传入application即可
   * 2. 如果创建了Namespace，并且需要使用该Namespace的配置，则传入对应的Namespace名字
   */
  namespace: string[],
  /** 获取的内容 */
  env?: EnvEnum,
  useCache?: boolean
}

/** Apollo请求参数 */
export interface ApolloParams {
  /** 将上一次返回对象中的releaseKey传入即可，用来给服务端比较版本，如果版本比下来没有变化，则服务端直接返回304以节省流量和运算 */
  releaseKey?: string;
  /** 这个参数是可选的，用来实现灰度发布 */
  ip?: string;
}
