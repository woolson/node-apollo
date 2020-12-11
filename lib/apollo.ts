// import { createEnvFile, setEnv } from 'node-apollo';
import { default as request } from 'axios';
import { Config, BaseObject } from './interfaces';
import { buildApolloReq } from './utils';
import * as isEmpty from 'lodash/fp/isEmpty';
import * as dotenv from 'dotenv';
import { jsonKeyParser } from './helpers';
import { merge } from 'webpack-merge';

/**
 * 获取Apollo配置
 */
export async function getApolloConfig<T>(config: Config<T>) {
  const {
    apolloConfig,
    defaultValue,
    coverValue,
    setProcessEnv,
  } = config;

  let configuration: BaseObject = await request({
    baseURL: apolloConfig.url,
    ...buildApolloReq(apolloConfig),
  }).then(res => {
    res.data = apolloConfig.useCache
      ? res.data
      : dotenv.parse(res.data);
    Object.keys(res.data).forEach(key => {
      res.data[key] = res.data[key].replace('\\:', ':');
    });
    return res.data;
  });

  /** 将配置注入process.env中 */
  if (setProcessEnv) {
    Object.assign(process.env, configuration);
  }

  /** 将配置多层级Key解析 */
  configuration = jsonKeyParser(configuration);

  /** NOTICE: 在本地环境使用此覆盖开发环境配置 */
  if (!isEmpty(defaultValue)) {
    configuration = merge(defaultValue, configuration);
  }
  if (!isEmpty(coverValue)) {
    configuration = merge(configuration, coverValue);
  }

  return configuration as T;
}
