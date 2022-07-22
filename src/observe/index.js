import {
    isObject
} from "../utils"
import {
    arratMethods
} from "./array"
import Dep from "./dep"

class Observer {
    constructor(data) {
        this.dep = new Dep()
        // data.__ob__ = this  如果这么写 会进入无限 循环  会对__ob__也进行观测 __ob__也加上__ob__属性 继续观测劫持
        Object.defineProperty(data,"__ob__",{
            value:this,
            enumerable:false  //将__ob__这个属性 变成无法被遍历
        })
        if (Array.isArray(data)) {
            data.__proto__ = arratMethods
            this.observeArray(data)
        } else { 
            this.walk(data)
        }

    }
    observeArray(data){
      data.forEach(item => {
          observe(item)                
      })
    }

    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}
function dependArray(value) {
    for (let index = 0; index < value.length; index++) {
        const current = value[index];
        current.__ob__ && current.__ob__.dep.depend()
        if(Array.isArray(current)){
            dependArray(current)
        }
        
    }
}
function defineReactive(data, key, value) {
   
  let childOb = observe(value)  //返回了一个Observer类型的对象
    let dep = new Dep()
    Object.defineProperty(data, key, {
        get() { 
           if(Dep.target){   //实际上是当前缓存在全局的一个watcher
              dep.depend()  // 将当前数据的dep存在watcher的dep数组中，将watcher放到相应dep的watcher数组中
              console.log(dep)
              if(childOb){   //主要是为了data中的数组嵌套数组
                  childOb.dep.depend()
                  //如果value是[[1,2,3]]，数组里面套数组，那么需要对里层的数组也进行依赖收集
                  if(Array.isArray(value)){
                      dependArray(value)
                  }
              }
           }
            return value
        },
        set(newV) {
            if(value != newV){
                observe(newV)
                value = newV
                dep.notify()  //为了触发watcher的update方法
            }
        }
    })
}
export function observe(data) {
    if (!isObject(data)) {
        return
    }
    if(data.__ob__){
        return data.__ob__
    }

    return new Observer(data)
}