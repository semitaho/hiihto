import {
  Color3,
  Curve3,
  MeshBuilder,
  Scene,
  Vector3,
  Mesh,
  Material,
  PBRMaterial,
  StandardMaterial,
  Path3D,
  Orientation,
} from "@babylonjs/core";
import { DynamicTerrain } from "../../external/babylon.dynamic-terrain";
import { HiihtoTerrain } from "../hiihto.terrain";
import { LatuModel  } from "../latu.model";
import { KumpuTrack } from "./kumpu.track";
import { ShapeTrack } from "./shape.track";
import { KaariTrack } from "./kaari.track";
import { SuoraTrack } from "./suora.track";
import { OrientationShape } from "./orientation.shape";

export class HiihtoTrack {
  private readonly POINTS_LENGTH_RATIO  = 1;
  private points: Vector3[];
  private spline: Curve3;
  private track: Mesh;
  constructor(scene: Scene, terrain: HiihtoTerrain, moveVector: Vector3) {
    /*
    const allPoints = [
      new Vector3(0, 1, 0),

      new Vector3(5, 1, 0),

      new Vector3(10, 1, 0),

      new Vector3(15, 1, 0),

      new Vector3(20, 1, 0),

      new Vector3(25, 1, 0),

      new Vector3(30, 1, 1),

      new Vector3(35, 1, 2),

      new Vector3(36, 1, 3),

      new Vector3(40, 1, 5),
      ...new KumpuTrack().getWorldPoints(new Vector3(40,1,10)),
      /*
      new Vector3(40, 1, 22),

      new Vector3(40, 1, 25),

      new Vector3(40, 1, 30),

      new Vector3(40, 1, 35),

      new Vector3(40, 1, 40),
      new Vector3(40, 1, 45),

      new Vector3(40, 1, 50),

      new Vector3(40, 1, 55),
      new Vector3(40, 1, 60),
      new Vector3(35, 1, 60),

      new Vector3(30, 1, 60),
      new Vector3(25, 1, 60),

      new Vector3(20, 1, 60),
      new Vector3(15, 1, 60),
      new Vector3(10, 1, 60),

      new Vector3(5, 1, 60),
      new Vector3(0, 1, 60),
      new Vector3(0, 1, 55),
      new Vector3(0, 1, 50),
      new Vector3(0, 1, 45),
      new Vector3(0, 1, 40),

      new Vector3(0, 1, 35),
      new Vector3(0, 1, 30),
      new Vector3(0, 1, 25),
      new Vector3(0, 1, 20),
      new Vector3(0, 1, 15),
      new Vector3(0, 1, 10),
      new Vector3(0, 1, 5),

      new Vector3(0, 1, 1),
    ].map((current) => current.add(this.MOVE_VECTOR));

    */

   // this.points = allPoints;
    const shapes= [
  
  new SuoraTrack(),
  new KaariTrack(),
  new SuoraTrack(OrientationShape.RIGHT),
  new SuoraTrack(OrientationShape.RIGHT),
  new SuoraTrack(OrientationShape.RIGHT),
  new SuoraTrack(OrientationShape.RIGHT),
  new SuoraTrack(OrientationShape.RIGHT),
  new SuoraTrack(OrientationShape.RIGHT, 1),
  new SuoraTrack(OrientationShape.RIGHT, 2),
  new SuoraTrack(OrientationShape.RIGHT, 1),

  new SuoraTrack(OrientationShape.RIGHT),
  new KaariTrack(OrientationShape.RIGHT),
  new SuoraTrack(OrientationShape.OPPOSITE, 0.5),
  new SuoraTrack(OrientationShape.OPPOSITE, 0.5),
  new SuoraTrack(OrientationShape.BOTTOM, 0.5),

    
    ];
    let currentMoveVector = moveVector.clone();
    this.points  = shapes.flatMap((shape: ShapeTrack) => {
      const shapeRelativePoints = shape.getPoints();
      const shapeWorldPoints = shapeRelativePoints.map((current) => current.add(currentMoveVector));
      currentMoveVector = shapeWorldPoints[shapeRelativePoints.length - 1];
      return shapeWorldPoints;

    });


    // Create a Catmull-Rom spline from the points
     this.spline = Curve3.CreateCatmullRomSpline(this.points, 100); // 20 is the number of subdivisions
  

    // Get the points along the spline
    const splinePoints = this.spline.getPoints();
// new Vector3(-1.8, -0.4, 0)
    this.track = MeshBuilder.ExtrudeShape("track", {
      cap: Mesh.NO_CAP,
      shape: new LatuModel().getShape(),
      path: splinePoints,
      rotation: 0,
      sideOrientation: Mesh.DOUBLESIDE,
      updatable: true,
      closeShape: false,
      adjustFrame: true,
      scale: 1,
      //closePath: true,
    });
    this.track.material = this.createHiihtoTrackMaterial(scene);

    this.track.convertToFlatShadedMesh();
  }
  createHiihtoTrackMaterial(scene: Scene): Material {
    const material = new StandardMaterial("latumaterial", scene);

    material.roughness = 0.9;
    material.diffuseColor = Color3.White();

    //material.specularColor = Color3.White();
    return material;
  }

  getPoints(): Vector3[] { 
    const nth = 50;
    return this.spline.getPoints()
    .filter((_, index) => index % nth  === nth - 1)
    .map(vector => new Vector3(vector.x, vector.y+0.3, vector.z));
  }

  getStartPosition(): Vector3 {
    return this.points[0];
  }
}
