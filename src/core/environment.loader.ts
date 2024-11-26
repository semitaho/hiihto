import { Mesh, Scene, SceneLoader, TransformNode, Vector3 } from "@babylonjs/core";

export class EnvironmentLoader {
  private readonly PATH = "assets";

  constructor(private scene: Scene) {}

  public async load() {
    await this.loadTrees();
  }

  private async loadTrees() {
    const meshLib = await SceneLoader.ImportMeshAsync(
      null,
      `./${this.PATH}/environment/`,
      "tree.babylon",
      this.scene
    );


    const mesh = meshLib.meshes[0];
    const amountOfTrees = 30;
    const trees = new TransformNode("Trees", this.scene);
    for (let index = 0; index < amountOfTrees; index++) {
      const xArea = Math.random() * 20;
      const zArea = Math.random() * 20;
      const scaling = Math.random() * 5;

      const clonedMesh = mesh.clone("tree" + index, null);
      clonedMesh.position = new Vector3(xArea, 0, zArea);
      clonedMesh.scaling = clonedMesh.scaling.scale(scaling);
      trees.addChild(clonedMesh);
    }
  }
}
