import mount from "./mount";
import patch from '../patch/patch';

/**
 * 组件的挂载
 * @param { VNode } vnode 
 * @param { Element } container 
 * @param { Boolean | undefined} isSVG 
 */
function mountStatefulComponent(vnode, container, isSVG) {
  // 创建组件实例,将组建实例存在children中
  const instance = (vnode.children = new vnode.tag());
  // 初始化 props
  instance.$props = vnode.data

  instance._update = function() {
    // 如果 instance._mounted 为真，说明组件已挂载，应该执行更新操作
    if (instance._mounted) {
      // 1、拿到旧的 VNode
      const prevVNode = instance.$vnode
      // 2、重渲染新的 VNode
      const nextVNode = (instance.$vnode = instance.render())
      // 3、patch 更新
      patch(prevVNode, nextVNode, prevVNode.el.parentNode)
      // 4、更新 vnode.el 和 $el
      instance.$el = vnode.el = instance.$vnode.el;
    } else {
      // 1、渲染VNode
      instance.$vnode = instance.render()
      // 2、挂载
      mount(instance.$vnode, container, isSVG)
      // 3、组件已挂载的标识
      instance._mounted = true
      // 4、el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素
      instance.$el = vnode.el = instance.$vnode.el
      // 5、调用 mounted 钩子
      instance.mounted && instance.mounted()
    }
  }
  instance._update();
}

/* class组件，有状态组件
  class ParentComponent extends Component {
      render() {
      return h('div', null, 'class组件')
    }
  }
*/

export default mountStatefulComponent;
