import { fabric } from "fabric"
export interface CurveObject{
    spot0: fabric.Circle,
    spot2: fabric.Circle,
    centerSpot: fabric.Circle
}

export interface Location {
    top: number,
    left: number,
}

export enum LineJoin{
    BEVEL='bevel',
    ROUND='round',
    MITER='miter'
}
export interface Graphical{
    fill:string | undefined,
    borderColor:string | undefined,
    stroke:string | undefined,
    strokeWidth:number,
    strokeDashArray:number[]|undefined,
    strokeLineJoin:LineJoin,
    strokeUniform:boolean,
    moveToFunctionIndex:number
}