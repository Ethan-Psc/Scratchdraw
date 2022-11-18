import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import { Location } from '../../type/type';
let graphical: fabric.Object;
export const createImg_mouseup_curve: (
  e: IEvent<Event>,
  canvas: fabric.Canvas,
  location: Location,
  isC: boolean
) => void = function (
  e: IEvent<Event>,
  canvas: fabric.Canvas,
  location: Location,
  isC: boolean
) {
  const newL: Location = {
    top: e.absolutePointer?.y,
    left: e.absolutePointer?.x,
  } as Location;
  const { width, height } = {
    width: Math.abs(newL.left - location.left),
    height: Math.abs(newL.top - location.top),
  };
  isC = false;
  fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
  var p1 = makeCurvePoint(
    (location.left + newL.left) / 2,
    (location.top + newL.top) / 2,
    graphical
  );
  p1.name = 'p1';
  canvas.add(p1);

  var p0 = makeCurveCircle(
    location.left,
    location.top + height / 2,
    graphical,
    p1
  );
  p0.name = 'p0';
  canvas.add(p0);

  var p2 = makeCurveCircle(newL.left, newL.top - height / 2, graphical, p1);
  p2.name = 'p2';
  canvas.add(p2);
  canvas.on('selection:created', onObjectSelected);
  canvas.on('object:moving', onObjectMoving);
  canvas.on('selection:cleared', onSelectionCleared);
};

export function makeCurveCircle(left, top, line1, line2, line3) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    strokeWidth: 5,
    radius: 3,
    fill: '#fff',
    stroke: '#666',
  });
  c.hasBorders = c.hasControls = false;
  c.line = line;
  c.centerSpot = centerSpot;
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
  c.line = line;
  return c;
}

// 当曲线两个端点被选中，则显示中间节点
export function onObjectSelected(e: IEvent<Event>) {
  var activeObject = e.selected instanceof Array ? e.selected[0] : null;
  if (activeObject === null) {
    throw Error('object select error!');
  }
  if (activeObject.name == 'p0' || activeObject.name == 'p2') {
    activeObject.centerSpot.animate('opacity', '1', {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.centerSpot.selectable = true;
    activeObject.animate('opacity', '1', {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.selectable = true;
    //之后用对象数组的形式存储每条曲线，三个节点，所以数组的结构写好后，下面这里要补充显示另外一个曲线端点的代码
    // 修改该曲线的selected属性，代表它被选中了
    activeObject.line.selected = true;
  }
}

// 失去焦点时隐藏曲线节点
export function onSelectionCleared(e: IEvent<Event>) {
  var activeObject = e.deselected[0];
  if (activeObject.name) {
    activeObject.animate('opacity', '0', {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.selectable = false;
    // 修改该曲线的selected属性，代表它被失去焦点了
    activeObject.line.selected = false;
  }
  if (activeObject.name == 'p0' || activeObject.name == 'p2') {
    activeObject.centerSpot.animate('opacity', '0', {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
    });
    activeObject.centerSpot.selectable = false;
  }
}

// 移动两端的节点对象时，改变曲线+
export function onObjectMoving(e: IEvent<Event>) {
  let p = e.target ? e.target : null;
  if (p === null) {
    throw new Error('e is not defined!');
  }
  if (p.name == 'p0') {
    p.line.path[0][1] = p.left;
    p.line.path[0][2] = p.top;
  } else if (p.name == 'p2') {
    p.line.path[1][3] = p.left;
    p.line.path[1][4] = p.top;
  } else if (p.name == 'p1') {
    if (p.line) {
      p.line.path[1][1] = p.left;
      p.line.path[1][2] = p.top;
    }
  }
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

  graphical.path[0][1] = location.left;
  graphical.path[0][2] = location.top + height / 2;

  graphical.path[1][1] = (location.left + newL.left) / 2;
  graphical.path[1][2] = (location.top + newL.top) / 2;

  graphical.path[1][3] = newL.left;
  graphical.path[1][4] = newL.top - height / 2;
  canvas.add(graphical);
}
