import { isObject } from '../utils/utils';
import Dep from '../dep/dep';
import { arrayMethods } from './array';

function protoAugment(target, src, keys) {
  Object.setPrototypeOf(target, src);
}
/**
 * Observer 类会通过递归的方式把一个对象的所有属性都转化成可观测对象
 */
export class Observer {
  constructor(value) {
    this.value = value;
    // 给value新增一个__ob__属性，值为该value的Observer实例
    // 相当于为value打上标记，表示它已经被转化成响应式了，避免重复操作
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      // 当value为数组时的逻辑
      const augment = protoAugment;
      augment(value, arrayMethods, /* arrayKeys */)
    } else {
      this.walk(value);
    }
  }

  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(value, keys[i])
    }
  }
}

/**
 * 使一个对象转化成可观测对象
 * @param { Object } obj 目标对象
 * @param { String } key 对象的key
 * @param { Any } val val 对象的某个key的值
 */
function defineReactive(obj, key, val) {
  // 如果只传了obj和key，那么val = obj[key]
  if (arguments.length === 2) {
    val = obj[key];
  }
  if (isObject(val)) {
    new Observer(val);
  }
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend(); // 在getter中收集依赖
      console.log(`${key}属性被读取了`);
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      console.log(`${key}属性被修改了`);
      val = newVal;
      dep.notify(); // 在setter中通知依赖更新
    }
  })
}

function def(target, key, value) {
  target[key] = value;
}