import { Curve3, Quaternion, Vector3 } from "@babylonjs/core";
import { ShapeTrack } from "./shape.track";
import { OrientationShape } from "./orientation.shape";

export class KaariTrack extends ShapeTrack {
  constructor(
    protected orientation = OrientationShape.DEFAULT,
    private angle = Math.PI / 2,
    protected jyrkkyys = 0,

  ) {
    super( jyrkkyys);

  }
 

  getPoints(): Vector3[] {
    let points = [];
    const numPoints = 10;
    const radius = 5;
    const angleStep = this.angle / (numPoints - 1);

    for (let i = 1; i < numPoints; i++) {
      const angle = i * angleStep;
      const x = radius - radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      points.push(new Vector3(this.orientation === OrientationShape.OPPOSITE ? -x :  x, 0, z));
    }
   // points.push(new Vector3(this.orientation === OrientationShape.OPPOSITE ? lastPoint.x -0.5 : lastPoint.x + 0.5 ,lastPoint.y,lastPoint.z));

    return this.applyJyrkkyys(points);
  }
}
