import { useRef } from 'react'

export default function useDebounce(fn:()=>void,delay:number) {

  const { current } = useRef({timer:0})

  return () => {
    if(current.timer){
      clearTimeout(current.timer)
    }
    current.timer = window.setTimeout(() => {
      fn()
    }, delay)
  }
}