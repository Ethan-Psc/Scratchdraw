import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import { Location, CurveObject } from '../../type/type';

let graphical: fabric.Path;

// 画曲线的两个端点
export function makeCurveCircle(
  left: number,
  top: number,
  line: fabric.Path,
  centerSpot: fabric.Circle
) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    strokeWidth: 5,
    radius: 3,
    fill: '#fff',
    stroke: '#666',
  });
  c.hasBorders = c.hasControls = false;
  (c as any).line = line;
  (c as any).centerSpot = centerSpot;
  return c;
}

// 画曲线的中间点
export function makeCurvePoint(left: number, top: number, line: fabric.Path) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    strokeWidth: 8,
    radius: 3,
    fill: '#fff',
    stroke: '#666',
  });
  c.hasBorders = c.hasControls = false;
  (c as any).line = line;
  return c;
}

// 当曲线两个端点被选中，则显示中间节点
export function onObjectSelected(
  e: IEvent<Event>,
  canvas: fabric.Canvas,
  curveArr: Array<CurveObject>
) {
  var activeObject = e.selected instanceof Array ? e.selected[0] : ({} as any);
  if (activeObject === null) {
    throw Error('object select error!');
  }
  curveArr.forEach((item) => {
    if (
      activeObject.name == item.spot0.name ||
      activeObject.name == item.spot2.name
    ) {
      activeObject.centerSpot.animate('opacity', '1', {
        duration: 200,
        onChange: canvas.renderAll.bind(canvas),
      });
      activeObject.centerSpot.selectable = true;
      item.spot0.animate('opacity', '1', {
        duration: 200,
        onChange: canvas.renderAll.bind(canvas),
      });
      item.spot0.selectable = true;
      item.spot2.animate('opacity', '1', {
        duration: 200,
        onChange: canvas.renderAll.bind(canvas),
      });
      item.spot2.selectable = true;
      // 修改该曲线的selected属性，代表它被选中了
      activeObject.line.selected = true;
    }
  });
}

// 失去焦点时隐藏曲线节点
export function onSelectionCleared(
  e: IEvent<Event>,
  canvas: fabric.Canvas,
  curveArr: Array<CurveObject>
) {
  var activeObject = (e as any).deselected[0];
  curveArr.forEach((item) => {
    if (
      activeObject.name == item.spot0.name ||
      activeObject.name == item.spot2.name ||
      activeObject.name == item.centerSpot.name
    ) {
      item.spot0.animate('opacity', '0', {
        duration: 200,
        onChange: canvas.renderAll.bind(canvas),
      });
      item.spot0.selectable = false;
      item.spot2.animate('opacity', '0', {
        duration: 200,
        onChange: canvas.renderAll.bind(canvas),
      });
      item.spot2.selectable = false;
      item.centerSpot.animate('opacity', '0', {
        duration: 200,
        onChange: canvas.renderAll.bind(canvas),
      });
      item.centerSpot.selectable = false;
      // 修改该曲线的selected属性，代表它未被选中了
      activeObject.line.selected = false;
    }
  });
}

// 改变焦点时隐藏上一个曲线节点
export function onSelectionUpdated(
  e: IEvent<Event>,
  canvas: fabric.Canvas,
  curveArr: Array<CurveObject>
) {
  if (
    (e as any).deselected &&
    e.selected &&
    (e as any).deselected[0].line != (e.selected[0] as any).line
  ) {
    onSelectionCleared(e, canvas, curveArr);
    onObjectSelected(e, canvas, curveArr);
  }
}

// 移动两端的节点对象时，改变曲线
export function onObjectMoving(e: IEvent<Event>, curveArr: Array<CurveObject>) {
  let p = e.target ? e.target : ({} as any);
  if (p === null) {
    throw new Error('e is not defined!');
  }
  curveArr.forEach((item) => {
    if (p.name == item.spot0.name) {
      p.line.path[0][1] = p.left;
      p.line.path[0][2] = p.top;
    } else if (p.name == item.spot2.name) {
      p.line.path[1][3] = p.left;
      p.line.path[1][4] = p.top;
    } else if (p.name == item.centerSpot.name) {
      if (p.line) {
        p.line.path[1][1] = p.left;
        p.line.path[1][2] = p.top;
      }
    }
  });
}

export function createCurve(
  e: IEvent<Event>,
  canvas: fabric.Canvas,
  location: Location
) {
  const newL: Location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x,
  } as Location;

  const { width, height } = {
    width: Math.abs(newL.left - location.left),
    height: Math.abs(newL.top - location.top),
  };

  canvas.remove(graphical);
  graphical = new fabric.Path('M 65 0 Q', {
    fill: '',
    stroke: 'black',
    objectCaching: false,
  });

  (graphical as any).path[0][1] = location.left;
  (graphical as any).path[0][2] = location.top;

  (graphical as any).path[1][1] = (location.left + newL.left) / 2;
  (graphical as any).path[1][2] = (location.top + newL.top) / 2;

  (graphical as any).path[1][3] = newL.left;
  (graphical as any).path[1][4] = newL.top;
  canvas.add(graphical);
}
