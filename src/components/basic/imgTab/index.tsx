import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import "./index.css";
export const methodTypeArr = ['Cursor', 'Rect', 'Trap', 'Circle', 'Textbox']
export const BasicImgTab = () => {
    const [lock, setLock] = useState(false);
    const method = useSelector((state: any) => state.method);
    const dispatch = useDispatch();
    const ulRef = useRef(null);
    const getMethodType = (e: MouseEvent) => {
        dispatch({ type: 'changeMethod', payload: methodTypeArr[parseInt(e.target?.children[0].innerText) - 1] });
        for (let i = 0; i < ulRef.current.children.length; i++) {
            if (ulRef.current.children[i].className.includes('active') && i !== parseInt(e.target?.children[0].innerText) - 1) {
                ulRef.current.children[i].classList.remove('active')
            }
        }
        const liRef = ulRef.current.children[parseInt(e.target?.children[0].innerText) - 1];
        if (!liRef.className.includes('active')) {
            liRef.classList.add('active');
        }
        else {
            liRef.classList.remove('active');
            dispatch({ type: 'changeMethod', payload: 'Cursor' })
        }

    }
    return (
        <div className='imgTab'>
            <div className='imgTab-list'>
                <div className='left' onClick={() => {
                    console.log(lock)
                    setTimeout(() => { setLock(!lock), 0 });
                    console.log(lock)
                }}>
                    <div className='imgTab-list_lock '>
                        <i className={lock === true ? 'iconfont icon-suoding active' : 'iconfont icon-jiesuo'}></i>
                    </div>
                </div>
                <div className='middle' onClick={(e: any) => getMethodType(e)}>
                    <ul className='list' ref={ulRef}>
                        <li className='imgTab-list_cursor'>
                            <i className='iconfont icon-shubiao'><span>1</span></i>
                        </li>
                        <li className='imgTab-list_rectangle'>
                            <i className='iconfont icon-yuanjiao-rect'><span>2</span></i>

                        </li>
                        <li className='imgTab-list_trapezoid'>
                            <i className='iconfont icon-lingxing'><span>3</span></i>

                        </li>
                        <li className='imgTab-list_circle'>
                            <i className='iconfont icon-circle'><span>4</span></i>

                        </li>
                        <li className='imgTab-list_pen'>
                            <i className='iconfont icon-pen'><span>5</span></i>

                        </li>
                        <li className='imgTab-list_font'>
                            <i className='iconfont icon-ziti'><span>6</span></i>
                        </li>
                    </ul>
                </div>
                <div className='right'>
                    <div className='imgTab-list_reference'>
                        <i className='iconfont icon-book-full'></i>
                    </div>
                </div>
            </div>
        </div>
    )
}