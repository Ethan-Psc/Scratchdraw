import { useState } from "react";
// import {Button} from 'antd';
import "./App.css";
import { BasicImgShow } from "./components/basic/imgShow";


function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <BasicImgShow></BasicImgShow>
    </div>
  );
}

export default App;
