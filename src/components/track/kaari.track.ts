import { Curve3, Quaternion, Vector3 } from "@babylonjs/core";
import { ShapeTrack } from "./shape.track";
import { OrientationShape } from "./orientation.shape";

export class KaariTrack implements ShapeTrack {


  constructor(private orientation = OrientationShape.DEFAULT, private angle = Math.PI / 2) {

  }

  getPoints(): Vector3[] {
    const points = [Vector3.Zero()];
    const numPoints = 20; 
    const radius = 5;
    const angleStep = this.angle  / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) {
        const angle =   i * angleStep;
        const x = radius -  (radius * Math.cos(angle));
        const z = radius * Math.sin(angle);
        points.push(new Vector3(x, 0, z));
    }

    if (this.orientation === OrientationShape.OPPOSITE) {
      return points.map(point => new Vector3(point.z, 0, point.x));
    }
    if (this.orientation === OrientationShape.RIGHT) {

      const rightPoints = points.map(point => 
        new Vector3(point.z, point.y, -point.x));
        console.log("riggt poits", rightPoints);
        

      return rightPoints;   
    }
    return points;
  
    
  }

}