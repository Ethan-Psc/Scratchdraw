// An highlighted block
import { useState, useEffect } from "react";
import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";
import { createCircle } from "./createMethods/circle";
import { createCurve, createImg_mouseup_curve } from "./createMethods/curve";
import { createTextbox } from "./createMethods/textbox";
import { createTrap } from "./createMethods/trap";
import { createRect } from "./createMethods/rect";

// 是否选中
var isC: boolean = false;
// 当前光标位置
var location: Location = {
  top: 0,
  left: 0,
};
// 画布上的一个图形，全局声明
var graphical: fabric.Object;
// 画布，全局声明
var canvas: fabric.Canvas;
// 位置接口

export interface Location {
  top: number | undefined;
  left: number | undefined;
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
  console.log("createImg_mousedown");
};

export const allCreateMethods: {
  [index: string]: (e: IEvent<Event>) => void;
} = {
  Rect: function (e: IEvent<Event>) {
    isC && createRect(e, canvas, graphical, location);
  },
  Circle: function (e: IEvent<Event>) {
    isC && createCircle(e, canvas, graphical, location);
  },
  Textbox: function (e: IEvent<Event>) {
    isC && createTextbox(e, canvas, graphical);
  },
  Trap: function (e: IEvent<Event>) {
    isC && createTrap(e, canvas, graphical, location);
  },
  Curve: function (e: IEvent<Event>) {
    isC && createCurve(e, canvas, graphical, location);
  },
  Cursor: function (e: IEvent<Event>) {
    isC = false;
  },
};

const createImg_mouseup: (
  e: IEvent<Event>,
  dispatch: Function,
  methodType: string
) => void = function (
  e: IEvent<Event>,
  dispatch: Function,
  methodType: string
) {
  console.log("createImg_mouseup");
  isC = false;
  const newL: Location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x,
  } as Location;
  const { width, height } = {
    width: Math.abs(newL.left - location.left),
    height: Math.abs(newL.top - location.top),
  };
  switch (methodType) {
    case "Rect":
      graphical = new fabric.Rect({
        top: location.top,
        left: location.left,
        width: newL.left - location.left,
        height: newL.top - location.top,
        fill: "red",
      });
      break;
    case "Circle":
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
      graphical = new fabric.Circle({
        top: Math.min(location.top, newL.top),
        left: Math.min(location.left, newL.left),
        fill: "red",
        ...circleData,
      });
      break;
    case "Trap":
      graphical = new fabric.Polygon([
        {
          x: (newL.left + location.left) / 2,
          y: location.top,
        },
        {
          x: newL.left,
          y: (newL.top + location.top) / 2,
        },
        {
          x: (newL.left + location.left) / 2,
          y: newL.top,
        },
        {
          x: location.left,
          y: (newL.top + location.top) / 2,
        },
      ]);
      break;
    case "Textbox":
      graphical = new fabric.Textbox("", {
        top: e.absolutePointer?.y,
        left: e.absolutePointer?.x,
        fill: "black",
      });
      break;
    case "Curve":
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
      break;
    case "Cursor":
      graphical = new fabric.Object();
  }
  dispatch({ type: "changeMethod", payload: "Cursor" });
  dispatch({ type: "addGraphical", payload: graphical });
};

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
  dispatch: Function,
  graphicals: Array<any>
) {
  canvas = canvasFun;
  // 只要花了图形，就一直监听，用来显示曲线的点
  canvas.on("mouse:move", function (e: IEvent<Event>) {
    if (e.target?.name == "p0" || e.target?.name == "p2") {
      if (!e.target?.line.selected) {
        e.target?.animate("opacity", "1", {
          duration: 200,
          onChange: canvas.renderAll.bind(canvas),
        });
        e.target.selectable = true;
      }
    }
  });
  canvas.on("mouse:out", function (e: IEvent<Event>) {
    if (e.target?.name == "p0" || e.target?.name == "p2") {
      if (!e.target?.line.selected) {
        e.target?.animate("opacity", "0", {
          duration: 200,
          onChange: canvas.renderAll.bind(canvas),
        });
        e.target.selectable = false;
      }
    }
  });
  // 同步更新
  graphicals.forEach((graphical) => {
    canvas.add(graphical);
  });
  // 动态初始化
  switch (methodType) {
    case "Rect":
      graphical = new fabric.Rect({});
      break;
    case "Circle":
      graphical = new fabric.Circle({});
      break;
    case "Trap":
      graphical = new fabric.Polygon([]);
      break;
    case "Textbox":
      graphical = new fabric.Text("");
      canvas.on("mouse:down", allCreateMethods[methodType]);
      return;
    case "Curve":
      canvas.on("mouse:down", createImg_mousedown);
      canvas.on("mouse:move", allCreateMethods[methodType]);
      canvas.on("mouse:up", (e, canvas, graphical, location) =>
        createImg_mouseup_curve(e, canvas, graphical, location)
      );
      return;
  }
  // 交互
  canvas.on("mouse:down", createImg_mousedown);
  canvas.on("mouse:move", allCreateMethods[methodType]);
  canvas.on("mouse:up", (e) => createImg_mouseup(e, dispatch, methodType));
};

export const deleteImg = function (
  canvasFun: fabric.Canvas,
  methodType: string
) {
  canvas = canvasFun;
  // 动态撤销事件
  switch (methodType) {
    case "Textbox":
      canvas.off("mouse:down", allCreateMethods[methodType]);
    case "Curve":
      canvas.off("mouse:down", createImg_mousedown);
      canvas.off("mouse:move", allCreateMethods[methodType]);
      canvas.off("mouse:up");
    default:
      canvas.off("mouse:down", createImg_mousedown);
      canvas.off("mouse:move", allCreateMethods[methodType]);
      canvas.off("mouse:up");
  }
};
