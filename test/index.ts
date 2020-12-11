import { getApolloConfig } from '../lib/apollo';
import { EnvEnum } from '../lib/interfaces';

/** Apollo配置中心开发环境接口地址 */
const APOLLO_META = '<Apollo_Config_Server_Path>';
/** Apollo配置中心开发环境Token */
const APOLLO_ACCESSKEY_SECRET = '<Apollo_Secret>';

export interface ApolloConfig {
  /** MySQL数据库配置 */
  db: {
    /** MySQL数据库主机名 */
    host: string,
    /** MySQL数据库端口 */
    port: string,
    /** MySQL数据库DB */
    database: string,
    /** MySQL数据库用户名 */
    username: string,
    /** MySQL数据库密码 */
    password: string,
  }

  /** Redis缓存服务器配置 */
  redis: {
    /** Redis缓存服务器主机 */
    host: string,
    /** Redis缓存服务器端口 */
    port: string,
    /** Redis缓存服务器DB下标 */
    index: string,
  }

  /** S3配置 */
  s3: {
    /** S3桶名 */
    bucket: string,
    /** S3地区 */
    region: string,
    /** S3食谱图片存储路径 */
    path: string,
    /** S3食谱压缩图片存储路径 */
    pathTiny: string,
    /** S3 SDK 凭证ID */
    accessKeyId: string,
    /** S3 SDK 凭证密码 */
    accessKeySecret: string,
  }

  /** 商户配置 */
  wxMerchant: {
    /** 商户号 */
    id: string;
    /** 商户API密钥 */
    key: string;
  }

  /** 食谱小程序配置 */
  wxRecipe: {
    /** 食谱小程序AppId */
    appId: string,
    /** 食谱小程序AppSecret */
    appSecret: string,
    /** 食谱小程序接口域名 */
    apiDomain: string,
    /** 食谱小程序模板ID TODO:待迁移 */
    tplId: string,
  }

  /** 食与家公众号配置 */
  wxSyj: {
    /** 食与家公众号AppId */
    appId: string,
    /** 食与家公众号AppSecret */
    appSecret: string,
    /** 食与家公众号平台标识 */
    token: string,
    /** 食与家公众号老页面域名 */
    webDomainOld: string,
    /** 食与家公众号页面域名 */
    webDomain: string,
  }

  /** 移动车小程序配置 */
  wxMovingCar: {
    /** 移动车小程序AppId */
    appId: string,
    /** 移动车AppSecret */
    appSecret: string,
  }

  /** 体验馆小程序配置 */
  wxExperienceCenter: {
    /** 体验馆AppId */
    appId: string,
    /** 体验馆AppSecret */
    appSecret: string,
  }

  /** YAPI配置 */
  yapi: {
    /** YAPI同步秘钥 */
    token: string,
  }
}

(async function() {
  const data: ApolloConfig = await getApolloConfig({
    apolloConfig: {
      url: APOLLO_META,
      token: APOLLO_ACCESSKEY_SECRET,
      appId: 'syj-wechat-api',
      cluster: 'default',
      namespace: ['application'],
      env: EnvEnum.Dev,
      // useCache: true
    },
    setProcessEnv: true,
  });
  console.log(process.env);
  console.log('Config:', data);
})();
