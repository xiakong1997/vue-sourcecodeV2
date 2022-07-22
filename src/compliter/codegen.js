const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g //匹配花括号 {{a}}

function gen(el) {
    if (el.type == 1) { //元素标签
        return generate(el)
    } else {
        let text = el.text
        if (!defaultTagRE.test(text)) { //如果文本没有匹配到花括号，那么就当做普通文本去凭借
            return `_v('${text}')`
        } else {
            let match;
            let tokens = [];  //
            let lastIndex = defaultTagRE.lastIndex = 0;
         
            while (match = defaultTagRE.exec(text)) { //2131212{{name}}ssss{{age}}
         
                let index = match.index //index = 7
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index))) //文本内容
                }
                tokens.push(`_s(${match[1].trim()})`) //变量
                lastIndex = index + match[0].length
               
            }
            if(lastIndex < text.length){ //文本内容
                tokens.push(JSON.stringify(text.slice(lastIndex))) //变量
            }
         
            return `_v(${tokens.join("+")})`
        }

    }
}


function genProps(attrs) { //来拼接属性

    let str = "";
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i] //{name:id,value:app}
        if (attr.name == "style") { //将style 特殊处理 style:{"color":" aliceblue","background-color":" #fff"}
            let styleObj = {};
            attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
                styleObj[arguments[1]] = arguments[2]
            })
            attr.value = styleObj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},` // {id:"app"}JSON.stringify 对值加上双引号 
    }
    return `{${str.slice(0,-1)}}`
}

function genChildren(el) {
    //对children进行拼接
    let children = el.children
    if (children) {
        return children.map(c => gen(c)).join(",")
    }
    return false
}




export function generate(el) {


    //执行_c("my_button",{},"")的时候 执行了 createElm(vnode) 创建自定义组件的方法  vm.$mount 会重新生成一个render函数

    //将ast树 通过字符串拼接的方法 转换成 下面的形势
    //_c('div',{id:"app"},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))
    let children = genChildren(el)
    let code = `_c('${el.tag}',${el.attrs ? genProps(el.attrs):'undefined'}${children? `,${children}`:""})`
     console.log(code)
    return code
}