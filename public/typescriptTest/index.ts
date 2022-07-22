function getValss<T extends Object, K extends keyof T>(obj: T, key: K): T[K] {
    console.log(obj[key])
    return obj[key]
}

var p = {
    name: 'zqkk',
    age: 18
}

getValss(p, 'age')


interface People {
    name: string;
    age: number;
    sex:string
}
// var people:People = {
//     name:'zqkk',
//     age:19
// }
type changeType<T> = {
    [K in keyof T]?: T[K]
}
var people: changeType<People> = {
    name:'zqll',
    sex:"1"
}

type name = "firstName" | "lastName"
type tyName = {
    [K in name]: string
}