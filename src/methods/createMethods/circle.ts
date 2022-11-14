import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";
import { Location } from "..";

export function createCircle(
  e: IEvent<Event>,
  canvas: fabric.Canvas,
  graphical: fabric.Object
) {
  const newL: Location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x,
  } as Location;
  const { width, height } = {
    width: Math.abs(newL.left - location.left),
    height: Math.abs(newL.top - location.top),
  };
  let circleData;
  if (width > height) {
    circleData = {
      radius: height / 2,
      scaleX: width / height,
    };
  } else {
    circleData = {
      radius: width / 2,
      scaleY: height / width,
    };
  }
  canvas.remove(graphical);
  graphical = new fabric.Circle({
    top: Math.min(location.top, newL.top),
    left: Math.min(location.left, newL.left),
    fill: "red",
    ...circleData,
  });
  canvas.add(graphical);
}
