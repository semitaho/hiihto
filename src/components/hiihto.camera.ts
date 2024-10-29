import { ArcRotateCamera, Camera, FollowCamera, Scene, Vector3 } from "@babylonjs/core";
import { HiihtoTrack } from "./hiihto.track";
import { PlayerMesh } from "./player.mesh";

export class HiihtoCamera {

  private camera: FollowCamera;

  constructor(canvas: HTMLCanvasElement,  scene: Scene) {
    this.camera = new FollowCamera("HiihtoCamera", new Vector3(0, 10, -10), scene);
    this.camera.radius = 20;
    this.camera.heightOffset = 8;
    this.camera.rotationOffset = -90;

    this.camera.speed = 0.2;
    this.camera.attachControl(true);

  }

  setCameraTarget(mesh: PlayerMesh) {
    this.camera.lockedTarget = mesh.mesh;
  }

}