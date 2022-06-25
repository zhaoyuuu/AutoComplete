# AutoComplete
## 1. 基本功能：
- 一个文本输入框，能够输入文字并根据所输入的文字给出对应提示
- 所提示的文字以列表形式呈现，并能选择然后填充至输入框
- 提示的文本列表中，需要将输入框中的文字高亮显示（或者醒目的`css`样式）
- 当输入匹配结果为空时，可以显示特定的内容
- 输入搜索时需要 debounce
- 能够传递style参数，方便修改input样式

## 2. 实现的apis：

| field | description | type |
| ---- | ---- | ---- |
|options 	|自动完成的数据源 |	Array<any> 
|notFoundContent |	当匹配结果为空时的内容 |	React.ReactNode 
|debounceDelay |	Debounce 延迟时间,以毫秒记| 	number 
|placeholder |	输入框的 placeholder| 	string 
|dropdownClassname |	提示下拉栏的类名 	|string 
|style|	给input框添加样式|	CSSProperties

## 3. 使用案例：
```ts
import { AutoComplete } from "./components/AutoComplete";
// 数据源
const options = ['hello','react','hooks','typescript','javascript','html','css','vue','nodejs',
  'router','echarts','sass','less','1234' ]
// 自定义notFound
function Demo(): React.ReactNode {
  return (
    <div>
      <h2>Found nothing ╥﹏╥...</h2>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <AutoComplete placeholder={`please input something`} options={options}
        notFoundContent={Demo()} style={{width: '400px'}} debounceDelay={500}
        dropdownClassname={'dropdrop'}
      />
    </div>
  );
}
```
## 4. 文章
这是我第一次接触react-hooks和ts，遇到不少坑，同时收获不少。我将文章发表在了[掘金](https://juejin.cn/post/7113103477458337800/)，如果您对具体实现感兴趣，欢迎阅读我的拙作。