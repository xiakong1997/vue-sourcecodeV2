import {
  isFunction
} from "./utils";
import {
  observe
} from "./observe/index";
import Watcher from "./observe/watcher";
import Dep from "./observe/dep";
export function initState(vm) {
  let options = vm.$options
  if (options.data) {
    initData(vm)
  }
  if (options.computed) {
    initComputed(vm, options.computed)
  }
  if (options.watch) {
    initWatch(vm, options.watch)
  }

}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newV) {
      vm[source][key] = newV
    }
  })

}
export function stateMixin(Vue) {
  Vue.prototype.$watch = function (key, handler, options = {}) {
    console.log(key, handler)
    options.user = true
    new Watcher(this, key, handler, options)
  }
}

function initData(vm) {
  let data = vm.$options.data

  data = vm._data = isFunction(data) ? data.call(vm) : data //data 可能为函数


  for (let key in data) {
    proxy(vm, "_data", key)
  }
  //增加数据代理， 可以通过vm.[属性名] 访问到vm._data上的数据


  observe(data)
}

function initWatch(vm, watch) {
  for (let key in watch) {
    let handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }

}

function createWatcher(vm, key, handler) {
  return vm.$watch(key, handler)
}

function initComputed(vm, computed) {
  const watchers = vm._computedWatchers  = {}
  for (let key in computed) {
     const userDef = computed[key]
     let getter =  typeof userDef === 'function' ? userDef : userDef.get

     watchers[key] =  new Watcher(vm,getter,()=>{},{lazy:true} )
     defineComputed(vm,key,userDef)
  }
}

function defineComputed(vm,key,userDef) { 
  let sharedProperty = {}
  if(typeof userDef === 'function'){
    sharedProperty.get = createComputedGetter(key)
  }else{
    sharedProperty.get = createComputedGetter(key)
    sharedProperty.set = userDef.set
  }
     Object.defineProperty(vm,key,sharedProperty)
 }

 function createComputedGetter(key) {  //计算属性的get方法
    return function () {
      const watcher =  this._computedWatchers[key] //相应的computed watcher
      if(watcher.dirty){  //为了缓存数据
            watcher.evaluate()   //计算属性watcher new的时候不调用get方法，  取值的时候调用evaluate去调用get
      }
      if(Dep.target){  //说明上层是个渲染的watcher
           watcher.depend()  //用计算属性的watcher取到 对应的dep数组，给dep数组的收集留下的watcher
      }  //一个dep  对应 多个watcher，当前情况是一个dep对应                                                                                                                                               9
        return watcher.value
      }
  }