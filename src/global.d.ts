// data 属性来存储该标签的附加信息，比如 style、class、事件等，通常我们把一个 VNode 对象的 data 属性称为 VNodeData
interface VNodeData {
  target?: string
  style?: Record<string, string|number>
  // 'box' | ['box'] | { box: true } | ['box', { box2: false }]
  class?: string | Array<string | any[] | Record<string, any>> | Record<string, any>
}

// 函数式组件
interface FunctionalComponent {}
// class组件
interface ComponentClass extends Component {
  functional?: boolean
}

// 有状态组件 -- class组件
interface Component {
  render(): VNode
}

// Fragment
interface FragmentVNode {

}

// Portal
interface Portal {
  
}

// 描述节点类型
declare enum VNodeFlags {
  // html 标签
  ELEMENT_HTML = 1,
  // svg标签
  ELEMENT_SVG = 1 << 1,

  // 普通有状态组件
  COMPONENT_STATEFUL_NORMAL = 1 << 2,
  // 需要被keepAlive的有状态组件
  COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE = 1 << 3,
  // 已经被keepAlive的有状态组件
  COMPONENT_STATEFUL_KEPT_ALIVE = 1 << 4,
  // 函数式组件
  COMPONENT_FUNCTIONAL = 1 << 5,

  // 纯文本
  TEXT = 1 << 6,
  // Fragment
  FRAGMENT = 1 << 7,
  // Portal
  PORTAL = 1 << 8,
  // html 和 svg 都是标签元素，可以用 ELEMENT 表示
  ELEMENT = 1 | 1 << 1,
  // 普通有状态组件、需要被keepAlive的有状态组件、已经被keepAlice的有状态组件 都是“有状态组件”，统一用 COMPONENT_STATEFUL 表示
  COMPONENT_STATEFUL = 1 << 2 | 1 << 3 | 1 << 4,
  // 有状态组件 和  函数式组件都是“组件”，用 COMPONENT 表示
  COMPONENT = 1 << 2 | 1 << 3 | 1 << 4 | 1 << 5
}
// 描述children子元素类型
declare enum ChildrenFlags {
  // 未知的 children 类型
  UNKNOWN_CHILDREN = 0,
  // 没有 children
  NO_CHILDREN = 1,
  // children 是单个 VNode
  SINGLE_VNODE = 1 << 1,

  // children 是多个拥有 key 的 VNode
  KEYED_VNODES = 1 << 2,
  // children 是多个没有 key 的 VNode
  NONE_KEYED_VNODES = 1 << 3,
  // 派生新的状态 --- 多节点VNode
  MULTIPLE_VNODES = 1 << 2 | 1 << 3
}

interface VNodeChildren {}

type Tag = string | FunctionalComponent | ComponentClass | null;

interface VNode {
  // 一个始终为 true 的值，有了它，我们就可以判断一个对象是否是 VNode 对象
  _isVNode: true
  // 节点类型
  flags: VNodeFlags
  tag: Tag
  data: VNodeData | null
  key?: string | number
  // 子节点类型
  childFlags: ChildrenFlags
  children: VNodeChildren
  // 当一个 VNode 被渲染为真实 DOM 之后，el 属性的值会引用该真实DOM
  el: Element | null
}