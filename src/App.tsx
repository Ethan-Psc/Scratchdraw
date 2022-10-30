import { useState } from "react";
import { Router, Route, Link } from 'react-router-dom'
import {Button} from 'react-dom';
import reactLogo from "./assets/react.svg";
import "./App.css";


function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <Link to={{
        pathname: '/components/board'
      }}>
        <Button>

        </Button>
      </Link>
    </div>
  );
}

export default App;
