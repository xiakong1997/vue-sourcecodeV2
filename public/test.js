// -----------------------
//条件

const a = {
    b: '1',
    c: {
      d: '2',
      e: '3'
    },
    f: '4',
    g: '5'
  }
  
  const str1 = 'q{a.b}wwww{a.c.d}eeeee{a.f}rrrr{a.g}ttttt{a.s}eeeeetttt';

  const obj = {}
  obj.a = a

function getNewStr(str,obj) { 
   const result =  str.replace(/\{(.+?)\}/g, (...args) => {
       return getVal(args[1],obj)
    });
    console.log(result)
 }


 function getVal(expr,obj) {  
    
     return  expr.split(".").reduce((pre,next)=>{
         if( !pre[next]){
             return '{'+expr+'}'
         }else{
            return pre[next]
         }
          
     },obj)
 }

 getNewStr(str1,obj)