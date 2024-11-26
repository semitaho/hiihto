import { Scene } from "@babylonjs/core";
import { DynamicTerrain } from "../external/babylon.dynamic-terrain";
import { HiihtoTrack } from "./track/hiihto.track";

export class HiihtoTerrain {


  private readonly width: number = 1000;
  private readonly depth: number = 800;

  private terrainData: DynamicTerrain;
  constructor(scene: Scene) {
    
    const terrainSub = 100; // 100 terrain subdivisions
    const params = {
      mapData: this.createMapData(this.width, this.depth), // data map declaration: what data to use?
      mapSubX: this.width, // how are these data stored by rows and columns
      mapSubZ: this.depth,
      terrainSub: terrainSub, // how many terrain subdivisions wanted
    };
     this.terrainData = new DynamicTerrain("Hiihtomaailma", params, scene);
  }

  private createMapData(mapSubX: number, mapSubZ: number): Float32Array {
    const mapData = new Float32Array(mapSubX * mapSubZ * 3); // x3 because 3 values per point: x, y, z
    for (let l = 0; l < mapSubZ; l++) {
      // loop on depth points
      for (let w = 0; w < mapSubX; w++) {
        // loop on width points
        const x = (w - mapSubX * 0.5) * 5.0; // distance inter-points = 5 on the width
        const z = (l - mapSubZ * 0.5) * 2.0; // distance inter-points = 2 on the depth
        const y =  w / (l +1) * Math.sin(l / 2) * Math.cos(w / 2) * 0.5;

        mapData[3 * (l * mapSubX + w)] = x;
        mapData[3 * (l * mapSubX + w) + 1] = y;
        mapData[3 * (l * mapSubX + w) + 2] = z;
      }
    }
    return mapData;
  }

  public update(hiihtotrack: HiihtoTrack) {

    const points = hiihtotrack.getPoints();
  
    console.log('mapdata', this.terrainData.mapData);
 
    for (let i = 0; i < points.length; i++) {
    }

    /*
    for (let yIndex = 1; yIndex < this.terrainData.mapData.length ;  yIndex = yIndex + 3) {
      this.terrainData.mapData[yIndex] = -0.3;

    }
      */


  }

  getMapDataPoint(worldPoint, terrainOrigin) {
    const mapData = this.terrainData.mapData as Float32Array;

    const mapResolutionX =4; // Number of columns
    const mapResolutionZ = mapData.length;   // Number of rows

    // Calculate cell size
    const cellSizeX = this.width / mapResolutionX;
    const cellSizeZ = this.depth / mapResolutionZ;

    // Transform world coordinates to map coordinates
    const relativeX = worldPoint.x - terrainOrigin.x;
    const relativeZ = worldPoint.z - terrainOrigin.z;

    // Find corresponding map indices
    const mapX = Math.floor(relativeX / cellSizeX);
    const mapZ = Math.floor(relativeZ / cellSizeZ);

    // Ensure indices are within bounds
    const clampedX = Math.max(0, Math.min(mapX, mapResolutionX - 1));
    const clampedZ = Math.max(0, Math.min(mapZ, mapResolutionZ - 1));

    // Get the corresponding map data height
    const height = mapData[clampedZ][clampedX];

    return { mapX: clampedX, mapZ: clampedZ, height };
}
}
