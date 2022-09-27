import Watcher from "./observe/watcher";
import {
  nextTick
} from "./utils";
import {
  patch
} from "./vdom/patch";

export function lifecycleMixin(Vue) {
  // 把_update挂载在Vue的原型
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // patch是渲染vnode为真实dom核心
    let preVnode = vm._vnode
    if(!preVnode){
      //说明是首次渲染
      vm._vnode = vnode
      vm.$el = patch(vm.$el, vnode)
    }else{
      vm.$el = patch(preVnode, vnode)
    }
    
  };
  Vue.prototype.$nextTick = nextTick
}



export function mountComponent(vm, el) { //生成render函数后
  vm.$el = el;
  //   _update和._render方法都是挂载在Vue原型的方法  类似_init
  let updateComponent = () => {
    vm._update(vm._render());
  }
  callHooks(vm,'beforeMount')
  new Watcher(vm, updateComponent, () => {
    console.log("重新渲染了")
  }, true) //第四个参数true 代表是渲染watcher
}
 

export function callHooks(vm, hook) {
  if(!vm.$options[hook]){
    return
  }
  let handler = vm.$options[hook]
  for (let i = 0; i < handler.length; i++) {
    handler[i].call(vm)

  }
}