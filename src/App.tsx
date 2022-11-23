import "./App.css";
import { BasicImgShow } from "./components/basic/imgShow";
import { BasicImgTab } from './components/basic/imgTab';
import { Panel } from "./components/panel";
import store from './store/index';
import { Provider } from 'react-redux';
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BasicImgTab></BasicImgTab>
        <BasicImgShow></BasicImgShow>
        <Panel></Panel>
      </Provider>
    </div>
  );
}
export default App;