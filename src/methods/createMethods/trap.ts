import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import { Location } from '../index';
export function createTrap(
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
  const pointArr = [
    {
      x: (newL.left + location.left) / 2,
      y: location.top,
    },
    {
      x: newL.left,
      y: (newL.top + location.top) / 2,
    },
    {
      x: (newL.left + location.left) / 2,
      y: newL.top,
    },
    {
      x: location.left,
      y: (newL.top + location.top) / 2,
    },
  ];
  graphical = new fabric.Polygon(pointArr);
  canvas.add(graphical);
}
