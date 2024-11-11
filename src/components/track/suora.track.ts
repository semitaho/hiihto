import { Orientation, Vector3 } from "@babylonjs/core";
import { ShapeTrack } from "./shape.track";
import { OrientationShape } from "./orientation.shape";

export class SuoraTrack extends ShapeTrack {
  constructor(protected jyrkkyys = 0) {
    super(jyrkkyys);
  }
  getPoints(): Vector3[] {
    const normalVectors = [
      new Vector3(0, 0, 1),
      new Vector3(0, 0, 2),
      new Vector3(0, 0, 3),
      new Vector3(0, 0, 4),
    ];

    return this.applyJyrkkyys(normalVectors);
  }
}
