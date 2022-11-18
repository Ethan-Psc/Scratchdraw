import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
let graphical: fabric.Object;
export function createTextbox(e: IEvent<Event>, canvas: fabric.Canvas) {
  graphical = new fabric.Textbox('', {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x,
    fill: 'black',
  });
  console.log(graphical);
  canvas.add(graphical);
  console.log(canvas);
  canvas.off('mouse:down');
  console.log(canvas);
  // 动态修改内容
  // (graphical as fabric.Textbox).text = '1';
  // 设置oninput后就无法显示内容？？
  // (graphical as fabric.Textbox).onInput = function(e: IEvent<Event>){
  //     console.log(e.data);
  // }
}
