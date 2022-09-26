export function patch(oldVnode, vnode) {
    if (!oldVnode) {
        return createElm(vnode)
    }
    // 判断传入的oldVnode是否是一个真实元素
    // 这里很关键  初次渲染 传入的vm.$el就是咱们传入的el选项  所以是真实dom
    // 如果不是初始渲染而是视图更新的时候  vm.$el就被替换成了更新之前的老的虚拟dom
    const isRealElement = oldVnode.nodeType;
    if (isRealElement == 1) {
        // 这里是初次渲染的逻辑
        const oldElm = oldVnode;
        const parentElm = oldElm.parentNode;
        // 将虚拟dom转化成真实dom节点
        let el = createElm(vnode);

        // 插入到 老的el节点下一个节点的前面 就相当于插入到老的el节点的后面
        // 这里不直接使用父元素appendChild是为了不破坏替换的位置
        parentElm.insertBefore(el, oldElm.nextSibling);
        // 删除老的el节点

        parentElm.removeChild(oldVnode);

        return el;
    } else {
        debugger
        //diff的核心代码
        //新老虚拟dom的标签不一样
        if (oldVnode.tag != vnode.tag) {
            //用过oldVnode里面的el真实dom节点，拿到parentNode，再通过replaceChild进行替换
            return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
        }
        //下面的所有情况都是新旧节点标签一样
        //走到这里说明这两个标签只有属性不一样，所有要比较新旧dom的props，添加新的属 性，删除老的属性
        let el = vnode.el = oldVnode.el //只有属性不一样，说明dom节点不需要重新生成，所有新的虚拟dom的el属性 就是老的虚拟dom生成的真实dom
        //如果两个虚拟节点都是文本节点
        if (vnode.tag == undefined) {
            //说明两个节点都是文本节点,比较文本内容
            if (oldVnode.text != vnode.text) {
                el.textContent = vnode.text
            }
            return
        }


        patchProps(vnode, oldVnode.data)

        //开始比较儿子节点
        // 一方有儿子，一方没儿子
        let oldChildren = oldVnode.children || []
        let newChildren = vnode.children || []
        if (oldChildren.length > 0 && newChildren.length > 0) {
            //新旧节点都有儿子，diff的核心，最复杂的部分，双指针的方式比对
            patchChild(el, oldChildren, newChildren)

        } else if (newChildren.length > 0) {
            //新的有儿子，老的没儿子，将新的儿子生成真实dom加到 老的真实dom上面去
            for (let i = 0; i < newChildren.length; i++) {
                let child = createElm(newChildren[i])
                el.appendChild(child)
            }
        } else if (oldChildren.length > 0) {
            //老的有儿子，新的没儿子，将老的正式dom的儿子全部删掉
            el.innerHTML = ''
        }

    }
}

function isSameVnode(oldVnode, newVnode) {
    return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}
//vue的diff的核心方法 
function patchChild(el, oldChildren, newChildren) {

    let oldStartIndex = 0
    let oldStartVnode = oldChildren[0]
    let oldEndIndex = oldChildren.length - 1
    let oldEndVnode = oldChildren[oldEndIndex]

    let newStartIndex = 0
    let newStartVnode = newChildren[0]
    let newEndIndex = newChildren.length - 1
    let newEndVnode = newChildren[newEndIndex]

    //比较还可以进行下去
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (isSameVnode(oldStartVnode, newStartVnode)) { //旧头和新头 头头比较
            patch(oldStartVnode, newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex] //先加再用
            newStartVnode = newChildren[++newStartIndex]
        } else if (isSameVnode(oldEndVnode, newEndVnode)) { //旧尾和新尾 尾尾比较
            patch(oldEndVnode, newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex] //先加再用
            newEndVnode = newChildren[--newEndIndex]
        } else if (isSameVnode(oldStartVnode, newEndVnode)) { //旧头和新尾比较
            patch(oldStartVnode, newEndVnode)
            el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else if (isSameVnode(oldEndVnode, newStartVnode)) { //旧尾和新头的比较， 将旧尾直接插到旧头的前面
            patch(oldEndVnode, newStartVnode)
            el.insertBefore(oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        }else{
            //乱序对比，diff核心
        }
    }
    //新的节点个数比老的个数要多，需要新增  1. A B C D 和 A B C D E   2. A B C D 和 E A B C D
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            let anchor = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
            el.insertBefore(createElm(newChildren[i]), anchor)
        }
    }

    //旧的节点 比新的多，说明有阶段需要删除     A B C D    和 A B C
    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            el.removeChild(oldChildren[i].el)
        }
    }
}

function createComponent(vnode) {
    let i = vnode.data
    if ((i = i.hook) && (i = i.init)) {
        i(vnode)
    }
    if (vnode.componentInstance) {
        return true
    }
}
//首次渲染是将属性赋给真实dom节点， 后续渲染是比较新旧虚拟dom节点的属性差异，对真实dom的属性进行赋值
function patchProps(vnode, oldProps = {}) {
    let newProps = vnode.data || {}
    let el = vnode.el

    let newStyle = newProps.style || {}
    let oldStyle = oldProps.style || {}
    //老的属性在新的属性里面不存在，所有需要删除老的属性
    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style[key] = ""
        }
    }
    for (let key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute(key)
        }
    }
    for (let key in newProps) {
        if (key === 'style') {
            for (let styleName in newStyle) {
                el.style[styleName] = newStyle[styleName]
            }
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}
export function createElm(vnode) {
    let {
        tag,
        data,
        key,
        children,
        text
    } = vnode;
    if (typeof tag === 'string') { //tag为string 说明可能是是元素节点 也可能是自定义组件
        if (createComponent(vnode)) { //如果创建的是自定义组件，那么返回创建完成的自定义组件的真实dom
            return vnode.componentInstance.$el
        }
        vnode.el = document.createElement(tag) //将生成的真实dom 放到vnode的el属性上
        //创建完真实dom节点后，将虚拟dom的属性添加到真实dom上
        patchProps(vnode)
        // 解析虚拟dom属性
        updateProperties(vnode);
        children.forEach(child => {
            vnode.el.append(createElm(child))
        });

    } else {
        vnode.el = document.createTextNode(text)
    }

    return vnode.el //最后返回生成的真实dom
}

function updateProperties(vnode) {
    let props = vnode.data || ""
    let el = vnode.el
    for (let key in props) {
        if (key == 'style') {
            for (let styleName in props[key]) {
                el.style[styleName] = props[key][styleName]
            }
        } else if (key == "class") {
            el.className = props[key]
        } else {
            el.setAttribute(key, props[key])
        }
    }
}