import {
  Matrix,
  Mesh,
  MeshBuilder,
  Quaternion,
  Scene,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { HiihtoTrack } from "./hiihto.track";

export class PlayerMesh {
  private _mesh: Mesh;
  private _transformNode: TransformNode;
  constructor(scene: Scene, track: HiihtoTrack) {
    this._transformNode = new TransformNode("hiihtoTransformNode", scene);
    this._transformNode.position = new Vector3(10, 0, 0); // Position of the mesh
    this._transformNode.rotation = new Vector3(0, Math.PI / 2, 0);

    this._mesh = MeshBuilder.CreateSphere("playerMesh", {}, scene);
    //this._mesh.translate(Vector3.Right(), 8);
  //  this._mesh.rotation = new Vector3(0, Math.PI / 2, 0);
    //this._mesh.position.x = track.getStartPosition()._x+ 45;
    //this._mesh.position.z = track.getStartPosition()._z;
    //this._mesh.translate(Vector3.Backward(), 5);
    //this._mesh.position.y = 1;
    this._mesh.parent = this._transformNode;

  }

  lookAtDirection(normalizedWaypointDirection: Vector3, rotationSpeed: number): void {
    const yaw = Math.atan2(
      normalizedWaypointDirection.x,
      normalizedWaypointDirection.z
    );

    // Create a quaternion from the yaw angle
    const targetQuaternion = Quaternion.RotationYawPitchRoll(yaw, 0, 0);

    // Get the current rotation quaternion, if it exists
    const currentQuaternion =  this._transformNode.rotationQuaternion || Quaternion.Identity();

    // Interpolate smoothly towards the target quaternion
    this._transformNode.rotationQuaternion = Quaternion.Slerp(currentQuaternion, targetQuaternion, rotationSpeed);


     // Interpolate smoothly towards the target quaternion
     this._transformNode.rotation.y = yaw;
  }

  moveTo(normalizedDirection: Vector3, speed: number) {
    const worldDirection = Vector3.TransformNormal(
      Vector3.Forward(),
      this._transformNode.getWorldMatrix()
    );
    this._transformNode.position.addInPlace(worldDirection.scale(speed));
  }

  setLocation(point: Vector3): void {
    this._transformNode.position = point;
  }

  get currentLoc(): Vector3 {
    return this._transformNode.position;
  }

 
  get mesh(): Mesh {
    return this._mesh;
  }
}
