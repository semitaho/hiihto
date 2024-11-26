import { Vector3 } from "@babylonjs/core";
import { SuoraTrack } from "./suora.track";

export class PitkasuoraTrack extends SuoraTrack {
  getPoints(): Vector3[] {
    const longSuoraVector = this.suoraVectors.map((suoraVector) =>
      suoraVector.scale(3)
    );
    return this.applyJyrkkyys(longSuoraVector);
  }
}
