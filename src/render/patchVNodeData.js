const domPropsRE = /[A-Z]|^(?:value|checked|selected|muted)$/;

function patchVNodeData(data, el) {
  // 如果 VNodeData 存在，则遍历之
  for(let key in data) {
    // key 可能是 class、style、on 等等
    switch(key) {
      case 'style':
        // 如果 key 的值是 style，说明是内联样式，逐个将样式规则应用到 el
        for(let k in data.style) {
          el.style[k] = data.style[k]
        }
      break;
      case 'class':
        el.className = initClass(data.class);
        break;
      default:
        if (key[0] === 'o' && key[1] === 'n') {
          // 事件
          el.addEventListener(key.slice(2), data[key])
        } else if (domPropsRE.test(key)) {
          // 当作 DOM Prop 处理
          el[key] = data[key]
        } else {
          // 当作 Attr 处理
          el.setAttribute(key, data[key])
        }
        break;
    }
  }
}

function initClass(classData) {
  if (!classData) return '';
  // class = 'box'
  if (typeof classData === 'string') {
    return classData
  }
  // :class = "['box', 'left', { right: false }]"
  if (Array.isArray(classData)) {
    const classText = new Set();
    classData.forEach(item => {
      classText.add(initClass(item))
    })
    return [...classText.keys()].join(' ');
  }
  // :class = "{ box: true, text: false }"
  if (Object.prototype.toString.call(classData) === '[object Object]') {
    const classText = new Set();
    for (let key in classData) {
      if (Reflect.has(classData, key) && !!classData[key]) {
        classText.add(key);
      }
    }
    return [...classText.keys()].join(' ')
  }
}

/**
 * 设置/更新元素attr/DOM Props
 * @param { Element } el 需要修改attr的目标元素
 * @param { String } key attr属性名
 * @param {*} prevValue 旧属性值
 * @param {*} nextValue 新属性值
 */
export function patchData(el, key, prevValue, nextValue) {
  switch(key) {
    case 'style':
      if (nextValue) {
        // 将新的样式数据应用到元素
        for (let k in nextValue) {
          el.style[k] = nextValue[k]
        }
      }
      if (prevValue) {
        // 移除已经不存在的样式
        for (let k in prevValue) {
          // 检查style旧属性在新的style中是否存在
          if (!nextValue || !Reflect.has(nextValue, k)) {
            el.style[k] = '';
          }
        }
      }
      break;
    case 'class':
      // class直接全体替换
      el.className = initClass(nextValue);
      break;
    default:
      if (key[0] === 'o' && key[1] === 'n') {
        // 事件
        // 移除旧事件
        if (prevValue) {
          el.removeEventListener(key.slice(2), prevValue)
        }
        // 添加新事件
        if (nextValue) {
          el.addEventListener(key.slice(2), nextValue)
        }
      } else if (domPropsRE.test(key)) {
        // 当作 DOM Prop 处理
        el[key] = nextValue;
      } else {
        // 当作 Attr 处理
        el.setAttribute(key, nextValue);
      }
      break;
  }
}

export default patchVNodeData;
