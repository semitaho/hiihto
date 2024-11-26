import { Axis, Bone, Mesh, MeshBuilder, Scene, TransformNode, Vector3 } from "@babylonjs/core";

export class SuksiModel {
  private _mesh: Mesh;

  constructor(
    private _scene: Scene,
    private bone: Bone,
    private character: TransformNode,
    private direction: number
  ) {
    this._mesh = MeshBuilder.CreateBox("suksi_"+direction, {
      depth: 60,
      width: 7,
      height: 2
    }, this._scene);
    const node = new TransformNode("suksiNode", this._scene);
    node.position = new Vector3(0, -3, -1 * direction);
    node.rotate(Axis.Y, direction *  (- Math.PI / 2));

    this._mesh.position = Vector3.Zero();
    this._mesh.renderingGroupId = 2;
    this._mesh.parent = node;
    node.attachToBone(this.bone, this.character);

  }
}
