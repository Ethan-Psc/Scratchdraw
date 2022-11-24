import React, { useEffect, useRef, useState, forwardRef } from "react";
import "./index.css";
import { hsvtorgb } from '../../../methods/index';
import { Button } from 'antd'
function setHSV(Hval: number, Sval: number, Vval: number, colorTitleEl: any, colorShowEl: any, svDefsEl: any) {
    // 这里算出对应的RGB值
    let color = `rgb(${hsvtorgb(Hval, Sval, Vval).join(',')})`;
    let StopColor = `rgb(${hsvtorgb(Hval, 100, 100).join(',')})`;
    // 为在页面中的rect设置结束颜色
    let endColors = svDefsEl.querySelectorAll('.endColor');
    [...endColors].map((e: any) => e.setAttribute('stop-color', StopColor));
    colorTitleEl.innerHTML = color;
    colorShowEl.style.background = color;
}

export const BasicColorPicker = (props: any) => {
    const rectRef = useRef(null);
    const svRectRef = useRef(null);
    const slideRef = useRef(null);
    const svSlideRef = useRef(null);
    const colorTitleRef = useRef(null);
    const colorShowRef = useRef(null);
    const svDefsRef = useRef(null);
    const [isShow, setIsShow] = useState(true);
    let HFlag = false;
    let SVFlag = false;
    let Hval = 0;
    let Sval = 100;
    let Vval = 100;
    useEffect(() => {
        const rectEl = rectRef.current as any;
        const svRectEL = svRectRef.current as any;
        const slideEl = slideRef.current as any;
        const svSlideEl = svSlideRef.current as any;
        const colorTitleEl = colorTitleRef.current;
        const colorShowEl = colorShowRef.current;
        const svDefsEl = svDefsRef.current;
        rectEl.addEventListener('mousedown', () => {
            HFlag = true;
        })
        rectEl.addEventListener('mousemove', (e: any) => {
            if (HFlag) return;
            // ev.offsetY这个值为鼠标相对于源元素的Y坐标，算出滑块在元素中的定位比例
            let offsetY = e.offsetY / rectEl.height.baseVal.value;
            slideEl.style.top = e.offsetY >= rectEl.height.baseVal.value - slideEl.offsetHeight ? rectEl.height.baseVal.value - slideEl.offsetHeight + 'px' : e.offsetY + 'px';
            console.log(e.offsetY)
            // 因为H值的范围是0~360，乘以比例就可以得出一个颜色值了
            Hval = 360 * offsetY;
            setHSV(Hval, Sval, Vval, colorTitleEl, colorShowEl, svDefsEl);
        })
        rectEl.addEventListener('mouseup', () => {
            HFlag = false;

        });
        svRectEL.addEventListener('mousedown', () => {
            SVFlag = true;
        })
        svRectEL.addEventListener('mousemove', (e: any) => {
            if (!SVFlag) return;
            // 一波换算得出滑块的比例然后乘以100就是对应的SV的值了
            Sval = e.offsetX / svRectEL.width.baseVal.value * 100;
            // 透明度因为方向的问题所以就反转一下
            Vval = (1 - e.offsetY / svRectEL.height.baseVal.value) * 100;
            svSlideEl.style.left = e.offsetX >= svRectEL.width.baseVal.value - svSlideEl.offsetWidth ? svRectEL.width.baseVal.value - svSlideEl.offsetWidth + 'px' : e.offsetX + 'px';
            svSlideEl.style.top = e.offsetY >= svRectEL.height.baseVal.value - svSlideEl.offsetHeight ? svRectEL.height.baseVal.value - svSlideEl.offsetHeight + 'px' : e.offsetY + 'px';
            setHSV(Hval, Sval, Vval, colorTitleEl, colorShowEl, svDefsEl);
        })
        svSlideEl.addEventListener('mouseup', () => {
            SVFlag = false;
        })
        setHSV(Hval, Sval, Vval, colorTitleEl, colorShowEl, svDefsEl);
    }, [])
    return (
        <div className="colorPicker-wrapper" style={{ display: isShow === true ? 'block' : 'none' }}>
            <div className="HSV">
                <div className="SV">
                    <svg>
                        <defs ref={svDefsRef}>
                            <linearGradient id="gradient-black" x1="0%" y1="100%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor="#000000" stopOpacity="1"></stop>
                                <stop className="endColor" offset="100%" stopColor="#CC9A81" stopOpacity="0"></stop>
                            </linearGradient>
                            <linearGradient id="gradient-white" x1="0%" y1="100%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1"></stop>
                                <stop className="endColor" offset="100%" stopColor="#CC9A81" stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#gradient-white)"></rect>
                        <rect ref={svRectRef} x="0" y="0" width="100%" height="100%" fill="url(#gradient-black)"></rect>
                    </svg>
                    <div ref={svSlideRef} className="svSlide"></div>
                </div>

                <div className="H">
                    <svg>
                        <defs>
                            <linearGradient id="gradient-hsv" x1="0%" y1="100%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor="#FF0000" stopOpacity="1"></stop>
                                <stop offset="13%" stopColor="#FF00FF" stopOpacity="1"></stop>
                                <stop offset="25%" stopColor="#8000FF" stopOpacity="1"></stop>
                                <stop offset="38%" stopColor="#0040FF" stopOpacity="1"></stop>
                                <stop offset="50%" stopColor="#00FFFF" stopOpacity="1"></stop>
                                <stop offset="63%" stopColor="#00FF40" stopOpacity="1"></stop>
                                <stop offset="75%" stopColor="#0BED00" stopOpacity="1"></stop>
                                <stop offset="88%" stopColor="#FFFF00" stopOpacity="1"></stop>
                                <stop offset="100%" stopColor="#FF0000" stopOpacity="1"></stop>
                            </linearGradient>
                        </defs>
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#gradient-hsv)" ref={rectRef}></rect>
                    </svg>
                    <div ref={slideRef} className="slide"></div>
                </div>
            </div>
            <div className="color">
                <div ref={colorShowRef} className="show" style={{ backgroundColor: 'rgb(255, 0, 0)' }}></div>
                <h2 ref={colorTitleRef} className="title">rgb(255, 0, 0)</h2>
                <Button className="button" onClick={(e) => {
                    setIsShow(false);
                    props.clickHandler(`rgb(${hsvtorgb(Hval, Sval, Vval).join(',')})`)
                }}>确定</Button>
            </div>
        </div>
    )
}

export const ColorPicker = forwardRef((props, ref) => (
    <BasicColorPicker ref={ref}>{props.children}</BasicColorPicker>
));