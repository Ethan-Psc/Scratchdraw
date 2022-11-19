import React, { useContext, useEffect, useRef, useState, memo } from 'react';
import { useSelector } from 'react-redux';
import { fabric } from 'fabric';
import { createImg, deleteImg } from '../../../methods';
import { useDispatch } from 'react-redux';
export const BasicImgShow = () => {
  const { width, height } = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const canvasEl = useRef(null);
  const method = useSelector((state: any) => state.method);
  const graphicals = useSelector((state: any) => state.graphicals);
  const dispatch = useDispatch();
  console.log('render imgShow!')
  useEffect(() => {
    // 获得画布对象
    console.log('render imgShow!')
    const options = {};
    const canvas = new fabric.Canvas(canvasEl.current, options);
    createImg(canvas, method, dispatch, graphicals);
    // todo 三秒恢复默认状态
    // setTimeout(()=>{
    //   deleteImg(canvas, method)
    // },0)
    canvas.on('after:render', function (e) {
      // console.log(e)
    })
    // make the fabric.Canvas instance available to your app
    return () => {
      canvas.dispose();
    }

  }, [method])
  return (<canvas width={width} height={height} ref={canvasEl} />)
};
