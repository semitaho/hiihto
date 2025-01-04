import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  SpotLight,
  Color3,
  Quaternion,
  StandardMaterial,
} from "@babylonjs/core";
import { HiihtoTerrain } from "../components/hiihto.terrain";
import { HiihtoCamera } from "../components/hiihto.camera";
import { HiihtoTrack } from "../components/track/hiihto.track";
import { PlayerModel } from "../components/models/player.model";
import { HiihtoLights } from "../components/hiihto.lights";
import { HiihtoSkyModel } from "../components/models/hiihto-sky.model";
import { EnvironmentLoader } from "./environment.loader";
class App {
  private _scene: Scene;
  private _engine: Engine;
  private _canvas: HTMLCanvasElement;

  constructor() {
    // create the canvas html element and attach it to the webpage
    this._canvas = document.createElement("canvas");
    this._canvas.style.width = "100%";
    this._canvas.style.height = "100%";
    this._canvas.id = "gameCanvas";
    document.body.appendChild(this._canvas);

    // initialize babylon scene and engine
    this._engine = new Engine(this._canvas, true);
    this._scene = new Scene(this._engine);
  }

  get scene() {
    return this._scene;
  }

  async init() {
    new HiihtoLights(this.scene);
    new HiihtoSkyModel(this.scene);
    const player = new PlayerModel(this.scene);
    await player.init();
    const moveVector1 = new Vector3(50, 1, 0);

    const track = new HiihtoTrack(this.scene, moveVector1);
    // const track2 = new HiihtoTrack(scene, terrain, moveVector2);

    //var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

    // hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.ctrlKey) {
        if (this.scene.debugLayer.isVisible()) {
          this.scene.debugLayer.hide();
        } else {
          this.scene.debugLayer.show();
        }
      }
    });

    // hide/show the Inspector

    const points = track.getWaypointPoints();
    var currentIndex = 1;
    player.setLocation(
      new Vector3(
        points[currentIndex].x,
        points[currentIndex].y,
        points[currentIndex].z
      )
    );

    const nextLoc = points[currentIndex + 1];
    player.lookAtDirection(nextLoc, 100);
    const camera = new HiihtoCamera(this._canvas, this._scene, player);
    const terrain = new HiihtoTerrain(this._scene);
    terrain.update(track);

    let speed = 0;

    const kitkakerroin = 0.1; // Define the variable with an appropriate value
    const speedLimit = 0.5; // Define the variable with an appropriate value
    const speedInc = 0.05; // Define the variable with an appropriate value
    window.addEventListener("keyup", (ev) => {
      ev.preventDefault();
      if (ev.code === "Space") {
        speed += speedInc;
        if (speed > speedLimit) {
          speed = speedLimit;
        }
        console.log("Space key pressed");
      }
    });
    this.drawDebugWaypoints(this.scene, points);

    
    const distanceToNextWaypoint = 1;
    this.scene.registerBeforeRender(() => {
      if (currentIndex < points.length - 1) {
        const deltaTimeMs = this._engine.getDeltaTime() / 1000;
        const nextLoc = points[currentIndex + 1];
        //const speed = deltaTimeMs * 5; // 5 units per second
        const rotSpeed = deltaTimeMs * 10; // 100 degrees per second
        const dist = Vector3.Distance(nextLoc, player.currentLoc);
        console.log('dist', dist);
        if (dist  < distanceToNextWaypoint) {
          currentIndex += 1;
          if (currentIndex + 1 >= points.length) {
            currentIndex = 0;
          }
        }
        player.lookAtDirection(nextLoc, rotSpeed);
        player.moveTo(speed);
        speed -= deltaTimeMs * kitkakerroin;
        if (speed < 0) {
          speed = 0;
        }
      
      }
    });
     
    // run the main render loop
    this._engine.runRenderLoop(() => {
      this.scene.render();
    });
 
  }

  drawDebugWaypoints(scene: Scene, points: Vector3[]) {
    const size = 1;

    const material = new StandardMaterial("waypointMat", scene);
    material.diffuseColor = Color3.Red();
    points.forEach((position) => {
      const waypoint = MeshBuilder.CreateSphere(
        "waypoint",
        { diameter: size },
        scene
      );
      waypoint.position = position;
      waypoint.material = material;
      waypoint.renderingGroupId = 2; // Set the rendering group for visibility control
    });
  }

  drawPlayerForwardVector(scene: Scene, player: PlayerModel) {
    // Apply the player's rotation to the forward vector
    // Define the end point by scaling the direction vector (e.g., 5 units ahead)
    const endPoint = player.currentLoc.add(player.getWorldDirection().scale(5));

    // Draw the line from the player's position to the end point
    const line = MeshBuilder.CreateLines(
      "forwardLine",
      {
        points: [
          player.currentLoc.add(Vector3.Up().scale(0.5)),
          endPoint.add(Vector3.Up().scale(0.5)),
        ],
        updatable: true, // Make it updatable if the player moves
      },
      scene
    );

    // Optional: Set line color for better visibility
    line.color = new Color3(1, 0, 0); // Red color
  }
}
const app = new App();
await app.init();
await new EnvironmentLoader(app.scene).load();
