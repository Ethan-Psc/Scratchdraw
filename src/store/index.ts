// actions
// import { Reducer } from 'react'
// export const action = {
//     type: {
//         increment: 'counter/increment',
//         decrement: 'counter/decrement'
//     }
// }
// interface stateValue {
//     value: number
// }
// interface actionType {
//     type: 'counter/increment' | 'counter/decrement'
// }
// export const decrement: actionType = {type: 'counter/decrement'}
// export const increment: actionType = {type: 'counter/increment'}

// export const state: stateValue = {
//     value : 0
// }
// export const counterReducer = (state: any, action: actionType): stateValue => {
//     switch (action.type) {
//         case 'counter/increment':
//             return {value: state.value + 1};
//         case 'counter/decrement':
//             return {value: state.value - 1};
//         default:
//             return state;
//     }
// }
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk';
const composeHandler = applyMiddleware(thunkMiddleware);
export const methodType = {
  Circle: "Circle",
  Rect: "Rect",
  TextBox: "Textbox",
  Cursor: "Cursor",
};
export const state = {
  method: "Cursor",
};
export const imgTabReducer = (state: any, action: any) => {
  if (action.type === "changeMethod") {
    return { ...state, method: action.payload };
  } else {
    return state;
  }
};
const store = createStore(imgTabReducer,state, composeHandler);
store.subscribe(() => {
  console.log(store.getState());
});
export default store;
