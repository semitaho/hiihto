import {
  DirectionalLight,
  HemisphericLight,
  Scene,
  Vector3,
} from "@babylonjs/core";

export class HiihtoLights {
  constructor(scene: Scene) {
    //  const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
    //  hemiLight.intensity = 1; // For softer ambient lighting
    const dirLight = new DirectionalLight(
      "dirLight",
      new Vector3(-1, -2, -1),
      scene
    );
    dirLight.position = new Vector3(0, 30, 0); // Position above scene
    dirLight.intensity = 1.2;
   /*
    const hemisphericLight = new HemisphericLight(
      "ambientLight",
      new Vector3(0, 1, 0),
      scene
    );
    hemisphericLight.intensity = 0.3; // Increase brightness
    */
  }
}
