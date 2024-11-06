import { Scene } from "@babylonjs/core";
import { DynamicTerrain } from "../external/babylon.dynamic-terrain";

export class HiihtoTerrain {
  constructor(scene: Scene) {
    const mapSubX = 1000; // map number of points on the width
    const mapSubZ = 800;
    const terrainSub = 100; // 100 terrain subdivisions
    const params = {
      mapData: this.createMapData(mapSubX, mapSubZ), // data map declaration: what data to use?
      mapSubX: mapSubX, // how are these data stored by rows and columns
      mapSubZ: mapSubZ,
      terrainSub: terrainSub, // how many terrain subdivisions wanted
    };
    const terrain = new DynamicTerrain("t", params, scene);
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
}
