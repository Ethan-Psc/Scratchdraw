import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import _ from "lodash";

const composeHandler = applyMiddleware(thunkMiddleware);

export const methodType = {
  Circle: "Circle",
  Rect: "Rect",
  TextBox: "Textbox",
  Cursor: "Cursor",
};

export const state = {
  method: "Cursor",
  graphicals: [],
};

export const imgTabReducer = (state: any, action: any) => {
  if (action.type === "changeMethod") {
    return { ...state, method: action.payload };
  } else if (action.type === "addGraphical") {
    const graphicals = state.graphicals;
    graphicals.push(action.payload);
    return { ...state, graphicals: graphicals };
  } else {
    return state;
  }
};

const store = createStore(imgTabReducer, state, composeHandler);

export default store;
