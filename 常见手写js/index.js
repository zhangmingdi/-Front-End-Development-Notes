// 深拷贝对象
function deepCopyObject(obj,map = new Map()){
  if(!obj) return obj
  if(typeof obj !=='object') return obj
  const isExit = map.get(obj)
  if(isExit)return isExit
  let newObject
  if(obj instanceof Array) {
    newObject = []
    for(let i = 0;i<obj.length;i++){
      newArr[i]=deepCopyObject(obj)
    }
  }
  if(obj instanceof Function){
    newObject= new Function('return',func.toString())()
  }
  if(obj instanceof RegExp ||obj instanceof Error||obj instanceof Date){
    newObject= new RegExp(obj)
  }

  //先排除 Date、Rgex对象
  newObject = {}
  let objectKeys = Object.keys(obj)
  objectKeys.forEach(vo=>{
    newObject[vo]=deepCopyObject(obj[vo])
  })
  map.set(obj,newObject)

  return newObject
}

// call
function call(obj,...args){
  var fn = this
  //注意obj可能是非对象类型
  const vo = obj ? Object(obj) : window
  const key = new Symbol('l')
  vo[key]=fn
  vo[key](...args)
  delete  vo[key]
}

// apply
function call(obj,args){
  var fn = this
  const vo = obj ? Object(obj) : window
  const key = new Symbol('l')
  vo[key]=fn
  vo[key](...args)
  delete  vo[key]
}

// bind 
function bind (obj,...args){
  const fn = this
  return function(...arr){
    fn.call(obj,...args,...arr)
  }
}
// new 操作
function newFn(fn,...args){
  const vo = {}
 vo.__proto__ = fn.prototype;
 const res= fn().call(vo,...args)
 return typeof res==='object'?res:vo
}


// 防抖
function debounce(fn,timeout){
  let timer
  return function(...args){
    const that = this
    if(timer) return clearTimeout(timer)
    timer = setTimeout(()=>{
      fn.call(that,...args)
    },timeout)
  }
}
// compose函数
function compose(...args){
  return function (){
    if(args.length===0)return
    if(args.length===1)return args[0](arguments[0]) 
    return args.slice(1).reduce((pre,cur)=>{
      return cur(pre)
    },args[0](arguments[0]))
  }
}