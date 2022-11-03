// An highlighted block
import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import { useSelector } from 'react-redux';
import store from '../store';
// 是否选中
let isC: boolean = false;  
// 当前光标位置
let location: Location = {
  top: 0,
  left: 0
};
// 是否选中
let method = store.getState().method;
// 画布上的一个图形，全局声明
let graphical: fabric.Object;
// 画布，全局声明
let canvas: fabric.Canvas;
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
    fill: '#fff',
    stroke: '#666'
  });
  c.hasBorders = c.hasControls = false;

  c.line1 = line1;
  c.line2 = line2;
  c.line3 = line3;

  return c;
}

function makeCurvePoint(left, top, line1, line2, line3) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    strokeWidth: 8,
    radius: 3,
    fill: '#fff',
    stroke: '#666'
  });
  c.hasBorders = c.hasControls = false;

  c.line1 = line1;
  c.line2 = line2;
  c.line3 = line3;

  return c;
}

const createImg_mousedown: (e: IEvent<MouseEvent>) => void = function (e) {
  isC = true;
  location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x
  }
    console.log(store.getState().method);
};

function onObjectSelected(e) {
  var activeObject = e.selected[0];
  if (activeObject.name == "p0" || activeObject.name == "p2") {
    activeObject.line2.animate('opacity', '1', {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.line2.selectable = true;
  }
}

function onSelectionCleared(e) {
  var activeObject = e.deselected[0];
  if (activeObject.name == "p0" || activeObject.name == "p2") {
    activeObject.line2.animate('opacity', '0', {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.line2.selectable = false;
  } else if (activeObject.name == "p1") {
    activeObject.animate('opacity', '0', {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.selectable = false;
  }
}

function onObjectMoving(e) {
  if (e.target.name == "p0" || e.target.name == "p2") {
    var p = e.target;

    if (p.line1) {
      p.line1.path[0][1] = p.left;
      p.line1.path[0][2] = p.top;
    } else if (p.line3) {
      p.line3.path[1][3] = p.left;
      p.line3.path[1][4] = p.top;
    }
  } else if (e.target.name == "p1") {
    var p = e.target;

    if (p.line2) {
      p.line2.path[1][1] = p.left;
      p.line2.path[1][2] = p.top;
    }
  } else if (e.target.name == "p0" || e.target.name == "p2") {
    var p = e.target;

    p.line1 && p.line1.set({
      'x2': p.left,
      'y2': p.top
    });
    p.line2 && p.line2.set({
      'x1': p.left,
      'y1': p.top
    });
    p.line3 && p.line3.set({
      'x1': p.left,
      'y1': p.top
    });
    p.line4 && p.line4.set({
      'x1': p.left,
      'y1': p.top
    });
  }
}

const allCreateMethods: {
  [index: string]: (e: IEvent<MouseEvent>) => void
} = {
  Rect: function (e) {
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
  Circle: function (e) {
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
  Textbox: function (e) {
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
    // (graphical as fabric.Textbox).onInput = function(e){
    //     console.log(e.data);
    // }
  },
  Curve: function (e) {
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
      graphical.path[0][2] = location.top+height/2;

      graphical.path[1][1] = (location.left+newL.left)/2;
      graphical.path[1][2] = (location.top+newL.top)/2;

      graphical.path[1][3] = newL.left;
      graphical.path[1][4] = newL.top-height/2;
      graphical.lockRotation = true;
      graphical.selectable = true;
      canvas.add(graphical);
    }
  }
}

const createImg_mouseup: (e: IEvent<MouseEvent>) => void = function (e) {
  isC = false;
}

const createImg_mouseup_curve: (e: IEvent<MouseEvent>) => void = function(e){
  const newL: Location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x
  } as Location;
  const { width, height } = {
    width: Math.abs(newL.left - location.left),
    height: Math.abs(newL.top - location.top),
  }
  fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
  var p1 = makeCurvePoint((location.left+newL.left)/2, (location.top+newL.top)/2, null, graphical, null)
  p1.name = "p1";
  canvas.add(p1);

  var p0 = makeCurveCircle(location.left, location.top+height/2, graphical, p1, null);
  p0.name = "p0";
  canvas.add(p0);

  var p2 = makeCurveCircle( newL.left,  newL.top-height/2, null, p1, graphical);
  p2.name = "p2";
  canvas.add(p2);
  canvas.on('selection:created', onObjectSelected);
  canvas.on('object:moving', onObjectMoving);
  canvas.on('selection:cleared', onSelectionCleared);
  isC = false;
}

export interface Location {
  top: number | undefined,
  left: number | undefined
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
  // 动态初始化
  switch (methodType) {
    case 'Rect':
      graphical = new fabric.Rect({});
    case 'Circle':
      graphical = new fabric.Circle({});
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
      case 'Curve':
        canvas.off('mouse:down', createImg_mousedown);
        canvas.off('mouse:move', allCreateMethods[methodType]);
        canvas.off('mouse:up', createImg_mouseup_curve);
      default:
        canvas.off('mouse:down', createImg_mousedown);
        canvas.off('mouse:move', allCreateMethods[methodType]);
        canvas.off('mouse:up', createImg_mouseup);
    }

}
