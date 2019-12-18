import replaceVNode from './replaceVNode';
import { patchData } from '../render/patchVNodeData';
import patchChildren from './patchChildren';
/**
 * 更新patch元素节点
 * @param { VNode } prevVNode 旧VNode
 * @param { VNode } nextVNode 新VNode
 * @param { Element } container
 */
function patchElement(prevVNode, nextVNode, container) {
  // 如果新旧 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode
  if (prevVNode.tag !== nextVNode.tag) { // 如果标签名不同，直接替换
    replaceVNode(prevVNode, nextVNode, container)
    return
  }

  // 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素
  const el = (nextVNode.el = prevVNode.el);
  const prevData = prevVNode.data;
  const nextData = nextVNode.data;

  if (nextData) {
    // 遍历新的 VNodeData，将旧值和新值都传递给 patchData 函数
    for (let key in nextData) {
      const prevValue = prevData && prevData[key];
      const nextValue = nextData && nextData[key];
      patchData(el, key, prevValue, nextValue);
    }
  }
  if (prevData) {
    // 遍历旧的 VNodeData，将已经不存在于新的 VNodeData 中的数据移除
    for (let key in prevData) {
      const prevValue = prevData[key];
      // 检查旧属性是否存在新的data中，如果不存在则需要移除
      if (prevValue && (!nextData || !Reflect.has(nextData, key))) {
        // 第四个参数为 null，代表移除数据
        patchData(el, key, prevValue, null);
      }
    }
  }

  // 调用 patchChildren 函数递归地更新子节点
  patchChildren(
    prevVNode.childFlags, // 旧的 VNode 子节点的类型
    nextVNode.childFlags, // 新的 VNode 子节点的类型
    prevVNode.children,   // 旧的 VNode 子节点
    nextVNode.children,   // 新的 VNode 子节点
    el                    // 当前标签元素，即这些子节点的父节点
  )
}

export default patchElement;
