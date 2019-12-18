/**
 * 挂载纯文本
 * @param {*} vnode 
 * @param {*} container 
 */
function mountText(vnode, container) {
  const el = document.createTextNode(vnode.children)
  vnode.el = el
  container.appendChild(el)
}

export default mountText;
