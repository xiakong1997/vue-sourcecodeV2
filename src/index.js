import { initGlobalApi } from "./global-api/index";
import {
    initMixin
} from "./init"
import {
    lifecycleMixin
} from "./lifecycle";
import {
    renderMixin
} from "./render";
import {
    stateMixin
} from './state'

function Vue(options) {
    this._init(options) // _init 被挂载到了Vue构造函数的prototype

}
//在Vue的原型上 增加 各种方法
initMixin(Vue)
// 混入_render
renderMixin(Vue);
// 混入_update
lifecycleMixin(Vue);
//混入一些全局的api  比如 mixin extend
initGlobalApi(Vue)

stateMixin(Vue)


export default Vue