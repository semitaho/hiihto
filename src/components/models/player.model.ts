import {
  Axis,
  Bone,
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

  private readonly humanIndex = 1;
  private readonly spineIndex = 3;
  private readonly headIndex = 5;

  private readonly leftHandIndex = 32;
  private readonly leftWristIndex = 34;

  private readonly rightHandIndex = 13;
  private readonly rightWristIndex = 15;
  private readonly leftjalkajuuriIndex = 54;
  private readonly leftPolviIndex = 55;
  private readonly leftFootIndex = 57;
  private readonly rightjalkajuuriIndex = 50;
  private readonly rightPolviIndex = 51;
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
    const sauvaLeft = new SauvaModel(
      this._scene,
      skeleton.bones[this.leftWristIndex],
      this._mesh,
      -1
    );
    const sauvaRight = new SauvaModel(
      this._scene,
      skeleton.bones[this.rightWristIndex],
      this._mesh,
      1
    );
    new SuksiModel(
      this._scene,
      skeleton.bones[this.leftFootIndex],
      this._mesh,
      -1
    );
    new SuksiModel(
      this._scene,
      skeleton.bones[this.rightFootIndex],
      this._mesh,
      1
    );

    const removableAnimeIndices = [
      1,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      42,
      43,
      44,
      this.rightPolviIndex,
      this.leftPolviIndex,
      this.rightPolviIndex + 1,
      this.leftPolviIndex + 1,
    ];

    this.rotateBone(this.spineIndex, Axis.Z, Math.PI / 15);
    this.rotateBone(this.headIndex, Axis.Z, -Math.PI / 5);
    this.rotateBone(this.humanIndex, Axis.Y, Math.PI / 5);
    this.adjustHandAnimation(this.leftHandIndex);
    this.adjustHandAnimation(this.rightHandIndex);
    removableAnimeIndices.forEach((index) => {
      skeleton.bones[index].animations = [];
    });
    
    const jalkajuuriamountChange = Math.PI / 10;
    const jalkajuuriAnimatioScaleRation = 1.4;
    this.adjustAnimationRotation(this.leftjalkajuuriIndex, (rotation) => {
      rotation.x -= jalkajuuriamountChange;
      rotation.y = Math.PI;
      rotation.z *= jalkajuuriAnimatioScaleRation;
    });
    this.adjustAnimationRotation(this.rightjalkajuuriIndex, (rotation) => {
      rotation.x += jalkajuuriamountChange;
      rotation.y = Math.PI;
      rotation.z *= jalkajuuriAnimatioScaleRation;
    });


    /*
    animatable.onAnimationEnd = () => {
      console.log('konna');

      setTimeout(() => {
        console.log('konna');
        const animatable2 = this._scene.beginAnimation(skeleton, keyframeLength+1, keyframeLength*2, false, 1.5);
       
      }, 2000);
    };
    */
  }

  public playVuorohiihto(): void {
    const keyframeLength = this.getKeyframeLength(this._skeleton);
    const half = keyframeLength / 2 + 15;
    const timeout = 300;
    const animatable = this._scene.beginAnimation(
      this._skeleton,
      0,
      half,
      false,
      1.5
    );

   
    
    animatable.onAnimationEnd = () => {
      setTimeout(() => {
        const anim2 = this._scene.beginAnimation(
          this._skeleton,
           half +1 ,
          keyframeLength * 2,
          false,
          1.5
        );
        anim2.onAnimationEnd = () => {
          setTimeout(() => {
            this.playVuorohiihto();
          }, timeout);
        };
      }, timeout);
    };
    
  }

  private getKeyframeLength(skeleton: Skeleton): number {
    const bones = skeleton.bones;
    let keyframeMax = 0;
    bones.forEach((bone) => {
      bone.animations.forEach((animation) => {
        keyframeMax = Math.max(keyframeMax, animation.getKeys().length);
      });
    });
    return keyframeMax;
  }

  rotateBone(boneIndex: number, rotateAxis: Vector3, amount: number): void {
    this._skeleton.bones[boneIndex].rotate(rotateAxis, amount);
  }

  /**
   * Adjusts the hand animation by modifying the rotation angles.
   * @param handIndex - The index of the hand bone in the skeleton.
   */
  adjustHandAnimation(handIndex: number): void {

    this.adjustAnimationRotation(handIndex, (rotationAngles) => {
      rotationAngles.x +=  handIndex == this.rightHandIndex ? 0.3 : -0.3;
      rotationAngles.z *= 2.6;
    });
  }

  adjustAnimationRotation(
    animationIndex: number,
    fn: (
      rotation: Vector3,
      keyframeLength: number,
      currentKeyframeIndex: number
    ) => void
  ): void {
    const animation = this._skeleton.bones[animationIndex].animations[0];
    const keyFrames = animation.getKeys();
    keyFrames.forEach((frame, index) => {
      const matrix = frame.value as Matrix;
      const scale = new Vector3();
      const rotation = new Quaternion();
      const translation = new Vector3();
      matrix.decompose(scale, rotation, translation);
      const rotationAngles = rotation.toEulerAngles();
      fn(rotationAngles, keyFrames.length, index);
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

    targetRotationQuaternion.x = 0;
    //targetRotationQuaternion.z = 0;
    this._transformNode.rotationQuaternion = this.currentRot;
    this._transformNode.rotationQuaternion.x = 0;

    this._transformNode.rotationQuaternion = Quaternion.Slerp(
      this._transformNode.rotationQuaternion,
      targetRotationQuaternion,
      rotationSpeed
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
    if (this._transformNode.rotationQuaternion) {
      return this._transformNode.rotationQuaternion;
    }
    return Quaternion.Identity();
  }

  set currentRot(rotation: Quaternion) {
    this._transformNode.rotationQuaternion = rotation;
  }

  get mesh(): Mesh {
    return this._mesh;
  }
}
