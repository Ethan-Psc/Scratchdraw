import React, { useRef, useState } from "react";
import "./index.css";
import { BasicColorPicker } from "../basic/colorPicker";
function changeHandler(colors: any) {
    console.log(colors);
}

function closeHandler(colors: any) {
    console.log(colors);
}
function handleColorPicker(e: any, colorPickerRef: any) {
    const displayValue = colorPickerRef.current.style.display;
    colorPickerRef.current.style.display = displayValue === 'none' ? 'block' : 'none';
}
export const Island = () => {
    const [svgValue, setSvgValue] = useState('');
    const colorPickerRef = useRef(null);
    return (
        <div className="island">
            <div className="island-list_horizonal">
                <div className="icon">
                    <i className='iconfont icon-shanchu'></i>
                </div>
                <div className="icon-list horizon">
                    <div className="icon">
                        <i className='iconfont icon-wenjianjia'></i>
                    </div>
                    <div className="icon">
                        <i className='iconfont icon-daimawenjian'></i>
                    </div>
                    <div className="icon">
                        <i className='iconfont icon-tupianwenjian'></i>
                    </div>
                </div>
                <div className="icon">
                    <i className='iconfont icon-hezuo'></i>
                </div>
            </div>
            <div className="island-list_horizonal seperation">
                <div className="color-picker" onClick={(e) => handleColorPicker(e, colorPickerRef)}>
                    <svg className="svg"></svg>
                    <div className="svgValue">{svgValue}</div>
                </div>
                <div className="colorPicker" >
                    <BasicColorPicker clickHandler={handleColorPicker} style={{ display: 'block' }} ref={colorPickerRef}></BasicColorPicker>
                </div>
                <div className="theme-chooser icon">
                    <i className="iconfont icon-rijianmoshi"></i>
                </div>
            </div>
        </div>
    )
}