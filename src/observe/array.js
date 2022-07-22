let oldArragPrototype = Array.prototype
export let arratMethods = Object.create(Array.prototype)   //创建了一个原型为Array.prototype的新对象，和原来的arr原型进行分割

const methods = [
    'push',
    'shift',
    'unshift',
    'reverse',
    'pop',
    'sort',
    'splice'
]

//vm.arr.push({a:1}) this为vm.arr
methods.forEach((method) => {
    arratMethods[method] = function (...args) {
      //重写数组原型上面的方法
        oldArragPrototype[method].call(this, ...args)
        //为了监控数组 增加个数的时候，增加的值是对象， 所有需要对  一些数组方法进行监控
        //这也是需要重写数组上的方法的原因，可以额外增加对数组的处理
        let ob = this.__ob__
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':     // vm.arr[0].push({a:1})  需要对加入的对象也进行观测
                inserted = args
                break;
            case 'splice':
                inserted = args.slice(2)
            default:
                break;
        }
        if(inserted) ob.observeArray(inserted)
         ob.dep.notify()

    }
})