import { AutoComplete } from "./components/AutoComplete";
import './styles.css'

const options = ['hello','react','hooks','typescript','javascript','html','css','vue','nodejs',
  'router','echarts','sass','less','1234' ]

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
