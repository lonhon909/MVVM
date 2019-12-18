import ChildrenFlags from '../vnode/ChildrenFlags';
import mount from '../mount/mount';
import createTextVNode from '../vnode/createTextVNode';
import mountText from './mountText';

/**
 * 挂载Fragment
 * @param { VNode } vnode 
 * @param { Element } container 
 * @param { Boolean } isSVG 
 */
function mountFragment(vnode, container, isSVG) {
  // 拿到 children 和 childFlags
  const { children, childFlags } = vnode
  switch (childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      // 如果是单个子节点，则直接调用 mount
      mount(children, container, isSVG);
      // 单个子节点，就指向该节点
      vnode.el = children.el
      break
    case ChildrenFlags.NO_CHILDREN:
      // 如果没有子节点，等价于挂载空片段，会创建一个空的文本节点占位
      const placeholder = createTextVNode('');
      mountText(placeholder, container);
      // 没有子节点指向占位的空文本节点
      vnode.el = placeholder.el
      break
    default:
      // 多个子节点，遍历挂载之
      for (let i = 0; i < children.length; i++) {
        mount(children[i], container, isSVG)
      }
      // 多个子节点，指向第一个子节点
      vnode.el = children[0].el;
  }
}

export default mountFragment;
