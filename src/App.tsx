import { useState } from "react";
// import {Button} from 'antd';
import "./App.css";
import { BasicImgShow } from "./components/basic/imgShow";
import { BasicImgTab } from './components/basic/imgTab';
import { UserList } from "./components/demo";
import store from './store/index';
import { Provider } from 'react-redux';
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BasicImgTab></BasicImgTab>
        <BasicImgShow></BasicImgShow>
        <UserList></UserList>
      </Provider>
    </div>
  );
}

export default App;
