import { Mesh, MeshBuilder, Scene, Vector, Vector3 } from "@babylonjs/core";

export class LatuShape {
  private shape: Vector3[];
  constructor(width: number) {
    const startVector = new Vector3(width, -0.4, 0);

    this.shape = [
    //  new Vector3(-width, 0, 0),
    //  new Vector3(width, 0, 0),
     // startVector,
      ...(this.createLatuura(width, 3).map((singleVector) =>
        startVector.add(singleVector)
      )),
    //  new Vector3(-width, 3, 0),
      // new Vector3(-width, 0, 0)
    ];

    console.log('shapre', this.shape);
  }

  private createLatuura(width: number, latuHeight: number): Vector3[] {
    const uraHeight = 0.4;
    const uranleveys = 0.5;
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
