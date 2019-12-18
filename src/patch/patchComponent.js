import VNodeFlags from '../vnode/VNodeFlags';
import replaceVNode from './replaceVNode';

/**
 * 有状态组件的更新
 * @param {*} prevVNode 
 * @param {*} nextVNode 
 * @param {*} container 
 */
function patchComponent(prevVNode, nextVNode, container) {
  // tag 属性的值是组件类，通过比较新旧组件类是否相等来判断是否是相同的组件
  if (nextVNode.tag !== prevVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) { // 检查组件是否是有状态组件
    // 1、获取组件实例
    const instance = (nextVNode.children = prevVNode.children);
    // 2、更新 props
    instance.$props = nextVNode.data
    // 3、更新组件
    instance._update()
  } else {
    // 更新函数式组件
    // 通过 prevVNode.handle 拿到 handle 对象
    const handle = (nextVNode.handle = prevVNode.handle)
    // 更新 handle 对象
    handle.prev = prevVNode
    handle.next = nextVNode
    handle.container = container

    // 调用 update 函数完成更新
    handle.update()
  }
}

export default patchComponent;
