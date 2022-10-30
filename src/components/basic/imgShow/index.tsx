import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { createImg, deleteImg, useWindowSize } from '../../../methods';

export const  BasicImgShow= () => {
  const {width,height} = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const canvasEl = useRef(null);
  useEffect(()=>{
    // 获得画布对象
    const options = { };
    const canvas = new fabric.Canvas(canvasEl.current, options);
    createImg(canvas);
    setTimeout(()=>{
      deleteImg(canvas)
    },3000)
    // make the fabric.Canvas instance available to your app
    return () => {
      canvas.dispose();
    }
  },[])
 
  return (<canvas width={width} height={height} ref={canvasEl}/>)
};


