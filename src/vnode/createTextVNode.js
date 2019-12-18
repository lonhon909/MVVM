import VNodeFlags from './VNodeFlags';
import ChildrenFlags from './ChildrenFlags';
/**
 * 创建纯文本类型的VNode
 * @param { string } text 
 */
function createTextVNode(text) {
  return {
    _isVNode: true,
    flags: VNodeFlags.TEXT,
    tag: null,
    data: null,
    // 纯文本类型的 VNode，其 children 属性存储的是与之相符的文本内容
    children: text,
    // 文本节点没有子节点
    childFlags: ChildrenFlags.NO_CHILDREN,
    el: null
  }
}

export default createTextVNode;
