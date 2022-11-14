import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";
import { Location } from "..";
export function createRect(
  e: IEvent<Event>,
  canvas: fabric.Canvas,
  graphical: fabric.Object
) {
  const newL: Location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x,
  } as Location;
  console.log("~~~~~~~");
  canvas.remove(graphical);
  console.log(canvas.remove);
  graphical = new fabric.Rect({
    top: location.top,
    left: location.left,
    width: newL.left - location.left,
    height: newL.top - location.top,
    fill: "red",
  });
  canvas.add(graphical);
  console.log(canvas.add);
}
