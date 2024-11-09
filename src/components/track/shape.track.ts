import { Vector3 } from "@babylonjs/core";
import { OrientationShape } from "./orientation.shape";

export abstract class ShapeTrack {

  constructor(protected orientation: OrientationShape, protected jyrkkyys: number) {

  }

  abstract getPoints(): Vector3[];

  protected applyJyrkkyys(changeVector: Vector3[]): Vector3[] {
    const jyrkkyysaskel = this.jyrkkyys / changeVector.length;
    return changeVector.map(
      (vector, index) =>
        new Vector3(vector.x, ((index + 1) / 2) * jyrkkyysaskel + vector.y, vector.z)
    );
  }
}
