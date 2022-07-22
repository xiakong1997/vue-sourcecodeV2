import {
    initState
} from './state'
import {
    complieToFunction
} from "./compliter/index"
import {
    callHooks,
    mountComponent
} from './lifecycle'
import {
    mergeOptions
} from './utils'
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        let vm = this
    
        vm.$options = mergeOptions(this.constructor.options, options)
        
        callHooks(vm, 'beforeCreate')  //生命周期钩子函数

        initState(vm)

        callHooks(vm, 'created')   //生命周期钩子函数

        //一开始有el的话会自动去调用$mount方法，
        //$mount方法  会去看options中是否 自己写了render函数，如果没有render函数
        // 那么就去找有没有写template 如果也没有template 那么就将el的outerHTML 赋值给 template，再将emplate用方法
        //进行编译，然后转化成render函数
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        let vm = this
        let options = vm.$options
        el = document.querySelector(el)


        if (!options.render) {
            let template = options.template
            if (!template && el) {
                template = el.outerHTML
              
            }
            let render = complieToFunction(template) //模板编译，生成render函数
            options.render = render

        }

        mountComponent(vm, el)
    }
}