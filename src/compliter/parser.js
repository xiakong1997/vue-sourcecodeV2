
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //匹配标签名 形如 abc-123
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //匹配特殊标签 形如 abc:234 前面的abc:可有可无
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配标签开始 形如 <abc-123 捕获里面的标签名
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束  >
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾 如 </abc-123> 捕获里面的标签名
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性  形如 id="app"
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/ //匹配花括号 {{a}}



// import {
//     generate
// } from "./codegen"

function creatASTelement(tagName,attrs) {  //创建AST元素
  return {
    tag:tagName,
    type:1,//元素标签的nodeType为1 文本为3
    attrs,
    children:[],
    parent
  }
 }


let root  = null
let stack = []
function start(tagName, attributes) {
  let parent = stack[stack.length - 1]
  let element = creatASTelement(tagName,attributes)
  if(!root){
    root = element
  }
  element.parent = parent
  if(parent){
    parent.children.push(element)
  }
  stack.push(element)
}

function end(tagName) {

let last = stack.pop()

if(last.tag !== tagName){
    throw new Error("标签有误")
}
}

function chars(text) {
  text = text.replace(/\s/g,"")
  let parent = stack[stack.length - 1]
  if(text){
       parent.children.push({
         type:3, 
         text
       })
  }
}



export function parserHTML(html) {

  function advance(length) {
    html = html.substring(length)
  }
  //   <div id="app">
  //   <p>{{name}}</p>
  // </div>
  function parseStartTag() {
    const start = html.match(startTagOpen) //start[1]就是正则匹配到的标签名
    if (start) { //如果能匹配到开始的标签，那么进行截取
      let match = {
        tagName: start[1],
        attrs: [] //还没有解析到标签属性
      }
      //匹配完成后，需要将匹配到的部分删除 <div 删除
      advance(start[0].length)
    
      let end; // 用来标识有没有匹配到结束标签
      let attr; //用来匹配属性
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) { //没有匹配到结束标签 并且匹配到了属性
       
        advance(attr[0].length) //匹配到一次 就要把匹配到的标签属性删掉
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
      }
      //匹配到了结束的标签
     
      if (end) {
        advance(end[0].length)
      }
      return match

    }
    return false //没有匹配到开始标签 那么直接返回false

  }

  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) { //首先考虑的是开始标签,
      const startMatchTag = parseStartTag(html) //开始解析开始标签
      if (startMatchTag) {
        start(startMatchTag.tagName, startMatchTag.attrs)
        continue;
      }
      const endMatchTag = html.match(endTag)
      if(endMatchTag){
        end(endMatchTag[1])
        advance(endMatchTag[0].length)
        continue;
      }

    }
    let text;
    if (textEnd > 0) { //  123456</div> 开始匹配文本
      text = html.substring(0, textEnd)
      
    }
    if(text){
      chars(text)
      advance(text.length)
    }
    
  }

  return root
}