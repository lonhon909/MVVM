import VNodeFlags from '../vnode/VNodeFlags';
import mountStatefulComponent from './mountStatefulComponent';
import mountFunctionalComponent from './mountFunctionalComponent';

/**
 * 组件的挂载
 * @param { VNode } vnode 
 * @param { Element } container 
 * @param { Boolean | undefined} isSVG 
 */
function mountComponent(vnode, container, isSVG) {
  // 件还分为有状态组件和函数式组件
  if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
    // 有状态组件
    mountStatefulComponent(vnode, container, isSVG)
  } else {
    // 函数式组件
    mountFunctionalComponent(vnode, container, isSVG)
  }
}

export default mountComponent;
