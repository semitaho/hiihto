import { Mesh, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import { HiihtoTrack } from "./hiihto.track";

export class PlayerMesh {

  private _mesh: Mesh;
  constructor(scene: Scene, track: HiihtoTrack) {
    this._mesh = MeshBuilder.CreateSphere("playerMesh", {

    }, scene );
   this._mesh.position.x = track.getStartPosition()._x+ 45;
   this._mesh.position.z = track.getStartPosition()._z;
   this._mesh.translate(Vector3.Backward(), 5);
   this._mesh.position.y = 1;

  }

  get mesh(): Mesh {
    return this._mesh;
  }
}
