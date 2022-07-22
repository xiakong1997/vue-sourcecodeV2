import {
    createElement,
    createTextNode
} from "./vdom/index"



export function renderMixin(Vue) { //在vue 原型上混入_render方法
    Vue.prototype._render = function () {
        let vm = this
        let {
            render
        } = this.$options

        let vnode = render.call(vm)
        console.log('vnode',vnode)
        return vnode
    }
    //有了with(this){_c('div',{id:"app"},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))}
    //所以需要定义_c, _v,_s 这几个函数到vue 的原型上
    Vue.prototype._c = function (...args) {
        let vm = this
        return createElement(vm,...args)   //创建元素文本节点
    }
    Vue.prototype._v = function (text) {
        let vm = this
        return createTextNode(vm,text)   //创建虚拟文本节点
    }
    Vue.prototype._s = function (val) {
       return !val  ? "" : typeof val == "object" ? JSON.stringify(val) :val  
    }


}