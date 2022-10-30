// An highlighted block
import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { MutableRefObject } from 'react';

let isC = false;
let location = {};
let graphical: fabric.Object;

const createRect_mousedown = function(e) {
    isC = true;
    location = {
      top:e.absolutePointer?.y,
      left:e.absolutePointer?.x
    }
};

const createRect_mousemove = function(e) {
    if(isC)
    {
      const newL: Location = {
        top:e.absolutePointer?.y,
        left:e.absolutePointer?.x
      } as Location;
      canvas.remove(graphical)
      graphical = new fabric.Rect({
        top: location.top,
        left: location.left,
        width:newL.left-location.left,
        height: newL.top-location.top ,
        fill:'white',
        borderColor:'black'
      })
      canvas.add(graphical)
    }
  }

const createRect_mouseup = function(e) {
    isC=false;
  } 

export interface Location{
    top:number|undefined,
    left:number|undefined
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

export const createImg = function(canvas:fabric.Canvas){
    // 先是矩形，后面加个字符串参数动态创建
    graphical = new fabric.Rect({});
    // 交互
    canvas.on('mouse:down', createRect_mousedown);
    canvas.on('mouse:move', function(e) {
    if(isC)
    {
        const newL: Location = {
        top:e.absolutePointer?.y,
        left:e.absolutePointer?.x
        } as Location;
        graphical = new fabric.Rect({
        top: location.top,
        left: location.left,
        width:newL.left-location.left,
        height: newL.top-location.top ,
        fill:'red',
        borderColor:'black'
        })
    }
    }
);
    canvas.on('mouse:up', function(e) {
    isC=false;
    canvas.add(graphical)
    } );
}

export const deleteImg = function(canvas:fabric.Canvas){
    canvas.off('mouse:down', createRect_mousedown);
}
