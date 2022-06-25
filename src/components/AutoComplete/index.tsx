import React, { useState, useEffect, useRef, CSSProperties } from 'react'
import useDebounce from '../useDebounce'
import './index.css'

// props 接口
interface IProps {
  placeholder?: string,
  options: Array<any>,
  notFoundContent?: React.ReactNode,
  style?: CSSProperties,
  debounceDelay?: number,
  dropdownClassname?: string
}

/**
 * AutoComplete组件
 * @param props 
 */
export const AutoComplete: React.FC<IProps> = (props) => {

  const valueRef = useRef<null | string>(null)
  // 下拉列表是否展示
  let [isShow, setIsShow] = useState(false)
  // input中的内容
  const [value, setValue] = useState('')
  // 筛选出下拉列表中包含输入字符的部分
  const [filterOptions, setFilter] = useState<string[]>([])
  
  const {placeholder='placeholder', options, notFoundContent, style, debounceDelay=0, dropdownClassname} = props

  useEffect(()=>{
    valueRef.current = value
  }, [value])
  
  /**
   *  高亮关键字
   * @param node - 节点
   * @param pattern - 用于匹配的正则表达式
   */
  const highlightKeyword = (node:any, pattern:RegExp):  void => {
    // nodeType等于3表示是文本节点
    if (node.nodeType === 3) {
        // node.data为文本节点的文本内容
        var matchResult = node.data.match(pattern);
        // 有匹配上的话
        if (matchResult) {
            // 创建一个span节点，用来包裹住匹配到的关键词内容
            let highlightEl = document.createElement('span');
            // 不用类名来控制高亮，用自定义属性data-*来标识，
            // 比用类名更减少概率与原本内容重名，避免样式覆盖
            highlightEl.dataset.highlight = 'yes';
            // 从匹配到的初始位置开始截断到原本节点末尾，产生新的文本节点
            let matchNode = node.splitText(matchResult.index);
            // 从新的文本节点中再次截断，按照匹配到的关键词的长度开始截断，
            // 此时0-length之间的文本作为matchNode的文本内容
            matchNode.splitText(matchResult[0].length);
            // 对matchNode这个文本节点的内容（即匹配到的关键词内容）创建出一个新的文本节点出来
            let highlightTextNode = document.createTextNode(matchNode.data);
            // 插入到创建的span节点中
            highlightEl.appendChild(highlightTextNode);
            // 把原本matchNode这个节点替换成用于标记高亮的span节点
            matchNode.parentNode.replaceChild(highlightEl, matchNode);
        }
    } 
    // 如果是元素节点 且 不是script、style元素 且 不是已经标记过高亮的元素
    // 不是已经标记过高亮的元素作为条件之一的理由是，避免进入死循环，一直往里套span标签
    else if ((node.nodeType === 1)  && !(/script|style/.test(node.tagName.toLowerCase())) && (node.dataset.highlight !== 'yes')) {
        // 遍历该节点的所有子孙节点，找出文本节点进行高亮标记
        let childNodes = node.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            highlightKeyword(childNodes[i], pattern);
        }
    }
  }
  const highlight = (): void => {
    let transformString = value.replace(/[.[*?+^$|()/]|\]|\\/g, '\\$&');
    let pattern = new RegExp(transformString, 'i'); // 这里不区分大小写
    const liList = document.querySelectorAll('.li')
    for(let i=0; i<liList.length; i++) {
      highlightKeyword(liList[i], pattern)
    }
  }

  // 添加高亮效果
  useEffect(()=>{
    setTimeout(() => {
      if(filterOptions.length){
        // 高亮关键词
        highlight()
      }
    });
  }, [filterOptions])

  // 实现点击li将内容填充到input中去
  useEffect(() => {
    if(isShow) {
      const liList = document.querySelectorAll('.li')
      for(let i=0; i<liList.length; i++) {
        liList[i].addEventListener('click', ()=>{
          console.log(filterOptions[i]);
          setValue(filterOptions[i])
          setFilter([filterOptions[i]])
        })
      }
    }
  }, [isShow, filterOptions])


  // 防抖中要触发的事件
  const event = (): void => {
    console.log('event');
    setTimeout(() => {
      // 获取最新的value值
      let _value = valueRef.current
      let filterArr: Array<string> = []
      if(_value){
        setFilter([])
        options.forEach(str => {
          // 如果str以input里的值开头
          if(str.startsWith(_value)){
            filterArr.push(str)
          }
        })
        setFilter(filterArr)
        setIsShow(true)
      } else {
        setIsShow(false)
      }
    });
  }

  // focus时
  const onFocus = (): void => {
    if(value){
      // 先展示出下拉列表，再高亮
      setIsShow(true)
      setTimeout(() => {
        highlight()
      });
    }
  }
  // blur时
  const onBlur = (): void => {
    setTimeout(() => {
        setIsShow(false)
    }, 100);
  }
  // change时
  const delayEvent = useDebounce(event, debounceDelay)
  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setValue(e.currentTarget.value)
    delayEvent()
  }
  

  return (
    <div>
      <input 
        type="text" className="auto-complete" value={value}
        placeholder={placeholder} onFocus={onFocus} 
        onBlur={onBlur} onChange={onChange} style={style}
      />
      {
        isShow ? 
          (filterOptions.length>0 ? (<ul className={`dropdown ${dropdownClassname}`}>
            {
              filterOptions.map((item,index) => {
                return <li className='li' key={index}>
                  {item}
                </li>
              })
            }
          </ul>) : notFoundContent) : null
      }
    </div>
  );
}