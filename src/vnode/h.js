import VNodeFlags from './VNodeFlags';
import ChildrenFlags from './ChildrenFlags';
import createTextVNode from './createTextVNode';

export const Fragment = Symbol('fragment');
export const Portal = Symbol('portal');

/**
 * 辅助生成VNode
 * @param {*} tag
 * @param { Object | null } data
 * @param { Array | Object | String | null } children
 */
function h(tag, data = null, children = null) {
  const { flags, tag: _tag } = initTagType(tag, data);
  const { childFlags, children: _children } = initChildrenType(children);
  return {
    _isVNode: true,
    tag: _tag,
    flags,
    data,
    key: data && data.key ? data.key : null,
    children: _children,
    childFlags,
    el: null
  }
}

/**
 * 判断确定VNode类型
 * @param {*} tag VNode类型
 * @param { Object | null } data
 */
function initTagType(tag, data) {
  let flags = null;
  // html元素标签
  if (typeof tag === 'string') {
    flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML;
  } else if (tag === Fragment) { // Fragment
    flags = VNodeFlags.FRAGMENT;
  } else if (tag === Portal) { // Portal
    flags = VNodeFlags.PORTAL;
    // 为 Portal 的 VNode，其 tag 属性值存储的是 Portal 挂载的目标, 即 target
    tag = data && data.target;
  } else { // 该 VNode 是组件
    if (tag !== null && typeof tag === 'object') { // 兼容 Vue2 的对象式组件
      flags = tag.functional
        ? VNodeFlags.COMPONENT_FUNCTIONAL        // 函数式组件
        : VNodeFlags.COMPONENT_STATEFUL_NORMAL   // 有状态组件
    } else if (typeof tag === 'function') {
      // Vue3 的类组件
      flags = tag.prototype && tag.prototype.render
        ? VNodeFlags.COMPONENT_STATEFUL_NORMAL  // 有状态组件
        : VNodeFlags.COMPONENT_FUNCTIONAL       // 函数式组件
    }
  }
  return { flags, tag }
}
/**
 * 判断子节点的类型
 * @param { Array | Object | String | null } children 
 */
function initChildrenType(children) {
  let childFlags = null;
  if (Array.isArray(children)) {
    const length = children.length;
    if (length === 0) {
      // 没有子节点
      childFlags = ChildrenFlags.NO_CHILDREN;
    } else if (length === 1) { // 单个子节点
      childFlags = ChildrenFlags.SINGLE_VNODE;
      children = children[0]; // 转化成对象形式
    } else {
      // 多个子节点，且子节点使用key
      childFlags = ChildrenFlags.KEYED_VNODES;
      children = normalizeVNodes(children);
    }
  } else if (children == null) { // 判断null/undefined
    // 没有子节点
    childFlags = ChildrenFlags.NO_CHILDREN;
  } else if (typeof children === 'object' && children._isVNode) {
    // 单个子节点
    childFlags = ChildrenFlags.SINGLE_VNODE;
  } else {
    // 其他情况都作为文本节点处理，即单个子节点，会调用 createTextVNode 创建纯文本类型的 VNode
    childFlags = ChildrenFlags.SINGLE_VNODE
    children = createTextVNode(children + '')
  }
  return { childFlags, children }
}

/**
 * 转化key
 * @param {*} children 
 */
function normalizeVNodes(children) {
  const newChildren = []
  // 遍历 children
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.key == null) {
      // 如果原来的 VNode 没有key，则使用竖线(|)与该VNode在数组中的索引拼接而成的字符串作为key
      child.key = '|' + i
    }
    newChildren.push(child)
  }
  // 返回新的children，此时 children 的类型就是 ChildrenFlags.KEYED_VNODES
  return newChildren
}

export default h;
