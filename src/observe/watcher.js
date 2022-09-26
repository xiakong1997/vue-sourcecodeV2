import {
    pushTarget,
    popTarget
} from './dep.js'
import {
    queueWatcher
} from './scheduler.js'

let id = 0
class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm
        this.exprOrFn = exprOrFn
        this.cb = cb
        this.options = options
        this.lazy = !!options.lazy
        this.dirty = this.lazy
        if (typeof exprOrFn === "string") { // 对watch创建的Watcher做处理  a.b.c
            this.getter = function () {
                let exprArr = exprOrFn.split(".")
                return exprArr.reduce((prev, next) => {
                    return prev[next]
                }, this.vm)

            }
        } else {
            this.getter = exprOrFn
        }

        this.id = id++
        this.deps = []; //存放dep的容器                                                                                                                                                                                                                                                                                                                                                                                                                                                   
        this.depsId = new Set(); //用来去重dep
        this.value = this.lazy ? undefined : this.get()
       
    }
    get() {
        pushTarget(this) //将Dep.target变成 watcher
        let value = this.getter.call(this.vm) // 使用render的时候，_s方法会往vm上去取值，所以会触发一开始对属性添加的get方法,使用call方法将this指向vm
        // console.log(this.getter,'value')
        popTarget() //将Dep.target == null
        return value
    }
    addDep(dep) {
        let id = dep.id
        if (!this.depsId.has(id)) {
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
    update() {
        if(this.lazy){
            this.dirty = true
        }else{
            queueWatcher(this) //将watcher放入一个更新队列，当主线程上的代码执行完毕后，开始循环调用，提升性能
        }
       
    }
    run() { //表示真正的需要去执行渲染
        let newValue = this.get()
        let oldValue = this.valu
        this.value = newValue
        this.cb(newValue, oldValue) //执行watch的函数
    }
    evaluate() {
        
        this.dirty = false
        this.value = this.get()
       
        return 
    }
    depend(){
     let i = this.deps.length
     while(i--){
         this.deps[i].depend()
     }
    //  console.log(this.deps)
    }
}

export default Watcher