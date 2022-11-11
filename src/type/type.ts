import { fabric } from "fabric"
export interface CurveObject{
    spot0: fabric.Circle,
    spot2: fabric.Circle,
    centerSpot: fabric.Circle
}

export interface Location {
    top: number | undefined,
    left: number | undefined
}