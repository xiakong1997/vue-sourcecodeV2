import {
  isObject,
  isReservedTag
} from "../utils";

export default class Vnode {
  constructor(vm, tag, data, key, children, text, componentOptions) {
    this.vm = vm
    this.tag = tag;
    this.data = data;
    this.key = key;
    this.children = children;
    this.text = text;
    this.componentOptions = componentOptions
  }
}


export function createElement(vm, tag, data = {}, ...children) {
  let key = data.key;
  if (isReservedTag(tag)) {
    return new Vnode(vm, tag, data, key, children);
  } else {
    let Ctor = vm.$options.components[tag]
    return createComponent(vm, tag, data, key, children, Ctor)
  }

}
//创建组件标签的vnode
function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) { //如果ctor是一个对象，需要用extend方法将这个对象作为组件options传入，生成一个组件构造函数
    Ctor = vm.$options._base.extend(Ctor)
  }
  data.hook = {
    init(vnode) {
      let vm = vnode.componentInstance = new Ctor({
        _isComponent: true
      })
      vm.$mount()
    }
  }
  return new Vnode(vm, `vue-component-${tag}`, data, key, undefined, undefined, {
    Ctor,
    children
  })
}
// 创建文本vnode
export function createTextNode(vm, text) {
  return new Vnode(vm, undefined, undefined, undefined, undefined, text);
}