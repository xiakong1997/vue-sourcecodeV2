import {
  parserHTML
} from './parser'
import {
  generate
} from './codegen'
export function complieToFunction(template) {


  let ast = parserHTML(template) //parse方法 将template 转化成ast树
   console.log('模板编译生成的ast树',ast)
  // 通过ast 重新生成代码
  // 我们最后生成的代码需要和render函数一样
  // 类似_c('div',{id:"app"},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))
  // _c代表创建元素 _v代表创建文本 _s代表文Json.stringify--把对象解析成文本

  let code = generate(ast) // 将ast树生成 代码字符串

  //   使用with语法改变作用域为this  之后调用render函数可以使用call改变this 方便code里面的变量取值
  let renderFn = new Function(`with(this){return ${code}}`);  

  return renderFn;

}