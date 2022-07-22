export function isFunction(val) {
  return typeof val === "function"
}
export function isObject(val) {
  return typeof val === 'object' && val !== null //因为typeof obj === "object"
}


//nextTick核心原理，异步更新
let timerFunc; //定义异步方法  采用优雅降级 //为了开启一个异步队列
if (typeof Promise !== "undefined") {
  // 如果支持promise
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
  };
} else if (typeof MutationObserver !== "undefined") {
  // MutationObserver 主要是监听dom变化 也是一个异步方法
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== "undefined") {
  // 如果前面都不支持 判断setImmediate
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // 最后降级采用setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}
let callbacks = []
let pending = false

function flushCallbacks() {
  callbacks.forEach(cb => cb())
  pending = false
}
export function nextTick(cb) {
  callbacks.push(cb) // 用户自己主动调用nextTick的回调函数  和  执行异步更新的回调函数
  if (!pending) {
    timerFunc()
    pending = true
  }
}

let lifeCycleHooks = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]
let strats = {}

lifeCycleHooks.forEach((hook) => {
  strats[hook] = mergeHook
})
strats['components'] = function (parentVal, childVal) {
    let newObj = Object.create(parentVal)
    for(let key in childVal){
      newObj[key] = childVal[key]
    }
    return newObj
}

function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}

export function mergeOptions(parent, child) {
  const options = {}
  for (let key in parent) {
    mergeField(key)
  }

  for (let key in child) {
    if (parent.hasOwnProperty(key)) {
      continue
    }
    mergeField(key)
  }

  function mergeField(key) {
    let parentVal = parent[key]
    let childVal = child[key]


    if (strats[key]) {
      options[key] = strats[key](parentVal, childVal)
    } else {
      if (isObject(parentVal) && isObject(childVal)) {
        options[key] = {
          ...parentVal,
          ...childVal
        }
      } else {
        options[key] = childVal
      }
    }

  }

  return options
}