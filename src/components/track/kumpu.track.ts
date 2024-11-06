import { Vector3 } from "@babylonjs/core";
import { ShapeTrack } from "./shape.track";

export class KumpuTrack implements ShapeTrack {
  constructor() {}
  getPoints(): Vector3[] {
    return [
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 1),
      new Vector3(0, 0.1, 1.5),
      new Vector3(0, 0.25, 2),
      new Vector3(0, 0.4, 2.5),
      new Vector3(0, 0.5, 3),
      new Vector3(0, 0.6, 3.5),
      new Vector3(0, 0.7, 4),
      new Vector3(0, 0.8, 4.5),
      new Vector3(0, 0.9, 5),
      new Vector3(0, 1, 5.5),
      new Vector3(0, 1, 6),
      new Vector3(0, 1, 6.5),
      new Vector3(0, 1, 7),
    //  new Vector3(0, 0.6, 7.3),
   //   new Vector3(0, 0.5, 7.5),
   //   new Vector3(0, 0.6, 7.7),
   //   new Vector3(0, 0.4, 7.9),
   //   new Vector3(0, 0.2, 8.5),
   //   new Vector3(0, 0, 9.5),
    ];
  }

  getWorldPoints(startPoint: Vector3): Vector3[] {
    return this.getPoints().map((relativePoint) =>
      startPoint.add(relativePoint)
    );
  }
}
