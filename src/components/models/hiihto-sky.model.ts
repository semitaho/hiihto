import {
  Color3,
  CubeTexture,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";
import { GradientMaterial } from "@babylonjs/materials";
export class HiihtoSkyModel {
  constructor(scene: Scene) {
    this.createSkybox(scene);
    /*
    const skybox = MeshBuilder.CreateSphere(
      "skyBox",
      { segments: 32, diameter: 1000.0 },
      scene
    );
    const skyboxMaterial = new GradientMaterial("HiihtoSky", scene);
    skyboxMaterial.topColor = new Color3(0.8, 0.9, 1); // Light blue at the top
    skyboxMaterial.bottomColor = new Color3(1, 1, 1);
    skyboxMaterial.offset = 0.2;
    skyboxMaterial.scale = 2;
    skyboxMaterial.backFaceCulling = false;
    skybox.infiniteDistance = true;
    skybox.material = skyboxMaterial;
    */
  }

  private createSkybox(scene: Scene): void {
    const skybox = MeshBuilder.CreateBox("HiihtoSky", { size: 1000.0 }, scene);
    skybox.infiniteDistance = true;
    const skyboxMaterial = new StandardMaterial("HiihtoSkyMaterial", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skyboxMaterial.reflectionTexture = new CubeTexture("assets/skybox/skybox4", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skybox.renderingGroupId = 0;
  }
}
