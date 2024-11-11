import { Curve3, Quaternion, Vector3 } from "@babylonjs/core";
import { ShapeTrack } from "./shape.track";
import { OrientationShape } from "./orientation.shape";

export class KaariTrack extends ShapeTrack {
  constructor(
    protected orientation = OrientationShape.DEFAULT,
    protected jyrkkyys = 0,
    private angle = Math.PI / 2
  ) {
    super( jyrkkyys);

  }

  getPoints(): Vector3[] {
    let points = [];
    const numPoints = 5;
    const radius = 5;
    const angleStep = this.angle / (numPoints - 1);

    for (let i = 1; i < numPoints; i++) {
      const angle = i * angleStep;
      const x = radius - radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      points.push(new Vector3(x, 0, z));
    }

    return this.applyJyrkkyys(points);
  }
}
