import { useRef, useEffect } from 'react'

export default function useDebounce(fn:()=>void,delay:number) {

  const { current } = useRef({fun:fn,timer:0})
  useEffect(() => {
    current.fun = fn
  }, [fn])
  return () => {
    if(current.timer){
      clearTimeout(current.timer)
    }
    current.timer = window.setTimeout(() => {
      current.fun()
    }, delay)
  }
}
/*
const useDebounce (fn:(args:any)=>void,dalay:number,dep [])=
const current }useRef({fun:fn,timer:0
useEffect(()=
current.fun fn
},[fn]);
return usecallback((args:any)=>{
if (current.timer){
clearTimeout(current.timer)
}
current.timer window.setTimeout(()=>
current.fun(args)
}dalay)
}dep)
}
*/