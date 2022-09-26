import {
    mergeOptions
} from "../utils"

export function initGlobalApi(Vue) {
    Vue.options = {}
    Vue.mixin = function (options) { //全局混入方法
        this.options = mergeOptions(this.options, options)
        return this //返回自己为了链式调用
    }
    Vue.options._base = Vue
    Vue.options.components = {}
    Vue.component = function (id, definetion) { // 调佣这个方法可以生成一个vue的component
        //通过extend 产生一个继承Vue构造函数的  子类构造函数 sub， 用这个sub去生成一个Vue的实例
        this.options.components[id] = this.options._base.extend(definetion)
        // console.log(this.options,1212)
    }

    Vue.extend = function (opts) {
        const Super = this
        const Sub = function VueComponent(comopt) {
            this._init(comopt)
        }
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        Sub.options = mergeOptions(Super.options,opts)

        return Sub
    }

}