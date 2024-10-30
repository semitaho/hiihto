import { Mesh, MeshBuilder, Scene, Vector, Vector3 } from "@babylonjs/core";

export class LatuShape {
  private shape: Vector3[];
  constructor(offsetVector: Vector3) {

    this.shape = [
      ...(this.createLatuura().map((singleVector) =>
        offsetVector.add(singleVector)
      ))
    ];

  }

  private createLatuura(): Vector3[] {
    const uraHeight = 0.3;
    const uranleveys = 0.4;
    return [
      new Vector3(0, 0, 0),
      new Vector3(0, uraHeight, 0),
      new Vector3(uranleveys*2, uraHeight, 0),
      new Vector3(uranleveys*2, 0, 0),

      
      new Vector3(uranleveys * 3, 0, 0),
      new Vector3(uranleveys * 3, uraHeight, 0),

      new Vector3(uranleveys * 4, uraHeight, 0),
      new Vector3(uranleveys * 4, 0, 0),
      new Vector3(uranleveys * 5, 0, 0),
      new Vector3(uranleveys * 5, uraHeight, 0),
      new Vector3(uranleveys * 6, uraHeight, 0),
      new Vector3(uranleveys * 6, 0, 0)


    ];
  }

  getShape(): Vector3[] {
    return this.shape;
  }
}
