import * as isEmpty from 'lodash/fp/isEmpty';
import { BaseObject } from '../interfaces';

/**
 * 获取数据类型
 * @param target 需要获取类型的数据
 */
export function getType(target: any) {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

export function isObject(target: any) {
  return getType(target) === 'object';
}


/**
 * 对象数据验
 * @param obj 需要验证的对象
 * @param key 需要验证对象的key
 * @param message 验证不通过信息
 */
export function validate(
  obj: BaseObject,
  key: string,
  message: string
): void | never {
  if (isEmpty(obj) || isEmpty(obj[key])) {
    throw new Error(`Node Apollo: Error ${message}`);
  }
}

export function setValueForKeyPath(
  target: BaseObject,
  keyPath: string,
  keyValue: any
) {
  const keys = keyPath.split('.');
  let current = target;
  while (keys.length) {
    const key = keys.shift();
    if (keys.length === 0) {
      current[key] = keyValue;
    } else {
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
  }
  return target;
}

/**
 * 解析JSON值的key
 *
 * 如：
 *  true：{"db.database": "production"} => {db: {database: "production"}}
 *  false: 将不做处理
 */
export function jsonKeyParser<T extends BaseObject>(jsonData: string | object) {
  const result = {};
  const data = typeof jsonData === 'string'
    ? JSON.parse(jsonData)
    : jsonData;

  /** 将key:value转成聚合对象 */
  Object.keys(data).forEach(fullKeyPath => {
    setValueForKeyPath(result, fullKeyPath, data[fullKeyPath]);
  });
  return result as T;
}
