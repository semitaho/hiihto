import { Mesh, MeshBuilder, Scene, Vector, Vector3 } from "@babylonjs/core";

export class LatuModel {

  private readonly URANLEVEYS = 0.3;
  private shape: Vector3[];
  constructor() {
    const reunauraWidth = 2.5;
    const reunaUra = this.createValiura(0, reunauraWidth);
    const latuUra = this.createLatuura(reunauraWidth);
    const latuuraWidth = this.calculateWidth(latuUra);
    const latuUrienVali = this.createValiura(latuuraWidth+ reunauraWidth);
    const widthVali = this.calculateWidth(latuUrienVali);
    const latuUra2 = this.createLatuura(latuuraWidth + widthVali+  reunauraWidth);
    const reunaUra2 = this.createValiura( 2* latuuraWidth + widthVali+  reunauraWidth, reunauraWidth);

    const sharepoints = [
      ...reunaUra,
      ...latuUra,
      ...latuUrienVali,
      ...latuUra2,
      ...reunaUra2


      /*
      ...this.createValiura().map(singleVector =>  
        offsetVector.add(singleVector).add(new Vector3(this.URANLEVEYS * 6, 0, 0))),
   */

    
       
    ];
    this.shape = this.centerize(sharepoints);
  }
  calculateWidth(componentVectors: Vector3[]): number {
    const xValues = componentVectors.map(point => point.x);
    const width = Math.max(...xValues) - Math.min(...xValues);
    return width;


  }
  centerize(sharepoints: Vector3[]): Vector3[] {
    const xValues = sharepoints.map(point => point.x);
    const width = Math.max(...xValues) - Math.min(...xValues);
    const center = width / 2;
    console.log('whole width:', width);

     return sharepoints.map(shapepoint => new Vector3(shapepoint.x-center,  shapepoint.y, shapepoint.z));
  }

  private createValiura(startX: number, valiuraWidth = 4): Vector3[] {
    const valiuraKorkeus = 0.3;
    return [new Vector3(0, 0, 0),
      new Vector3(0, valiuraKorkeus, 0),
      new Vector3(valiuraWidth, valiuraKorkeus, 0),
      new Vector3(valiuraWidth, 0, 0)
    ].map(vector => vector.add(new Vector3(startX,0,0)))
  }

  private createLatuura(startX = 0): Vector3[] {
    const uraHeight = 0.3;
    return [
      new Vector3(0, 0, 0),
      new Vector3(0, uraHeight, 0),
      new Vector3(this.URANLEVEYS * 2, uraHeight, 0),
      new Vector3(this.URANLEVEYS * 2, 0, 0),

      new Vector3(this.URANLEVEYS * 3, 0, 0),
      new Vector3(this.URANLEVEYS * 3, uraHeight, 0),

      new Vector3(this.URANLEVEYS * 4, uraHeight, 0),
      new Vector3(this.URANLEVEYS * 4, 0, 0),
      new Vector3(this.URANLEVEYS * 5, 0, 0),
      new Vector3(this.URANLEVEYS * 5, uraHeight, 0),
      new Vector3(this.URANLEVEYS * 6, uraHeight, 0),
      new Vector3(this.URANLEVEYS * 6, 0, 0),
    ].map(latuUra => latuUra.add(new Vector3(startX,0,0 )));
  }

  getShape(): Vector3[] {
    return this.shape;
  }
}
