import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
    input:"./src/index.js",
    output:{
        format:"umd", //通用模块打包规范，兼容了commonjs和amd
        name:'Vue', //挂载到window上
        file:"dist/vue.js",
        sourcemap:true,
    },
    plugins:[
        babel({
            exclude:"node_module/**"
        }),
        // 热更新 默认监听根文件夹
        livereload(),
        // 本地服务器
        serve({
        open: true, // 自动打开页面
        port: 8000,
        openPage: '/public/index.html', // 打开的页面
        contentBase: ''
        })
        
    ]
}