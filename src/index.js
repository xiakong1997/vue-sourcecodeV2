import {
    initGlobalApi
} from "./global-api/index";
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

import {
    complieToFunction
} from "./compliter/index.js";
import {
    createElm,
    patch
} from "./vdom/patch";


let oldTempalte = `<div>
<li key="C">C</li>
<li key="A">A</li>
<li key="B">B</li>
<li key="D">D</li> 
</div>`
let vm1 = new Vue({
    data: {
        msg: 'hello world'
    }
})

const render1 = complieToFunction(oldTempalte)
const oldVnode = render1.call(vm1)
document.body.appendChild(createElm(oldVnode))


let newTempalte = `<div>
<li key="B">B</li>
<li key="C">C</li>
<li key="D">D</li>
<li key="A">A</li>
</div>`
let vm2 = new Vue({
    data: {
        msg: 'zf'
    }
})
const render2 = complieToFunction(newTempalte)
const newVnode = render2.call(vm2)



setTimeout(() => {
    patch(oldVnode, newVnode)
}, 2000)




export default Vue