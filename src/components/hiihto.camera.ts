import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";

export class HiihtoCamera {

  constructor(canvas: HTMLCanvasElement, scene: Scene) {
    var camera: ArcRotateCamera = new ArcRotateCamera("HiihtoCamera", Math.PI / 2, 0.7814, 95, new Vector3(0, 25, 0), scene);
   
    camera.attachControl(canvas, true);

  }

}