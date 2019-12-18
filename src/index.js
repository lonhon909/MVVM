import h, { Fragment, Portal } from './vnode/h';
import render from './render/render';

// 子组件类
class ChildComponent {
  render() {
    // 子组件中访问外部状态：this.$props.text
    return h('div', null, this.$props.text)
  }
}
// 父组件类
class ParentComponent {
  constructor() {
    this.localState = 'one'

  }
  // mounted() {
  //   // 两秒钟后将 localState 的值修改为 'two'
  //   setTimeout(() => {
  //     this.localState = 'two'
  //     this._update()
  //   }, 2000)
  // }

  render() {
    return h('div', null, [
      h('span', null, 1),
      h('span', null, 2),
      h('span', null, 3),
    ])
  }
}

// 有状态组件 VNode
const compVNode = h('div', null, [
  h('span', {
    style: {
      color: 'blue'
    },
    class: []
  }, 1),
  h('span', null, 2),
  h('span', null, 3),
])
const compVNode2 = h('div', null, [
  h('span', null, 2),
  h('span', null, 1),
  h('span', {
    style: {
      color: 'red'
    }
  }, 3),
  h('span', null, 4)
])
render(compVNode, document.getElementById('app'))
setTimeout(() => {
render(compVNode2, document.getElementById('app')) 
}, 2000)