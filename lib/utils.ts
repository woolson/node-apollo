import { createHmac } from 'crypto';
import { ApolloConfig } from './interfaces';
import * as isEmpty from 'lodash/fp/isEmpty';
import { AxiosRequestConfig } from 'axios';

/**
 * 构建获取Apollo配置请求地址路径（不包括域名部分）
 * @param config Apollo相关的配置信息
 */
export function buildApolloPath(config: ApolloConfig): string {
  let result = '';
  const { appId, cluster, namespace, params } = config;
  /** 使用缓存的地址 */
  if (config.useCache) {
    result = `/configfiles/json/${appId}/${cluster}/${namespace}`;
    if (params?.ip) {
      result += `?ip=${params.ip}`;
    }
  } else {
    /** 不使用缓存的地址 */
    result = `/configfiles/${appId}/${cluster}/${namespace}`;
    if (!isEmpty(params)) {
      result += `?${new URLSearchParams(Object.entries(params)).toString()}`;
    }
  }
  return result;
}

/**
 * 构建获取Apollo配置验权头部信息
 * @param config Apollo相关的配置信息
 */
export function buildApolloReq(config: ApolloConfig): Partial<AxiosRequestConfig> {
  /**
   * README:
   * 1. Authorization签名算法
   * 签名内容: Token(或称为secret)& 请求Path(如上 buildApolloPath) & 当前毫秒级时间戳
   * 签名算法: sha1(加密) + base64(编码)
   * 签名过程: timestamp + '\n' + path => 进行sha1加密 => 使用base64编码 => 结果
   * 2. 鉴权头部信息
   * 鉴权字段: Authorization & Timestamp
   * 字段说明:
   *   Authorization: Apollo + ' ' + ${项目appId} + ':' + 签名
   *   Timestamp: 和第一步相等的timestamp
   */
  const timestamp = Date.now();
  /** 请求地址 */
  const url = buildApolloPath(config);
  /** 签名内容 */
  const key = `${timestamp}\n${url}`;
  /** 签名 */
  const signature = createHmac('sha1', config.token).update(key).digest('base64');

  return {
    url,
    headers: {
      Authorization: `Apollo ${config.appId}:${signature}`,
      Timestamp: timestamp,
    },
  };
}
