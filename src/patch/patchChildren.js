import ChildrenFlags from '../vnode/ChildrenFlags';
import patch from './patch';
import mount from '../mount/mount';

/**
 * 更新子节点
 * @param { ChildrenFlags } prevChildFlags 旧子节点类型
 * @param { ChildrenFlags } nextChildFlags 新子节点类型
 * @param { VNode | VNode[] | string } prevChildren 旧子节点
 * @param { VNode | VNode[] | string } nextChildren 新子节点
 * @param { Element } container 容器
 */
function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  // 无论是新标签还是旧标签，该标签的子节点都可以分为三种情况：只有一个子节点、没有子节点 以及 有多个子节点
  switch(prevChildFlags) {
    case ChildrenFlags.SINGLE_VNODE: // 旧的 children 是单个子节点
      initPrevSINGLE_VNODE(nextChildFlags, prevChildren, nextChildren, container);
      break;
    case ChildrenFlags.NO_CHILDREN: // 旧的 children 中没有子节点
      initPrevNO_CHILDREN(nextChildFlags, prevChildren, nextChildren, container);
      break;
    default: // 旧的 children 中有多个子节点
      initPrevMULTIPLE_VNODES(nextChildFlags, prevChildren, nextChildren, container);
      break;
  }
}

/**
 * 单个子节点
 * @param { ChildrenFlags } nextChildFlags 新子节点类型
 * @param { VNode | VNode[] | string } prevChildren 旧子节点
 * @param { VNode | VNode[] | string } nextChildren 新子节点
 * @param { Element } container 容器
 */
function initPrevSINGLE_VNODE(nextChildFlags, prevChildren, nextChildren, container) {
  switch (nextChildFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      // 新的 children 也是单个子节点时
      // 新旧子节点都是单个子节点，直接patch
      patch(prevChildren, nextChildren, container);
      break
    case ChildrenFlags.NO_CHILDREN:
      // 新的 children 中没有子节点时
      container.removeChild(prevChildren.el);
      break
    default:
      // 移除旧的单个子节点
      container.removeChild(prevChildren.el)
      // 遍历新的多个子节点，逐个挂载到容器中
      for (let i = 0; i < nextChildren.length; i++) {
        mount(nextChildren[i], container)
      }
      // 新的 children 中有多个子节点时
      break
  }
}
/**
 * 没有子节点
 * @param { ChildrenFlags } nextChildFlags 新子节点类型
 * @param { VNode | VNode[] | string } prevChildren 旧子节点
 * @param { VNode | VNode[] | string } nextChildren 新子节点
 * @param { Element } container 容器
 */
function initPrevNO_CHILDREN(nextChildFlags, prevChildren, nextChildren, container) {
  switch (nextChildFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      // 新的 children 也是单个子节点时
      // 没有旧节点，只有新节点，因此直接挂在新节点
      mount(nextChildren, container);
      break
    case ChildrenFlags.NO_CHILDREN:
      // 新的 children 中没有子节点时
      // 新旧子节点都没有，什么都不做
      break
    default:
      // 新的 children 中有多个子节点时
      // 遍历多个新的子节点，逐个使用 mount 函数挂载到容器元素
      for (let i = 0; i < nextChildren.length; i++) {
        mount(nextChildren[i], container)
      }
      break
  }
}
/**
 * 多个子节点
 * @param { ChildrenFlags } nextChildFlags 新子节点类型
 * @param { VNode | VNode[] | string } prevChildren 旧子节点
 * @param { VNode | VNode[] | string } nextChildren 新子节点
 * @param { Element } container 容器
 */
function initPrevMULTIPLE_VNODES(nextChildFlags, prevChildren, nextChildren, container) {
  switch (nextChildFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      // 新的 children 也是单个子节点时
      // 将旧节点遍历移除
      for (let i = 0; i < prevChildren.length; i++) {
        container.removeChild(prevChildren[i].el)
      }
      // 将新节点挂载
      mount(nextChildren, container)
      break
    case ChildrenFlags.NO_CHILDREN:
      // 新的 children 中没有子节点时
      // 新子节点没有，只需将旧节点全部移除
      for (let i = 0; i < prevChildren.length; i++) {
        container.removeChild(prevChildren[i].el)
      }
      break
    default:
      // 新的 children 中有多个子节点时
      // 用来存储寻找过程中遇到的最大索引值
      let lastIndex = 0
      // 遍历新的 children
      for (let i = 0; i < nextChildren.length; i++) {
        const nextVNode = nextChildren[i]
        let j = 0,find = false;
        // 遍历旧的 children
        for (j; j < prevChildren.length; j++) {
          const prevVNode = prevChildren[j]
          // 如果找到了具有相同 key 值的两个节点，则调用 `patch` 函数更新之
          if (nextVNode.key === prevVNode.key) {
            patch(prevVNode, nextVNode, container);
            find = true;
            if (j < lastIndex) {
              // 需要移动
              // refNode 是为了下面调用 insertBefore 函数准备的
              const refNode = nextChildren[i - 1].el.nextSibling
              // 调用 insertBefore 函数移动 DOM
              container.insertBefore(prevVNode.el, refNode)
            } else {
              // 更新 lastIndex
              lastIndex = j
            }
            break // 这里需要 break
          }
        }
        if (!find) {
          // 挂载新节点
          // 找到 refNode
          const refNode =
          i - 1 < 0
            ? prevChildren[0].el
            : nextChildren[i - 1].el.nextSibling
          mount(nextVNode, container, false, refNode)
        }
      }
      // 移除已经不存在的节点
      // 遍历旧的节点
      for (let i = 0; i < prevChildren.length; i++) {
        const prevVNode = prevChildren[i]
        // 拿着旧 VNode 去新 children 中寻找相同的节点
        const has = nextChildren.find(
          nextVNode => nextVNode.key === prevVNode.key
        )
        if (!has) {
          // 如果没有找到相同的节点，则移除
          container.removeChild(prevVNode.el)
        }
      }
      break
  }
}

export default patchChildren;
