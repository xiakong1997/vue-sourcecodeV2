import {
  nextTick
} from "../utils"

let queue = []
let has = []
let pending = false
export function queueWatcher(Watcher) {
  let id = Watcher.id
  if (has[id] == null) {
    has[id] = id
    queue.push(Watcher)
    if (!pending) { //pending是为了开启一个异步队列
      nextTick(flushSchedulerQueue)
      pending = true
    }
  }
}

function flushSchedulerQueue() {
  for (let index = 0; index < queue.length; index++) {
    queue[index].run()
  }
  pending = false
  queue = []
  has = []
}