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
import { PlayerMesh } from "../components/player.mesh";
import { HiihtoLights } from "../components/hiihto.lights";
class App {
  constructor() {
    // create the canvas html element and attach it to the webpage
    var canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);

    // initialize babylon scene and engine
    var engine = new Engine(canvas, true);
    var scene = new Scene(engine);
    new HiihtoLights(scene);


   
    const player = new PlayerMesh(scene);
    const moveVector1 = new Vector3(50, 1, 0);

    const track = new HiihtoTrack(scene, moveVector1);
   // const track2 = new HiihtoTrack(scene, terrain, moveVector2);


    //var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

    // hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.ctrlKey) {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show();
        }
      }
    });

    const points = track.getPoints();
    var currentIndex = 0;
    player.setLocation(new Vector3(points[currentIndex].x, points[currentIndex].y, points[currentIndex].z));

    const nextLoc = points[currentIndex + 1];
    player.lookAtDirection(nextLoc, 100);
    const camera = new HiihtoCamera(canvas, scene, player);
    const terrain = new HiihtoTerrain(scene);


    //this.drawDebugWaypoints(scene,points);
    scene.registerBeforeRender(() => {
      if (currentIndex < points.length - 1) {
        const deltaTimeMs = engine.getDeltaTime() / 1000;
        const nextLoc = points[currentIndex + 1];
        const speed = deltaTimeMs * 20;
        const rotSpeed = deltaTimeMs * 60;
        const dist = Vector3.Distance(nextLoc, player.currentLoc);
        if (dist < 1) {
          currentIndex += 1;
          if (currentIndex + 1 >= points.length) {
            currentIndex = 0;
          }
        }
        player.lookAtDirection(nextLoc, rotSpeed);
        player.moveTo(speed);
      }
    });

    // run the main render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
  }
  drawDebugWaypoints(scene: Scene, points: Vector3[]) {
    const size = 0.6;

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
    });
  }

  drawPlayerForwardVector(scene: Scene, player: PlayerMesh) {
    // Apply the player's rotation to the forward vector
   

    // Define the end point by scaling the direction vector (e.g., 5 units ahead)
    const endPoint =  player.currentLoc.add(player.getWorldDirection().scale(5));

    // Draw the line from the player's position to the end point
    const line = MeshBuilder.CreateLines(
      "forwardLine",
      {
        points: [player.currentLoc.add(Vector3.Up().scale(0.5)), endPoint.add(Vector3.Up().scale(0.5))],
        updatable: true, // Make it updatable if the player moves
      },
      scene
    );

    // Optional: Set line color for better visibility
    line.color = new Color3(1, 0, 0); // Red color
  }
}
new App();
