import createTextVNode from '../vnode/createTextVNode';
import mount from '../mount/mount';
import mountText from './mountText';
import ChildrenFlags from '../vnode/ChildrenFlags';

/**
 * 
 * @param { VNode } vnode 
 * @param { Element } container 
 */
function mountPortal(vnode, container) {
  const { tag, children, childFlags } = vnode

  // 获取挂载点
  const target = typeof tag === 'string' ? document.querySelector(tag) : tag;

  if (childFlags & ChildrenFlags.SINGLE_VNODE) {
    // 将 children 挂载到 target 上，而非 container
    mount(children, target)
  } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
    for (let i = 0; i < children.length; i++) {
      // 将 children 挂载到 target 上，而非 container
      mount(children[i], target)
    }
  }

  // 占位的空文本节点
  const placeholder = createTextVNode('')
  // 将该节点挂载到 container 中
  mountText(placeholder, container, null)
  // el 属性引用该节点
  vnode.el = placeholder.el
}

export default mountPortal;
