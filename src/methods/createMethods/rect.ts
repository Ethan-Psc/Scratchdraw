import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";
import { Location } from "../index";
export function createRect(
  e: IEvent<Event>,
  canvas: fabric.Canvas,
  graphical: fabric.Object,
  location: Location
) {
  const newL: Location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x,
  } as Location;
  canvas.remove(graphical);
  graphical = new fabric.Rect({
    top: location.top,
    left: location.left,
    width: newL.left - location.left,
    height: newL.top - location.top,
    fill: "red",
  });
  canvas.add(graphical);
}
