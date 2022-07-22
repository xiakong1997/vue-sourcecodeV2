export function patch(oldVnode,vnode) {
    debugger
    if(!oldVnode){
        return createElm(vnode)
    }
 // 判断传入的oldVnode是否是一个真实元素
  // 这里很关键  初次渲染 传入的vm.$el就是咱们传入的el选项  所以是真实dom
  // 如果不是初始渲染而是视图更新的时候  vm.$el就被替换成了更新之前的老的虚拟dom
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // 这里是初次渲染的逻辑
    const oldElm = oldVnode;
    const parentElm = oldElm.parentNode;
    // 将虚拟dom转化成真实dom节点
    let el = createElm(vnode);
    
    // 插入到 老的el节点下一个节点的前面 就相当于插入到老的el节点的后面
    // 这里不直接使用父元素appendChild是为了不破坏替换的位置
    parentElm.insertBefore(el, oldElm.nextSibling);
    // 删除老的el节点
   
    parentElm.removeChild(oldVnode);
    
    return el;
  }
}
function createComponent(vnode) {
    let i = vnode.data
    if((i = i.hook) && (i = i.init)){
        i(vnode)
    }
    if(vnode.componentInstance){
        return true
    }
  }
function createElm(vnode) { 
    let { tag, data, key, children, text } = vnode;
    if(typeof tag === 'string') {  //tag为string 说明可能是是元素节点 也可能是自定义组件

        if(createComponent(vnode)){  //如果创建的是自定义组件，那么返回创建完成的自定义组件的真实dom
            return vnode.componentInstance.$el
        }
        vnode.el = document.createElement(tag) //将生成的真实dom 放到vnode的el属性上
        // 解析虚拟dom属性
        updateProperties(vnode);
        children.forEach(child => {
            vnode.el.append(createElm(child))
        });
 
    }else{
        vnode.el = document.createTextNode(text)
    }
    
    return vnode.el //最后返回生成的真实dom
}
function updateProperties(vnode) {
      let  props = vnode.data || ""
      let el = vnode.el
      for(let key in props){
         if(key == 'style'){
            for(let styleName in props[key]){
                el.style[styleName] = props[key][styleName]
            }
         }else if(key == "class"){
          el.className = props[key]
         }else{
             el.setAttribute(key,props[key])
         }
      }
 }
  