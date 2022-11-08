// An highlighted block
import { useState, useEffect } from "react";
import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";
import { useSelector, useDispatch } from "react-redux";
import store from "../store";
import { getMethodType } from "../components/basic/imgTab/index";
// 是否选中
let isC: boolean = false;
// 当前光标位置
let location: Location = {
  top: 0,
  left: 0,
};
// 是否选中
// let method = store.getState().method;
// 画布上的一个图形，全局声明
let graphical: fabric.Object;
// 画布，全局声明
let canvas: fabric.Canvas;
// const method = useSelector((method) => state.method);
export const methodType = {
  Circle: "Circle",
  Rect: "Rect",
  TextBox: "Textbox",
  Cursor: "Cursor",
};
function makeCurveCircle(left, top, line1, line2, line3) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    strokeWidth: 5,
    radius: 3,
    fill: "#fff",
    stroke: "#666",
  });
  c.hasBorders = c.hasControls = false;

  c.line = line;
  c.centerSpot = centerSpot;

  return c;
}

// 画曲线的中间点
function makeCurvePoint(left: number, top: number, line: fabric.Path) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    strokeWidth: 8,
    radius: 3,
    fill: "#fff",
    stroke: "#666",
  });
  c.hasBorders = c.hasControls = false;
  c.line = line;

  return c;
}

// 记录点击按下时的坐标，准备画图
const createImg_mousedown: (e: IEvent<Event>) => void = function (
  e: IEvent<Event>
) {
  isC = true;
  location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x,
  };
  console.log('createImg_mousedown');
};

// 当曲线两个端点被选中，则显示中间节点
function onObjectSelected(e: IEvent<Event>) {
  var activeObject = e.selected instanceof Array ? e.selected[0] : null;
  if (activeObject === null) {
    throw Error("object select error!");
  }
  if (activeObject.name == "p0" || activeObject.name == "p2") {
    activeObject.centerSpot.animate("opacity", "1", {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.centerSpot.selectable = true;
    activeObject.animate("opacity", "1", {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.selectable = true;
    //之后用对象数组的形式存储每条曲线，三个节点，所以数组的结构写好后，下面这里要补充显示另外一个曲线端点的代码
    // 修改该曲线的selected属性，代表它被选中了
    activeObject.line.selected = true;
  }
}

// 失去焦点时隐藏曲线节点
function onSelectionCleared(e: IEvent<Event>) {
  var activeObject = e.deselected[0];
  if (activeObject.name) {
    activeObject.animate("opacity", "0", {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.selectable = false;
    // 修改该曲线的selected属性，代表它被失去焦点了
    activeObject.line.selected = false;
  }
  if (activeObject.name == "p0" || activeObject.name == "p2") {
    activeObject.centerSpot.animate("opacity", "0", {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.centerSpot.selectable = false;
  }
}

// 移动两端的节点对象时，改变曲线
function onObjectMoving(e: IEvent<Event>) {
  let p = e.target ? e.target : null;
  if (p === null) {
    throw new Error("e is not defined!");
  }
  if (p.name == "p0") {
    p.line.path[0][1] = p.left;
    p.line.path[0][2] = p.top;
  } else if (p.name == "p2") {
    p.line.path[1][3] = p.left;
    p.line.path[1][4] = p.top;
  } else if (p.name == "p1") {
    if (p.line) {
      p.line.path[1][1] = p.left;
      p.line.path[1][2] = p.top;
    }
  }
}

const allCreateMethods: {
  [index: string]: (e: IEvent<Event>) => void;
} = {
  Rect: function (e: IEvent<Event>) {
    if (isC) {
      const newL: Location = {
        top: e.absolutePointer?.y,
        left: e.absolutePointer?.x,
      } as Location;
      console.log('~~~~~~~')
      canvas.remove(graphical);
      graphical = new fabric.Rect({
        top: location.top,
        left: location.left,
        width: newL.left - location.left,
        height: newL.top - location.top,
        fill: "red",
      });
      canvas.add(graphical);
    }
  },
  Circle: function (e: IEvent<Event>) {
    if (isC) {
      const newL: Location = {
        top: e.absolutePointer?.y,
        left: e.absolutePointer?.x,
      } as Location;
      const { width, height } = {
        width: Math.abs(newL.left - location.left),
        height: Math.abs(newL.top - location.top),
      };
      let circleData;
      if (width > height) {
        circleData = {
          radius: height / 2,
          scaleX: width / height,
        };
      } else {
        circleData = {
          radius: width / 2,
          scaleY: height / width,
        };
      }
      canvas.remove(graphical);
      graphical = new fabric.Circle({
        top: Math.min(location.top, newL.top),
        left: Math.min(location.left, newL.left),
        fill: "red",
        ...circleData,
      });
      canvas.add(graphical);
    }
  },
  Textbox: function (e: IEvent<Event>) {
    graphical = new fabric.Textbox("", {
      top: e.absolutePointer?.y,
      left: e.absolutePointer?.x,
      fill: "black",
    });
    canvas.add(graphical);
    canvas.off("mouse:down", allCreateMethods["Textbox"]);
    // 动态修改内容
    // (graphical as fabric.Textbox).text = '1';
    // 设置oninput后就无法显示内容？？
    // (graphical as fabric.Textbox).onInput = function(e: IEvent<Event>){
    //     console.log(e.data);
    // }
  },
  Trap: function(e: IEvent<Event>) {

  },
  Curve: function (e: IEvent<Event>) {
    if (isC) {
      const newL: Location = {
        top: e.absolutePointer?.y,
        left: e.absolutePointer?.x,
      } as Location;

      const { width, height } = {
        width: Math.abs(newL.left - location.left),
        height: Math.abs(newL.top - location.top),
      };

      canvas.remove(graphical);
      graphical = new fabric.Path("M 65 0 Q", {
        fill: "",
        stroke: "black",
        objectCaching: false,
      });

      graphical.path[0][1] = location.left;
      graphical.path[0][2] = location.top + height / 2;

      graphical.path[1][1] = (location.left + newL.left) / 2;
      graphical.path[1][2] = (location.top + newL.top) / 2;

      graphical.path[1][3] = newL.left;
      graphical.path[1][4] = newL.top - height / 2;
      canvas.add(graphical);
    }
  },
};

const createImg_mouseup: (e: IEvent<Event>, dispatch: Function) => void =
  function (e: IEvent<Event>, dispatch: Function) {
    console.log('createImg_mouseup')
    isC = false;
    dispatch({ type: "changeMethod", payload: "Cursor" });
  };

const createImg_mouseup_curve: (e: IEvent<Event>) => void = function (
  e: IEvent<Event>
) {
  const newL: Location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x,
  } as Location;
  const { width, height } = {
    width: Math.abs(newL.left - location.left),
    height: Math.abs(newL.top - location.top),
  };
  isC = false;

  fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";
  var p1 = makeCurvePoint(
    (location.left + newL.left) / 2,
    (location.top + newL.top) / 2,
    graphical
  );
  p1.name = "p1";
  canvas.add(p1);

  var p0 = makeCurveCircle(
    location.left,
    location.top + height / 2,
    graphical,
    p1
  );
  p0.name = "p0";
  canvas.add(p0);

  var p2 = makeCurveCircle(newL.left, newL.top - height / 2, graphical, p1);
  p2.name = "p2";
  canvas.add(p2);
  canvas.on("selection:created", onObjectSelected);
  canvas.on("object:moving", onObjectMoving);
  canvas.on("selection:cleared", onSelectionCleared);
};

export interface Location {
  top: number | undefined;
  left: number | undefined;
}
export const useWindowSize = () => {
  // 第一步：声明能够体现视口大小变化的状态
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // 第二步：通过生命周期 Hook 声明回调的绑定和解绑逻辑
  useEffect(() => {
    const updateSize = () =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return windowSize;
};

export const createImg = function (
  canvasFun: fabric.Canvas,
  methodType: string,
  dispatch: Function
) {
  canvas = canvasFun;
  // 只要花了图形，就一直监听，用来显示曲线的点
  // canvas.on("mouse:move", function (e: IEvent<Event>) {
  //   if (e.target?.name == "p0" || e.target?.name == "p2") {
  //     if (!e.target?.line.selected) {
  //       e.target?.animate("opacity", "1", {
  //         duration: 200,
  //         onChange: canvas.renderAll.bind(canvas),
  //       });
  //       e.target.selectable = true;
  //     }
  //   }
  // });
  // canvas.on("mouse:out", function (e: IEvent<Event>) {
  //   if (e.target?.name == "p0" || e.target?.name == "p2") {
  //     if (!e.target?.line.selected) {
  //       e.target?.animate("opacity", "0", {
  //         duration: 200,
  //         onChange: canvas.renderAll.bind(canvas),
  //       });
  //       e.target.selectable = false;
  //     }
  //   }
  // });
  // 动态初始化
  switch (methodType) {
    case "Rect":
      graphical = new fabric.Rect({});
      break;
    case "Circle":
      graphical = new fabric.Circle({});
      break;
    case "Textbox":
      graphical = new fabric.Text("");
      canvas.on("mouse:down", allCreateMethods[methodType]);
      return;
    case "Curve":
      canvas.on("mouse:down", createImg_mousedown);
      canvas.on("mouse:move", allCreateMethods[methodType]);
      canvas.on("mouse:up", createImg_mouseup_curve);
      return;
  }
  // 交互
  canvas.on("mouse:down", createImg_mousedown);
  canvas.on("mouse:move", allCreateMethods[methodType]);
  canvas.on("mouse:up", (e) => createImg_mouseup(e, dispatch));
};

export const deleteImg = function (
  canvasFun: fabric.Canvas,
  methodType: string,
  dispatch: Function
) {
  canvas = canvasFun;
  // 动态撤销事件
  switch (methodType) {
    case "Textbox":
      canvas.off("mouse:down", allCreateMethods[methodType]);
    case "Curve":
      canvas.off("mouse:down", createImg_mousedown);
      canvas.off("mouse:move", allCreateMethods[methodType]);
      canvas.off("mouse:up", createImg_mouseup_curve);
    default:
      canvas.off("mouse:down", createImg_mousedown);
      canvas.off("mouse:move", allCreateMethods[methodType]);
      canvas.off("mouse:up", (e) => createImg_mouseup(e, dispatch));
  }
};
