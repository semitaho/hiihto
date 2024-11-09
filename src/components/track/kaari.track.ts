import { Curve3, Quaternion, Vector3 } from "@babylonjs/core";
import { ShapeTrack } from "./shape.track";
import { OrientationShape } from "./orientation.shape";

export class KaariTrack extends ShapeTrack {
  constructor(
    protected orientation = OrientationShape.DEFAULT,
    protected jyrkkyys = 0,
    private angle = Math.PI / 2
  ) {
    super(orientation, jyrkkyys);

  }

  getPoints(): Vector3[] {
    let points = [Vector3.Zero()];
    const numPoints = 20;
    const radius = 5;
    const angleStep = this.angle / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep;
      const x = radius - radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      points.push(new Vector3(x, 0, z));
    }


    switch (this.orientation) {
      case OrientationShape.OPPOSITE:
        points = points.map((point) => new Vector3(point.z, 0, point.x));
        break;
      case OrientationShape.RIGHT:
        points = points.map(
          (point) => new Vector3(point.z, point.y, -point.x)
        );
        break;
      case OrientationShape.TOP_BOTTOM_RIGHT:
        points = points.map((point) => new Vector3(point.x, 0, -point.z));
        break;
      case OrientationShape.LEFT_BOTTOM_TOP:
        points = points.map((point) => new Vector3(point.z, 0, point.x));
        break;
      case OrientationShape.BOTTOM_TOP_LEFT:
        points = points.map((point) => new Vector3(-point.x, 0, point.z));
        break;
      case OrientationShape.RIGHT_TOP_BOTTOM:
        points = points.map(point => {
          return new Vector3(-point.z, 0, -point.x);

        });
        break;
      default:
        return points;
    }
    return this.applyJyrkkyys(points);
  }
}
