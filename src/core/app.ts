import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, Vector3, HemisphericLight, Mesh, MeshBuilder, SpotLight, Color3, Quaternion } from "@babylonjs/core";
import { HiihtoTerrain } from "../components/hiihto.terrain";
import { HiihtoCamera } from "../components/hiihto.camera";
import { HiihtoTrack } from "../components/hiihto.track";
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

           const camera =  new HiihtoCamera(canvas, scene);

        const terrain = new HiihtoTerrain(scene);
        const track = new HiihtoTrack(scene, terrain);
        const player = new PlayerMesh(scene, track);

        camera.setCameraTarget(player);

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
        console.log('points', points);

        player.setLocation(points[0]);
        var currentIndex = 0;
        scene.registerBeforeRender(() => {
            if (currentIndex < points.length - 1) {
                const deltaTimeMs = engine.getDeltaTime() / 1000;
                var nextLoc = points[currentIndex+1];
                const direction = nextLoc.subtract(player.currentLoc).normalize();

                const speed = deltaTimeMs * 10;
                const rotSpeed = deltaTimeMs * 10;


                var dist = Vector3.Distance(nextLoc,  player.currentLoc);
               console.log("dist: "+dist+", direction", currentIndex);
                if (dist < 1) {
                    currentIndex += 1;
                    if (currentIndex + 1 >= points.length) {
                        currentIndex = 0;
                    }
                }
                player.lookAtDirection(direction, rotSpeed);

                player.moveTo(direction, speed);

            }
          


        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}
new App();