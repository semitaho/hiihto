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
  Matrix,
  Quaternion,
  TransformNode,
} from "@babylonjs/core";
import { HiihtoTerrain } from "../hiihto.terrain";
import { LatuModel } from "../models/latu.model";
import { ShapeTrack } from "./shape.track";
import { KaariTrack } from "./kaari.track";
import { SuoraTrack } from "./suora.track";
import { OrientationShape } from "./orientation.shape";
import snowDiffuse from "./../../assets/textures/snow_02_diff_2k.jpg";
import snowAo from "./../..//assets/textures/snow_02_ao_2k.jpg";
import snowBump from "./../..//assets/textures/snow_02_bump_2k.jpg";
import armTextureJpg from "./../..//assets/textures/snow_02_arm_2k.jpg";
import { PitkasuoraTrack } from "./pitkasuora.track";

export class HiihtoTrack {
  private readonly POINTS_LENGTH_RATIO = 1;
  private points: Vector3[];
  private spline: Curve3;
  private track: Mesh;
  private texturePath = './../..//assets/textures/';
  constructor(scene: Scene, moveVector: Vector3) {
    const shapes = [
      new SuoraTrack(),
      new SuoraTrack(),
      //new SuoraTrack(),

      new KaariTrack(OrientationShape.DEFAULT, Math.PI / 4),

      new SuoraTrack(),
      new SuoraTrack(1),
      new SuoraTrack(2),
      new SuoraTrack(2),
      new SuoraTrack(3),
      new SuoraTrack(-1),
      new KaariTrack(OrientationShape.OPPOSITE, Math.PI / 4),
      new SuoraTrack(),
      new SuoraTrack(),
      new SuoraTrack(1),
      new SuoraTrack(),
      new SuoraTrack(),
      new KaariTrack(OrientationShape.DEFAULT, Math.PI / 4),
      new SuoraTrack(),
      new SuoraTrack(2),
      new SuoraTrack(1),
      new SuoraTrack(1),
      new KaariTrack(OrientationShape.DEFAULT, Math.PI / 5),
      new SuoraTrack(),
      new SuoraTrack(0.5),
      new SuoraTrack(0.5),
      new PitkasuoraTrack(),
      new PitkasuoraTrack(),
      new SuoraTrack(),
      new KaariTrack(),
      new SuoraTrack(),
      new SuoraTrack(),
      new SuoraTrack(),
      new SuoraTrack(-0.5),

      new SuoraTrack(0.5),
      new SuoraTrack(0.5),
      new SuoraTrack(0.5),
      new KaariTrack(OrientationShape.OPPOSITE, Math.PI / 2),
      new SuoraTrack(),
      new SuoraTrack(-1),
      new SuoraTrack(-1),
      new SuoraTrack(-1),
      new KaariTrack(OrientationShape.OPPOSITE, Math.PI / 4, -1),
      new KaariTrack(OrientationShape.DEFAULT, Math.PI / 3, -1),
      new KaariTrack(OrientationShape.DEFAULT, Math.PI / 4, -1),
      new SuoraTrack(1),
      new SuoraTrack(3),
      new SuoraTrack(3),
      new PitkasuoraTrack(2),
      new SuoraTrack(2),
      new KaariTrack(OrientationShape.DEFAULT, Math.PI / 3, 1),
      new SuoraTrack(1),
      new SuoraTrack(1),
      new PitkasuoraTrack(),
      new SuoraTrack(-1),
      new SuoraTrack(-2),
      new SuoraTrack(-1),
      new KaariTrack(),
      new SuoraTrack(-1),
      new SuoraTrack(-1),
      new SuoraTrack(-2),
      new SuoraTrack(-2),
      new SuoraTrack(-3),
      new SuoraTrack(-3),
      new SuoraTrack(-3),
      new SuoraTrack(-3),
      new SuoraTrack(-2),
      new SuoraTrack(),

      new KaariTrack(OrientationShape.OPPOSITE, Math.PI / 3),
      new SuoraTrack(),
      new SuoraTrack(),

      new SuoraTrack(1),
      new SuoraTrack(2),
      new SuoraTrack(2),
      new KaariTrack(),
      new SuoraTrack(),
    ];
    let currentMoveOffset: Vector3 = moveVector.clone();

    let directionVector = currentMoveOffset;

    this.points = shapes.flatMap((shape: ShapeTrack, index: number) => {
      const shapeRelativePoints = shape.getPoints();
      const rotationQuaternion = Quaternion.FromUnitVectorsToRef(
        Vector3.Forward(),
        directionVector,
        new Quaternion()
      );

      const shapeWorldPoints = shapeRelativePoints.map((current, index) => {
        const rotationVector = current.rotateByQuaternionToRef(
          rotationQuaternion,
          new Vector3()
        );
        return currentMoveOffset.add(rotationVector);
      });

      currentMoveOffset = shapeWorldPoints[shapeWorldPoints.length - 1];
      directionVector = shapeWorldPoints[shapeWorldPoints.length - 1]
        .subtract(shapeWorldPoints[shapeWorldPoints.length - 2])
        .normalize();

      directionVector.y = 0;

      return shapeWorldPoints;
    });

    // Create a Catmull-Rom spline from the points
    this.spline = Curve3.CreateCatmullRomSpline(this.points, 100, false); // 20 is the number of subdivisions

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
      closeShape: true,
      adjustFrame: true,
      scale: 1,
      closePath: false,
    });
    this.track.material = this.createHiihtoTrackMaterial(scene);
    this.track.receiveShadows = true;
    this.track.renderingGroupId = 1;

    this.track.convertToFlatShadedMesh();
  }
  createHiihtoTrackMaterial(scene: Scene): Material {
    const material = new StandardMaterial("latumaterial", scene);
    material.diffuseTexture = this.createDiffuseTexture(scene); // this.createDiffuseTexture(scene);
    material.ambientTexture = this.createAmbientTexture(scene);
    this.createArmTexture(scene); //material.bumpTexture = this.createBumpTexture(scene);
    material.emissiveColor = new Color3(0.2, 0.2, 0.2); // Adjust to control additional lightness

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
    texture.name = "S<nowAmbientTexture";
    texture.level = 1.2;
    return texture;
  }

  getWaypointPoints(): Vector3[] {
    const nth = 150;
    return this.spline
      .getPoints()
      .filter((_, index) => index % nth === nth - 1)
      .map((vector) => new Vector3(vector.x, vector.y + 0.3, vector.z));
  }

  getPoints(): Vector3[] {
    return this.spline.getPoints();
  }

  getStartPosition(): Vector3 {
    return this.points[0];
  }
}
