// An highlighted block
import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import { createCircle } from './createMethods/circle';
import {
  createCurve,
  makeCurvePoint,
  makeCurveCircle,
  onObjectSelected,
  onObjectMoving,
  onSelectionCleared,
  onSelectionUpdated,
} from './createMethods/curve';
import { createTextbox } from './createMethods/textbox';
import { createTrap } from './createMethods/trap';
import { createRect } from './createMethods/rect';
import { Location, CurveObject } from '../type/type';

// 是否选中
let isC: boolean = false;
// 当前光标位置
let location: Location = {
  top: 0,
  left: 0,
};
// 画布上的一个图形，全局声明
let graphical: fabric.Object;
// 画布，全局声明
let canvas: fabric.Canvas;
// 曲线队列
let curveArr: Array<CurveObject> = [];

// 记录点击按下时的坐标，准备画图
const createImg_mousedown: (e: IEvent<Event>) => void = function (
  e: IEvent<Event>
) {
  isC = true;
  location = {
    top: e.absolutePointer?.y as number,
    left: e.absolutePointer?.x as number,
  };
  console.log('createImg_mousedown');
};

export const allCreateMethods: {
  [index: string]: (e: IEvent<Event>) => void;
} = {
  Rect: function (e: IEvent<Event>) {
    isC && createRect(e, canvas, location);
  },
  Circle: function (e: IEvent<Event>) {
    isC && createCircle(e, canvas, location);
  },
  Trap: function (e: IEvent<Event>) {
    isC && createTrap(e, canvas, location);
  },
  Textbox: function (e: IEvent<Event>) {
    createTextbox(e, canvas);
  },
  Curve: function (e: IEvent<Event>) {
    isC && createCurve(e, canvas, location);
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
  console.log('createImg_mouseup');
  isC = false;
  const newL: Location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x,
  } as Location;
  const { width, height } = {
    width: Math.abs((newL as any).left - (location as any).left),
    height: Math.abs((newL as any).top - (location as any).top),
  };
  switch (methodType) {
    case 'Rect':
      graphical = new fabric.Rect({
        top: location.top,
        left: location.left,
        width: ((newL.left as number) - (location as any).left) as number,
        height: ((newL.top as number) - (location as any).top) as number,
        fill: 'red',
      });
      break;
    case 'Circle':
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
        top: Math.min((location as any).top, newL.top as number),
        left: Math.min((location as any).left, newL.left as number),
        fill: 'red',
        ...circleData,
      });
      break;
    case 'Trap':
      graphical = new fabric.Polygon([
        {
          x: ((newL as any).left + location.left) / 2,
          y: location.top as number,
        },
        {
          x: newL.left as number,
          y: ((newL as any).top + location.top) / 2,
        },
        {
          x: ((newL as any).left + location.left) / 2,
          y: newL.top as number,
        },
        {
          x: location.left as number,
          y: ((newL as any).top + location.top) / 2,
        },
      ]);
      break;
    case 'Textbox':
      console.log('textbox mouseup');
      graphical = new fabric.Textbox('', {
        top: e.absolutePointer?.y,
        left: e.absolutePointer?.x,
        fill: 'black',
      });
      break;
    case 'Curve':
      console.log('curve mouseup');
      graphical = new fabric.Path('M 65 0 Q', {
        fill: '',
        stroke: 'black',
        objectCaching: false,
      });
      (graphical as any).path[0][1] = location.left;
      (graphical as any).path[0][2] = (location.top as number) + height / 2;
      (graphical as any).path[1][1] =
        (((location.left as number) + (newL as any).left) as number) / 2;
      (graphical as any).path[1][2] =
        (((location.top as number) + (newL as any).top) as number) / 2;
      (graphical as any).path[1][3] = newL.left;
      (graphical as any).path[1][4] = (newL as any).top - height / 2;
      break;
    case 'Cursor':
      graphical = new fabric.Object();
      break;
  }
  dispatch({ type: 'changeMethod', payload: 'Cursor' });
  dispatch({ type: 'addGraphical', payload: graphical });
};

const createImg_mouseup_curve: (
  e: IEvent<Event>,
  canvas: fabric.Canvas,
  location: Location,
  curveArr: Array<CurveObject>,
  dispatch: Function
) => void = function (
  e: IEvent<Event>,
  canvas: fabric.Canvas,
  location: Location,
  curveArr: Array<CurveObject>,
  dispatch: Function
) {
  const newL: Location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x,
  } as Location;
  const { width, height } = {
    width: Math.abs(newL.left - (location as any).left),
    height: Math.abs(newL.top - (location as any).top),
  };
  isC = false;
  graphical = new fabric.Path('M 65 0 Q', {
    fill: '',
    stroke: 'black',
    objectCaching: false,
  });

  (graphical as any).path[0][1] = location.left;
  (graphical as any).path[0][2] = location.top;

  (graphical as any).path[1][1] = (location.left + newL.left) / 2;
  (graphical as any).path[1][2] = (location.top + newL.top) / 2;

  (graphical as any).path[1][3] = newL.left;
  (graphical as any).path[1][4] = newL.top ;
  canvas.add(graphical);
  fabric.Path.prototype.originX = fabric.Path.prototype.originY = 'center';
  var p1 = makeCurvePoint(
    (location.left + newL.left) / 2,
    (location.top + newL.top) / 2,
    graphical as fabric.Path
  );
  p1.name = Number(new Date()) + '_p1';
  canvas.add(p1);

  var p0 = makeCurveCircle(
    location.left,
    location.top ,
    graphical as fabric.Path,
    p1
  );
  p0.name = Number(new Date()) + '_p0';

  canvas.add(p0);

  var p2 = makeCurveCircle(
    newL.left,
    newL.top,
    graphical as fabric.Path,
    p1
  );
  p2.name = Number(new Date()) + '_p2';
  canvas.add(p2);

  curveArr.push({ spot0: p0, spot2: p2, centerSpot: p1 });
  // 最终确定曲线
  (graphical as any).selected = true;
  canvas.add(graphical);
  dispatch({ type: 'addGraphical', payload: graphical });
  dispatch({ type: 'addGraphical', payload: p0 });
  dispatch({ type: 'addGraphical', payload: p1 });
  dispatch({ type: 'addGraphical', payload: p2 });
  console.log('dispatch curve');
  graphical = new fabric.Path('');
  canvas.on('selection:created', (e) => onObjectSelected(e, canvas, curveArr));
  canvas.on('object:moving', (e) => onObjectMoving(e, curveArr));
  canvas.on('selection:cleared', (e) =>
    onSelectionCleared(e, canvas, curveArr)
  );
  canvas.on('selection:updated', (e) =>
    onSelectionUpdated(e, canvas, curveArr)
  );
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
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
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
  // canvas.on('mouse:move', function (e: IEvent<Event>) {
  //   if (e.target?.name == 'p0' || e.target?.name == 'p2') {
  //     if (!(e.target as any).line.selected) {
  //       e.target?.animate('opacity', '1', {
  //         duration: 200,
  //         onChange: canvas.renderAll.bind(canvas),
  //       });
  //       e.target.selectable = true;
  //     }
  //   }
  // });
  // canvas.on('mouse:out', function (e: IEvent<Event>) {
  //   if (e.target?.name == 'p0' || e.target?.name == 'p2') {
  //     if (!(e.target as any).line.selected) {
  //       e.target?.animate('opacity', '0', {
  //         duration: 200,
  //         onChange: canvas.renderAll.bind(canvas),
  //       });
  //       e.target.selectable = false;
  //     }
  //   }
  // });
  // 同步更新
  console.log('update', graphicals);
  graphicals.forEach((graphical) => {
    canvas.add(graphical);
  });
  // 动态初始化
  switch (methodType) {
    case 'Rect':
      graphical = new fabric.Rect({});
      break;
    case 'Circle':
      graphical = new fabric.Circle({});
      break;
    case 'Trap':
      graphical = new fabric.Polygon([]);
      break;
    case 'Textbox':
      graphical = new fabric.Text('');
      canvas.on('mouse:down', allCreateMethods[methodType]);
      return;
    case 'Curve':
      canvas.on('mouse:down', createImg_mousedown);
      canvas.on('mouse:move', allCreateMethods[methodType]);
      canvas.on('mouse:up', (e) =>
        createImg_mouseup_curve(e, canvas, location, curveArr, dispatch)
      );
      return;
  }
  // 交互
  canvas.on('mouse:down', createImg_mousedown);
  canvas.on('mouse:move', allCreateMethods[methodType]);
  canvas.on('mouse:up', (e) => createImg_mouseup(e, dispatch, methodType));
};

export const deleteImg = function (
  canvasFun: fabric.Canvas,
  methodType: string
) {
  canvas = canvasFun;
  // 动态撤销事件
  switch (methodType) {
    case 'Textbox':
      canvas.off('mouse:down', allCreateMethods[methodType]);
    case 'Curve':
      canvas.off('mouse:down', createImg_mousedown);
      canvas.off('mouse:move', allCreateMethods[methodType]);
      canvas.off('mouse:up');
    default:
      canvas.off('mouse:down', createImg_mousedown);
      canvas.off('mouse:move', allCreateMethods[methodType]);
      canvas.off('mouse:up');
  }
};
