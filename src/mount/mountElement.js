import patchVNodeData from '../render/patchVNodeData';
import ChildrenFlags from '../vnode/ChildrenFlags';
import VNodeFlags from '../vnode/VNodeFlags';
import mount from './mount';

/**
 * 
 * @param { VNode } vnode Virtual DOM
 * @param { Element } container 挂载容器
 */
function mountElement(vnode, container, isSVG, refNode) {
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG
  const el = isSVG
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
    : document.createElement(vnode.tag);
  const data = vnode.data;
  if (data) {
    patchVNodeData(data, el);
  }
  // 拿到 children 和 childFlags
  const childFlags = vnode.childFlags
  const children = vnode.children
  // 检测如果没有子节点则无需递归挂载
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      // 如果是单个子节点则调用 mount 函数挂载
      mount(children, el, isSVG);
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      // 如果是单多个子节点则遍历并调用 mount 函数挂载
      for (let i = 0; i < children.length; i++) {
        mount(children[i], el, isSVG);
      }
    }
  }

  vnode.el = el;
  // container.appendChild(el);
  refNode ? container.insertBefore(el, refNode) : container.appendChild(el)
}

export default mountElement;
