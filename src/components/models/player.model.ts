import {
  Axis,
  Matrix,
  Mesh,
  MeshBuilder,
  Quaternion,
  Scene,
  SceneLoader,
  Skeleton,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { HiihtoTrack } from "./../track/hiihto.track";
import { SauvaModel } from "./sauva.model";
import { SuksiModel } from "./suksi.model";

export class PlayerModel {
  private _mesh: Mesh;
  private _skeleton: Skeleton;

  private readonly leftHandIndex = 32;
  private readonly leftWristIndex = 34;

  private readonly rightHandIndex = 13;
  private readonly rightWristIndex = 15;

  private readonly leftFootIndex = 57;
  private readonly rightFootIndex = 53;

  private _transformNode: TransformNode;
  constructor(private _scene: Scene) {
    //  this._mesh = MeshBuilder.CreateSphere("playerMesh", {}, scene);
    //this._mesh.translate(Vector3.Right(), 8);
    //  this._mesh.rotation = new Vector3(0, Math.PI / 2, 0);
    //this._mesh.position.x = track.getStartPosition()._x+ 45;
    //this._mesh.position.z = track.getStartPosition()._z;
    //this._mesh.translate(Vector3.Backward(), 5);
    //this._mesh.position.y = 1;
  }

  async init() {
    this._transformNode = new TransformNode("hiihtoTransformNode", this._scene);
    this._transformNode.position = new Vector3(6, 0, 0); // Position of the mesh
    this._transformNode.rotation = new Vector3(0, Math.PI / 2, 0);
    const {
      meshes,
      skeletons: [skeleton],
    } = await SceneLoader.ImportMeshAsync(
      null,
      `./assets/player/`,
      "player.babylon",
      this._scene
    );
    this._skeleton = skeleton;
    this._mesh = meshes[0] as Mesh;

    this._mesh.scaling = this._mesh.scaling.scale(0.05);
    this._mesh.parent = this._transformNode;
    this._mesh.renderingGroupId = 2;
    this._mesh.getChildMeshes().forEach((element) => {
      element.renderingGroupId = 2;
    });
    skeleton.bones.forEach((bone) => {
      bone.scale(1, 1, 1); // Normalize bone scaling
    });
    skeleton.computeAbsoluteMatrices();
    const sauvaLeft = new SauvaModel(this._scene, skeleton.bones[this.leftWristIndex], this._mesh, -1);
    const sauvaRight = new SauvaModel(this._scene, skeleton.bones[this.rightWristIndex], this._mesh, 1);
     new SuksiModel(this._scene, skeleton.bones[this.leftFootIndex], this._mesh, -1);
     new SuksiModel(this._scene, skeleton.bones[this.rightFootIndex], this._mesh, 1);

    const removableAnimeIndices = [
      1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22,
      23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 39, 
      42, 43, 44,
    ];

    removableAnimeIndices.forEach((index) => {
      skeleton.bones[index].animations = [];
    });
    this.adjustHandAnimation(this.leftHandIndex);
    this.adjustHandAnimation(this.rightHandIndex);
    this._scene.beginAnimation(skeleton, 0, 100, true, 1.5);
  }

  adjustHandAnimation(handIndex: number): void {
    const animation = this._skeleton.bones[handIndex].animations[0];
    const keyFrames = animation.getKeys();
    keyFrames.forEach((frame, index) => {
      const matrix = frame.value as Matrix;
      const scale = new Vector3();
      const rotation = new Quaternion();
      const translation = new Vector3();

      matrix.decompose(scale, rotation, translation);
      const rotationAngles = rotation.toEulerAngles();
      rotationAngles.z -= 0.1;
      rotationAngles.z *= 2.6;

      const newRotation = Quaternion.FromEulerAngles(
        rotationAngles.x,
        rotationAngles.y,
        rotationAngles.z
      );
      //const newRotation =rotation.multiplyInPlace(Quaternion.RotationAxis(Axis.Z,- Math.PI / 2));      
      const newMatrix = Matrix.Compose(scale, newRotation, translation);
      keyFrames[index].value = newMatrix;
    });
  }

  lookAtDirection(targetPosition: Vector3, rotationSpeed: number): void {
    const targetDirection = targetPosition
      .subtract(this.currentLoc)
      .normalize();

    const targetRotationQuaternion = Quaternion.FromLookDirectionRH(
      targetDirection,
      this._transformNode.up
    );
    // targetRotationQuaternion.z = 0;
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
