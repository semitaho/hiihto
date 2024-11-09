import {
  ArcRotateCamera,
  Camera,
  FollowCamera,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { HiihtoTrack } from "./track/hiihto.track";
import { PlayerMesh } from "./player.mesh";

export class HiihtoCamera {
  private camera: FollowCamera;

  constructor(canvas: HTMLCanvasElement, scene: Scene, player: PlayerMesh) {
    this.camera = new FollowCamera(
      "HiihtoCamera",
      new Vector3(0, 10, -10),
      scene,
      player.mesh
    );
    this.camera.layerMask = 0;
    this.camera.radius = 20;

    this.camera.heightOffset = 8;
    this.camera.rotationOffset = 180;
    this.camera.cameraAcceleration = 0.03;

    this.camera.speed = 0.2;
    this.camera.attachControl(true);
    this.camera.layerMask = 1;

    //this.camera.setTarget(player.currentLoc);
  }

  setCameraTarget(mesh: PlayerMesh) {
    this.camera.lockedTarget = mesh.mesh;
  }
}
