import Vue from '../index'

describe('reactive', () => {
    //测试vue响应式
    it('ccc', () => {
        const vm = new Vue({
            data(){
                return {
                    a:1
                }
            }
        })
       expect(vm.a).toBe(1)
    });
   
    
    
});