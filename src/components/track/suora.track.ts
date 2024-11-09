import { Orientation, Vector3 } from "@babylonjs/core";
import { ShapeTrack } from "./shape.track";
import { OrientationShape } from "./orientation.shape";

export class SuoraTrack extends ShapeTrack {
  constructor(
    protected orientation = OrientationShape.DEFAULT,
    protected jyrkkyys = 0
  ) {
    super(orientation, jyrkkyys);


  }
  getPoints(): Vector3[] {
    const normalVectors = [
      new Vector3(0, 0, 1),
      new Vector3(0, 0, 2),
      new Vector3(0, 0, 3),
      new Vector3(0, 0, 4),
    ];
    let changeVector = [];
    switch (this.orientation) {
      case OrientationShape.OPPOSITE:
        changeVector = normalVectors.map((normalVector) =>
          normalVector.scale(-1)
        );
        break;
      case OrientationShape.RIGHT: {
        changeVector = normalVectors.map(
          (normalVector, index) =>
            new Vector3(
              normalVector.z,
              normalVector.y,
              //     normalVector.y + kasvatus * (index + 1),
              normalVector.x
            )
        );
        break;
      }
      case OrientationShape.LEFT: {
        changeVector = normalVectors.map(
          (normalVector, index) =>
            new Vector3(
              -normalVector.z,
              normalVector.y,
              //     normalVector.y + kasvatus * (index + 1),
              normalVector.x
            ));
        
        break;
      }

      default:
        changeVector = normalVectors;
    }
    return this.applyJyrkkyys(changeVector);
  }

 
}
