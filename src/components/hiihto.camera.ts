import {
  ArcRotateCamera,
  Camera,
  FollowCamera,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { PlayerModel } from "./models/player.model";

export class HiihtoCamera {
  private camera: FollowCamera;

  constructor(canvas: HTMLCanvasElement, scene: Scene, player: PlayerModel) {
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

  setCameraTarget(mesh: PlayerModel) {
    this.camera.lockedTarget = mesh.mesh;
  }
}
