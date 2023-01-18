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
