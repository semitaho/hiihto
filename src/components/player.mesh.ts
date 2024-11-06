import {
  Axis,
  Matrix,
  Mesh,
  MeshBuilder,
  Quaternion,
  Scene,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { HiihtoTrack } from "./track/hiihto.track";

export class PlayerMesh {
  private _mesh: Mesh;
  private _transformNode: TransformNode;
  constructor(scene: Scene, track: HiihtoTrack) {
    this._transformNode = new TransformNode("hiihtoTransformNode", scene);
    this._transformNode.position = new Vector3(6, 0, 0); // Position of the mesh
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

  lookAtDirection(
    targetPosition: Vector3,
    rotationSpeed: number
  ): void {
    const targetDirection = targetPosition
      .subtract(this.currentLoc)
      .normalize();

  
    const targetRotationQuaternion = Quaternion.FromLookDirectionRH(targetDirection, this._transformNode.up);


    this._transformNode.rotationQuaternion = targetRotationQuaternion;
    Quaternion.SlerpToRef(
      this.currentRot || Quaternion.Identity(),
      targetRotationQuaternion,
      rotationSpeed,
      this._transformNode.rotationQuaternion
    );

    /*
    if (
      Quaternion.Dot(this._transformNode.rotationQuaternion, targetRotation) < 0
    ) {
      // Negate targetRotation for the shortest path
      targetRotation = targetRotation.negate();
    }
    //    this._transformNode.lookAt(targetPosition);

    this._transformNode.rotationQuaternion = targetRotation;
   
    Quaternion.Slerp(
      this._transformNode.rotationQuaternion,
      targetRotation,
      rotationSpeed
    );

    */
    // Interpolate smoothly towards the target quaternion
    // this._transformNode.rotation.y = yaw;
  }

  getWorldDirection(): Vector3 {
    return Vector3.TransformNormal(
      Vector3.Forward(),
      this._transformNode.getWorldMatrix()
    );
  }

  moveTo(speed: number) {
    this.currentLoc.addInPlace(this.currentForward.scale(speed));
  }

  setLocation(point: Vector3): void {
    this._transformNode.position = point;
  }

  get currentLoc(): Vector3 {
    return this._transformNode.position;
  }

  get currentForward(): Vector3 {
    return this._transformNode.forward;
  }

  get currentRot(): Quaternion {
    return this._transformNode.rotationQuaternion;
  }

  set currentRot(rotation: Quaternion) {
    this._transformNode.rotationQuaternion = rotation;
  }

  get mesh(): Mesh {
    return this._mesh;
  }
}
