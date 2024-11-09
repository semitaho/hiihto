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
  SubMesh,
  NodeMaterial,
  Texture,
} from "@babylonjs/core";
import { HiihtoTerrain } from "../hiihto.terrain";
import { LatuModel } from "../latu.model";
import { KumpuTrack } from "./kumpu.track";
import { ShapeTrack } from "./shape.track";
import { KaariTrack } from "./kaari.track";
import { SuoraTrack } from "./suora.track";
import { OrientationShape } from "./orientation.shape";
import snowDiffuse from "./../../textures/snow_02_diff_2k.jpg";
import snowAo from "./../../textures/snow_02_ao_2k.jpg";
import snowBump from "./../../textures/snow_02_bump_2k.jpg";
import armTextureJpg from './../../textures/snow_02_arm_2k.jpg';

console.log("snow", snowDiffuse);
export class HiihtoTrack {
  private readonly POINTS_LENGTH_RATIO = 1;
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


      new Vector3(20, 1, 60),
      new Vector3(15, 1, 60),
      new Vector3(10, 1, 60),

      new Vector3(5, 1, 60),
      new

    */

    // this.points = allPoints;
    const shapes = [
      new SuoraTrack(),
      new SuoraTrack(),
      new SuoraTrack(),
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
      new SuoraTrack(OrientationShape.OPPOSITE, 1),
      new KaariTrack(OrientationShape.TOP_BOTTOM_RIGHT),
      new SuoraTrack(OrientationShape.RIGHT, 1),
      new SuoraTrack(OrientationShape.RIGHT, 1),
      new SuoraTrack(OrientationShape.RIGHT, 1),
      new SuoraTrack(OrientationShape.RIGHT, 1),
      new SuoraTrack(OrientationShape.RIGHT, 1),
      new SuoraTrack(OrientationShape.RIGHT, 1),
      new SuoraTrack(OrientationShape.RIGHT, 1),
      new SuoraTrack(OrientationShape.RIGHT, 1),
      new SuoraTrack(OrientationShape.RIGHT, 1),
      new SuoraTrack(OrientationShape.RIGHT, 1),
      new KaariTrack(OrientationShape.LEFT_BOTTOM_TOP),
      new SuoraTrack(),
      new SuoraTrack(),
      new SuoraTrack(),
      new SuoraTrack(),
      new SuoraTrack(),
      new SuoraTrack(),
      new SuoraTrack(),
      new SuoraTrack(),
      new SuoraTrack(),
      new SuoraTrack(),
      new KaariTrack(OrientationShape.BOTTOM_TOP_LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new SuoraTrack(OrientationShape.LEFT),
      new KaariTrack(OrientationShape.RIGHT_TOP_BOTTOM),





      // new SuoraTrack(OrientationShape.BOTTOM, 0.5),
     // new SuoraTrack(OrientationShape.BOTTOM, 1),
     // new SuoraTrack(OrientationShape.BOTTOM, 1),

    ];
    let currentMoveVector = moveVector.clone();
    this.points = shapes.flatMap((shape: ShapeTrack) => {
      const shapeRelativePoints = shape.getPoints();
      const shapeWorldPoints = shapeRelativePoints.map((current) =>
        current.add(currentMoveVector)
      );
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
    this.track.subMeshes.push();

    this.track.convertToFlatShadedMesh();
  }
  createHiihtoTrackMaterial(scene: Scene): Material {
    const material = new StandardMaterial("latumaterial", scene);
    material.diffuseTexture = this.createDiffuseTexture(scene); // this.createDiffuseTexture(scene);
    material.ambientTexture = this.createAmbientTexture(scene);
    this.createArmTexture(scene)
;    //material.bumpTexture = this.createBumpTexture(scene);
    material.emissiveColor = new Color3(0.2, 0.2, 0.2);  // Adjust to control additional lightness

    return material;
  }

  createDiffuseTexture(scene: Scene): Texture {
    const texture = new Texture(snowDiffuse, scene);
    texture.name = "SnowDiffuseTexture";
    texture.level = 2.3;
    texture.scale(0.3);
    return texture;
  }

  createArmTexture(scene: Scene): Texture {
    const armTexture = new Texture(armTextureJpg, scene);
    armTexture.name = "SnowArmTexture";
    return armTexture;

  }

  createBumpTexture(scene: Scene): Texture {
    const texture = new Texture(snowBump, scene);
    texture.name = "SnowBumpTexture";
    return texture;
  }

  createAmbientTexture(scene: Scene): Texture {
    const texture = new Texture(snowAo, scene);
    texture.name = "SnowAmbientTexture";
    return texture;
  }

  getPoints(): Vector3[] {
    const nth = 100;
    return this.spline
      .getPoints()
      .filter((_, index) => index % nth === nth - 1)
      .map((vector) => new Vector3(vector.x, vector.y + 0.3, vector.z));
  }

  getStartPosition(): Vector3 {
    return this.points[0];
  }
}
