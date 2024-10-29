import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, Vector3, HemisphericLight, Mesh, MeshBuilder, SpotLight, Color3 } from "@babylonjs/core";
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
        const mesh = new PlayerMesh(scene, track);

        camera.setCameraTarget(mesh);

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


        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}
new App();