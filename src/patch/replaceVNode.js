import mount from '../mount/mount';

/**
 * 直接替换VNode
 * @param { VNode } prevVNode 旧VNode
 * @param { VNode } nextVNode 新VNode
 * @param { Element } container
 */
function replaceVNode(prevVNode, nextVNode, container) {
  // 将旧的 VNode 所渲染的 DOM 从容器中移除
  container.removeChild(prevVNode.el);
  // 如果将要被移除的 VNode 类型是组件，则需要调用该组件实例的 unmounted 钩子函数
  if (prevVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 类型为有状态组件的 VNode，其 children 属性被用来存储组件实例对象
    const instance = prevVNode.children
    instance.unmounted && instance.unmounted()
  }
  // 再把新的 VNode 挂载到容器中
  mount(nextVNode, container)
}

export default replaceVNode;
