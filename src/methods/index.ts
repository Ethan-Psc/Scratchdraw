// An highlighted block
import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { MutableRefObject } from 'react';
import { IEvent } from 'fabric/fabric-impl';
let isC = false;
let location = {};
let graphical: fabric.Object;
let canvas: fabric.Canvas;

const createImg_mousedown:(e: IEvent<MouseEvent>) => void = function(e) {
    isC = true;
    location = {
      top:e.absolutePointer?.y,
      left:e.absolutePointer?.x
    }
};

const allCreateMethods:{
    [index:string]:(e: IEvent<MouseEvent>) => void
} = {
    Rect:function(e){
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
            fill:'red'
          })
          canvas.add(graphical)
        }
    },
    Circle:function(e){
        if(isC)
        {
          const newL: Location = {
            top:e.absolutePointer?.y,
            left:e.absolutePointer?.x
          } as Location;
          const {width,height} = {
            width:Math.abs(newL.left-location.left),
            height: Math.abs(newL.top-location.top) ,
          }
          let circleData;
          if(width>height)
          {
            circleData = {
                radius:height/2,
                scaleX:width/height
            }
          }
          else
          {
            circleData = {
                radius:width/2,
                scaleY:height/width
            }
          }
          canvas.remove(graphical)
          graphical = new fabric.Circle({
            top: Math.min(location.top,newL.top),
            left: Math.min(location.left,newL.left),
            fill:'red',
            ...circleData
          })
          canvas.add(graphical)
        }
    },
    Path:function(e){
        if(isC)
        {
          const newL: Location = {
            top:e.absolutePointer?.y,
            left:e.absolutePointer?.x
          } as Location;
          canvas.remove(graphical)
          graphical = new fabric.Path(``)
          canvas.add(graphical)
        }
    },
    Textbox:function(e){
        console.log('textbos')
        console.log( {
            top:e.absolutePointer?.y,
            left:e.absolutePointer?.x,
            fill: 'black',
            strokeWidth: 2
        })
        graphical = new fabric.Textbox('', {
            top:e.absolutePointer?.y,
            left:e.absolutePointer?.x,
            fill: 'black',
            strokeWidth: 2
        });
        canvas.add(graphical)
    }
}
const createImg_mouseup:(e: IEvent<MouseEvent>) => void = function(e) {
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

export const createImg = function(canvasFun:fabric.Canvas,methodType: string){
    canvas = canvasFun;
    // 动态初始化
    switch(methodType)
    {
        case 'Rect':
            graphical = new fabric.Rect({});
        case 'Circle':
            graphical = new fabric.Circle({});
        case 'Textbox':
            graphical = new fabric.Text('');
            canvas.on('mouse:down', allCreateMethods[methodType]);
            return;
    } 
    // // 交互
    canvas.on('mouse:down', createImg_mousedown);
    canvas.on('mouse:move', allCreateMethods[methodType]);
    canvas.on('mouse:up', createImg_mouseup);
}

export const deleteImg = function(canvasFun:fabric.Canvas,methodType: string){
    canvas = canvasFun;
    canvas.on('mouse:down', createImg_mousedown);
    canvas.on('mouse:move', allCreateMethods[methodType]);
    canvas.on('mouse:up', createImg_mouseup);
}
