import {
  Axis,
  Bone,
  Mesh,
  MeshBuilder,
  Scene,
  TransformNode,
  Vector3,
} from "@babylonjs/core";

export class SauvaModel {

  private _transformNode: TransformNode;
  constructor(
    private scene: Scene,
    private bone: Bone,
    private character: TransformNode,
    private direction: number
  ) {
   
    const radius = 3;

    const height = 50;
    const curvedPipe = MeshBuilder.CreateCylinder("Sauva", {
      height: 50,
      diameter: radius,
      tessellation: 16,
    });
    curvedPipe.setPivotPoint(new Vector3(0, -25, 0));
    curvedPipe.renderingGroupId = 3;
    // curvedPipe.position = new Vector3(0, height-28, 0);
    this._transformNode = new TransformNode("SauvaTransformNode", this.scene);
    this._transformNode.position = new Vector3(4, height - 26, 0);
    curvedPipe.parent = this._transformNode;
    this._transformNode.attachToBone(this.bone, this.character);
    this._transformNode.addChild(curvedPipe);

    curvedPipe.position = Vector3.Zero();
    this.rotateSauva(curvedPipe, direction);
    curvedPipe.renderingGroupId = 2;
  }

  private rotateSauva(pipe: Mesh, direction: number): void {
    pipe.rotate(Axis.X, direction * Math.PI/2.5);
  //  pipe.rotate(Axis.Z, Math.PI / 4);


  }
}
