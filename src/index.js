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
  render() {
    return h('div', null, [
      h('span', null, 1),
      h('span', null, 2),
      h('span', null, 3),
    ])
  }
}

const list = [
  {
    id: "number",
    value: "Number"
  },
  {
    id: "string",
    value: "String"
  },
  {
    id: "boolean",
    value: "Boolean"
  }
]

const vnode = h('ul', null, list.map(item => h('li', { key: item.id }, item.value)))

console.log(vnode)