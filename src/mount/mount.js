import VNodeFlags from '../vnode/VNodeFlags';
import mountElement from './mountElement';
import mountComponent from './mountComponent';
import mountText from './mountText';
import mountFragment from './mountFragment';
import mountPortal from './mountPortal';

/**
 * 挂载
 * @param { VNode } vnode 
 * @param { Element } container 
 */
function mount(vnode, container, isSVG, refNode) {
  const flags = vnode.flags;
  if (flags & VNodeFlags.ELEMENT) {
    // 挂载普通标签
    mountElement(vnode, container, isSVG, refNode);
  } else if (flags & VNodeFlags.COMPONENT) {
    // 挂载组件
    mountComponent(vnode, container, isSVG)
  } else if (flags & VNodeFlags.TEXT) {
    // 挂载纯文本
    mountText(vnode, container, isSVG)
  } else if (flags & VNodeFlags.FRAGMENT) {
    // 挂载 Fragment
    mountFragment(vnode, container, isSVG)
  } else if (flags & VNodeFlags.PORTAL) {
    // 挂载 Portal
    mountPortal(vnode, container, isSVG)
  }
}

export default mount;
