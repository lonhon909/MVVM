import patchChildren from './patchChildren';
import ChildrenFlags from '../vnode/ChildrenFlags';

/**
 * 更新Portal
 * @param { VNode } prevVNode 旧VNode
 * @param { Vnode } nextVNode 新VNode
 */
function patchPortal(prevVNode, nextVNode) {
  patchChildren(
    prevVNode.childFlags,
    nextVNode.childFlags,
    prevVNode.children,
    nextVNode.children,
    prevVNode.tag // 注意容器元素是旧的 container
  )

  // 让 nextVNode.el 指向 prevVNode.el
  nextVNode.el = prevVNode.el;

  // 如果新旧容器不同，才需要搬运
  // 通过 nextVNode.tag !== prevVNode.tag 来判断新旧 Portal 的容器是否相同，只有容器不同的情况下才需要搬运工作
  if (nextVNode.tag !== prevVNode.tag) {
    // 获取新的容器元素，即挂载目标
    const container =
      typeof nextVNode.tag === 'string'
        ? document.querySelector(nextVNode.tag)
        : nextVNode.tag

    switch (nextVNode.childFlags) {
      case ChildrenFlags.SINGLE_VNODE:
        // 如果新的 Portal 是单个子节点，就把该节点搬运到新容器中
        container.appendChild(nextVNode.children.el)
        break
      case ChildrenFlags.NO_CHILDREN:
        // 新的 Portal 没有子节点，不需要搬运
        break
      default:
        // 如果新的 Portal 是多个子节点，遍历逐个将它们搬运到新容器中
        for (let i = 0; i < nextVNode.children.length; i++) {
          container.appendChild(nextVNode.children[i].el)
        }
        break
    }
  }
}

export default patchPortal;
