import { allCreateMethods } from "../index";
import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";
export function createTextbox(
  e: IEvent<Event>,
  canvas: fabric.Canvas,
  graphical: fabric.Object
) {
  graphical = new fabric.Textbox("", {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x,
    fill: "black",
  });
  canvas.add(graphical);
  canvas.off("mouse:down", allCreateMethods["Textbox"]);
  // 动态修改内容
  // (graphical as fabric.Textbox).text = '1';
  // 设置oninput后就无法显示内容？？
  // (graphical as fabric.Textbox).onInput = function(e: IEvent<Event>){
  //     console.log(e.data);
  // }
}
