/**
 * 更新文本节点
 * @param {*} prevVNode 
 * @param {*} nextVNode 
 */
function patchText(prevVNode, nextVNode) {
  // 拿到文本元素 el，同时让 nextVNode.el 指向该文本元素
  const el = (nextVNode.el = prevVNode.el)
  // 只有当新旧文本内容不一致时才有必要更新
  if (nextVNode.children !== prevVNode.children) {
    el.nodeValue = nextVNode.children
  }
}

export default patchText;
