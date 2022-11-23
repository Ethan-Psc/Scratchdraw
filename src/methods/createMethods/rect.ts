import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import { Location } from '../../type/type';
let graphical: fabric.Object;
export function createRect(
  e: IEvent<Event>,
  canvas: fabric.Canvas,
  location: Location
) {
  console.log('createImg mousemove');
  const newL: Location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x,
  } as Location;
  console.log(graphical);
  canvas.remove(graphical);
  graphical = new fabric.Rect({
    top: location.top,
    left: location.left,
    width: newL.left - location.left,
    height: newL.top - location.top,
    fill: 'black',
  });
  console.log(graphical);
  canvas.add(graphical);
}
