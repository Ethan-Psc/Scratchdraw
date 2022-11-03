// An highlighted block
import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { MutableRefObject } from 'react';
import { CurveObject } from '../type/type';
import { IEvent } from 'fabric/fabric-impl';
import { Location } from '../type/type';
let isC = false;
let location = {};
let graphical: fabric.Object;
let canvas: fabric.Canvas;
const curveArr: Array<CurveObject> = [];

// 画曲线的两个端点
function makeCurveCircle(left:number, top:number, line:fabric.Path, centerSpot:fabric.Circle) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    strokeWidth: 5,
    radius: 3,
    fill: '#fff',
    stroke: '#666'
  });
  c.hasBorders = c.hasControls = false;

  c.line = line
  c.centerSpot = centerSpot;

  return c;
}

// 画曲线的中间点
function makeCurvePoint(left:number, top:number, line:fabric.Path) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    strokeWidth: 8,
    radius: 3,
    fill: '#fff',
    stroke: '#666'
  });
  c.hasBorders = c.hasControls = false;
  c.line = line

  return c;
}

// 记录点击按下时的坐标，准备画图
const createImg_mousedown: (e: IEvent<Event>) => void = function (e: IEvent<Event>) {
  isC = true;
  location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x
  }
};

// 当曲线两个端点被选中，则显示中间节点
function onObjectSelected(e: IEvent<Event>) {
  var activeObject =  e.selected instanceof Array?e.selected[0]:null;
  if(activeObject===null){
    throw Error('object select error!')
  }
  curveArr.forEach((item)=>{
    if (activeObject.name == item.spot0.name || activeObject.name == item.spot2.name) {
      activeObject.centerSpot.animate('opacity', '1', {
        duration: 200,
        onChange: canvas.renderAll.bind(canvas),
      });
      activeObject.centerSpot.selectable = true;
      item.spot0.animate('opacity', '1', {
        duration: 200,
        onChange: canvas.renderAll.bind(canvas),
      });
      item.spot0.selectable = true;
      item.spot2.animate('opacity', '1', {
        duration: 200,
        onChange: canvas.renderAll.bind(canvas),
      });
      item.spot2.selectable = true;
      // 修改该曲线的selected属性，代表它被选中了
      activeObject.line.selected = true;
    }
  })
  
}

// 失去焦点时隐藏曲线节点
function onSelectionCleared(e: IEvent<Event>) {
  var activeObject = e.deselected[0];
  curveArr.forEach((item)=>{
    if (activeObject.name == item.spot0.name || activeObject.name == item.spot2.name|| activeObject.name == item.centerSpot.name) {
      item.spot0.animate('opacity', '0', {
        duration: 200,
        onChange: canvas.renderAll.bind(canvas),
      });
      item.spot0.selectable = false;
      item.spot2.animate('opacity', '0', {
        duration: 200,
        onChange: canvas.renderAll.bind(canvas),
      });
      item.spot2.selectable = false;
      item.centerSpot.animate('opacity', '0', {
        duration: 200,
        onChange: canvas.renderAll.bind(canvas),
      });
      item.centerSpot.selectable = false;
      // 修改该曲线的selected属性，代表它未被选中了
      activeObject.line.selected = false;
    }
  })
}

// 改变焦点时隐藏上一个曲线节点
function onSelectionUpdated(e: IEvent<Event>) {
  if(e.deselected&&e.selected&& e.deselected[0].line!=e.selected[0].line)
  {
    onSelectionCleared(e);
  onObjectSelected(e);
  }
  
}

// 移动两端的节点对象时，改变曲线
function onObjectMoving(e: IEvent<Event>) {
  let p = e.target?e.target:null;
  if(p === null)
  {
    throw new Error('e is not defined!');
  }
  curveArr.forEach((item)=>{
    if (p.name == item.spot0.name) {
      p.line.path[0][1] = p.left;
      p.line.path[0][2] = p.top;
    }
    else if (p.name == item.spot2.name) {
      p.line.path[1][3] = p.left;
      p.line.path[1][4] = p.top;
    }
    else if (p.name == item.centerSpot.name) {
      if (p.line) {
        p.line.path[1][1] = p.left;
        p.line.path[1][2] = p.top;
      }
    }
  })
}

const allCreateMethods: {
  [index: string]: (e: IEvent<Event>) => void
} = {
  Rect: function (e: IEvent<Event>) {
    if (isC) {
      const newL: Location = {
        top: e.absolutePointer?.y,
        left: e.absolutePointer?.x
      } as Location;
      canvas.remove(graphical)
      graphical = new fabric.Rect({
        top: location.top,
        left: location.left,
        width: newL.left - location.left,
        height: newL.top - location.top,
        fill: 'red'
      })
      canvas.add(graphical)
    }
  },
  Circle: function (e: IEvent<Event>) {
    if (isC) {
      const newL: Location = {
        top: e.absolutePointer?.y,
        left: e.absolutePointer?.x
      } as Location;
      const { width, height } = {
        width: Math.abs(newL.left - location.left),
        height: Math.abs(newL.top - location.top),
      }
      let circleData;
      if (width > height) {
        circleData = {
          radius: height / 2,
          scaleX: width / height
        }
      }
      else {
        circleData = {
          radius: width / 2,
          scaleY: height / width
        }
      }
      canvas.remove(graphical)
      graphical = new fabric.Circle({
        top: Math.min(location.top, newL.top),
        left: Math.min(location.left, newL.left),
        fill: 'red',
        ...circleData
      })
      canvas.add(graphical)
    }
  },
  Textbox: function (e: IEvent<Event>) {
    graphical = new fabric.Textbox('', {
      top: e.absolutePointer?.y,
      left: e.absolutePointer?.x,
      fill: 'black'
    });
    canvas.add(graphical);
    canvas.off('mouse:down', allCreateMethods['Textbox']);
    // 动态修改内容
    // (graphical as fabric.Textbox).text = '1';
    // 设置oninput后就无法显示内容？？
    // (graphical as fabric.Textbox).onInput = function(e: IEvent<Event>){
    //     console.log(e.data);
    // }
  },
  Curve: function (e: IEvent<Event>) {
    if (isC) {
      const newL: Location = {
        top: e.absolutePointer?.y,
        left: e.absolutePointer?.x
      } as Location;

      const { width, height } = {
        width: Math.abs(newL.left - location.left),
        height: Math.abs(newL.top - location.top),
      }

      canvas.remove(graphical)
      graphical = new fabric.Path('M 65 0 Q', {
        fill: '',
        stroke: 'black',
        objectCaching: false
      });

      graphical.path[0][1] = location.left;
      graphical.path[0][2] = location.top + height / 2;

      graphical.path[1][1] = (location.left + newL.left) / 2;
      graphical.path[1][2] = (location.top + newL.top) / 2;

      graphical.path[1][3] = newL.left;
      graphical.path[1][4] = newL.top - height / 2;
      canvas.add(graphical);
    }
  }
}

const createImg_mouseup: (e: IEvent<Event>) => void = function (e: IEvent<Event>) {
  isC = false;
}

const createImg_mouseup_curve: (e: IEvent<Event>) => void = function (e: IEvent<Event>) {
  const newL: Location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x
  } as Location;
  const { width, height } = {
    width: Math.abs(newL.left - location.left),
    height: Math.abs(newL.top - location.top),
  }
  isC = false;

  fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
  var p1 = makeCurvePoint((location.left + newL.left) / 2, (location.top + newL.top) / 2, graphical)
  p1.name = Number(new Date())+'_p1';
  canvas.add(p1);

  var p0 = makeCurveCircle(location.left, location.top + height / 2, graphical, p1);
  p0.name = Number(new Date())+'_p0';

  canvas.add(p0);

  var p2 = makeCurveCircle(newL.left, newL.top - height / 2, graphical, p1);
  p2.name = Number(new Date())+'_p2';
  canvas.add(p2);

  curveArr.push({spot0:p0,spot2:p2,centerSpot:p1})
  // 最终确定曲线
  graphical.selected = true;
  canvas.add(graphical);
  graphical = new fabric.Path('')
  canvas.on('selection:created', onObjectSelected);
  canvas.on('object:moving', onObjectMoving);
  canvas.on('selection:cleared', onSelectionCleared);
  canvas.on('selection:updated',onSelectionUpdated)

}

export const useWindowSize = () => {
  // 第一步：声明能够体现视口大小变化的状态
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // 第二步：通过生命周期 Hook 声明回调的绑定和解绑逻辑
  useEffect(() => {
    const updateSize = () => setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return windowSize;
}

export const createImg = function (canvasFun: fabric.Canvas, methodType: string) {
  canvas = canvasFun;
  // 只要画了图形，就一直监听，用来显示曲线的点
  canvas.on('mouse:move', function (e: IEvent<Event>) {
    curveArr.forEach((item)=>{
      if (e.target?.name == item.spot0.name || e.target?.name == item.spot2.name) {
        if (!e.target?.line.selected) {
          e.target?.animate('opacity', '1', {
            duration: 200,
            onChange: canvas.renderAll.bind(canvas),
          });
          e.target.selectable = true;
        }
      }
    })
  });
  canvas.on('mouse:out', function (e: IEvent<Event>) {
    curveArr.forEach((item)=>{
      if (e.target?.name == item.spot0.name || e.target?.name == item.spot2.name) {
        if (!e.target?.line.selected) {
          e.target?.animate('opacity', '0', {
            duration: 200,
            onChange: canvas.renderAll.bind(canvas),
          });
          e.target.selectable = false;
        }
      }
    })
  });
  // 动态初始化
  switch (methodType) {
    case 'Rect':
      graphical = new fabric.Rect({});
      break;
    case 'Circle':
      graphical = new fabric.Circle({});
      break;
    case 'Textbox':
      graphical = new fabric.Text('');
      canvas.on('mouse:down', allCreateMethods[methodType]);
      return;
    case 'Curve':
      canvas.on('mouse:down', createImg_mousedown);
      canvas.on('mouse:move', allCreateMethods[methodType]);
      canvas.on('mouse:up', createImg_mouseup_curve);
      return;
  }
  // 交互
  canvas.on('mouse:down', createImg_mousedown);
  canvas.on('mouse:move', allCreateMethods[methodType]);
  canvas.on('mouse:up', createImg_mouseup);
}

export const deleteImg = function (canvasFun: fabric.Canvas, methodType: string) {
  canvas = canvasFun;
  // 动态撤销事件
  switch (methodType) {
    case 'Textbox':
      canvas.off('mouse:down', allCreateMethods[methodType]);
      break;
    case 'Curve':
      canvas.off('mouse:down', createImg_mousedown);
      canvas.off('mouse:move', allCreateMethods[methodType]);
      canvas.off('mouse:up', createImg_mouseup_curve);
      break;
    default:
      canvas.off('mouse:down', createImg_mousedown);
      canvas.off('mouse:move', allCreateMethods[methodType]);
      canvas.off('mouse:up', createImg_mouseup);
      break;
    }

}
