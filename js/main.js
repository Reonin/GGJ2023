import {BUTTON_ANSWER_X, BUTTON_ANSWER_Y, BUTTON_ANSWER_Z } from './Constants.js';
import setUpButtons from './buttonConfig.js';
import setUpHUD from './HUDConfig.js';
import loadAssets from './AssetLoader.js';
import changeRound from './RoundSwap.js';
export function init() {
   
    const canvas = document.getElementById("renderCanvas"); // Get the canvas element
    const engine = new BABYLON.Engine(canvas, true ,{ stencil: true }); // Generate the BABYLON 3D engine
    let advancedTexture;
    let startGameButton;
    let player1 = {};
    let player2 = {};

    const buttonList = {
        startGameButton,
        player1, 
        player2
    };

    let player1Score = {},
        player2Score= {},
        scoreLabel1 = {},
        scoreLabel2 = {},
        title = {},
        subtitle = {},
        question = {}; 


    const HUD = {
        player1Score,
        player2Score,
        scoreLabel1,
        scoreLabel2,
        title,
        subtitle,
        question
    }

    let disc;
    let textureObj;

    const createScene = async function () {
        // Creates a basic Babylon Scene object
        const scene = new BABYLON.Scene(engine);
        // Creates and positions a free camera
        const camera = new BABYLON.FreeCamera("camera1", 
            // new BABYLON.Vector3(0, 2, 0), scene);
        new BABYLON.Vector3(0, 15, 0), scene);
        // Targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
        // Creates a light, aiming 0,1,0 - to the sky
        const light = new BABYLON.HemisphericLight("light", 
            new BABYLON.Vector3(0, 1, 0), scene);
        // Dim the light a small amount - 0 to 1
        light.intensity = 0.7;
        
        //GUI
        advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
        let loadedGUI = await advancedTexture.parseFromURLAsync("./json/guiTexture.json");

        textureObj = loadAssets(BABYLON, scene);
        setUpButtons(advancedTexture, buttonList);
        setUpHUD(advancedTexture, HUD);
        // debugger;
        HUD.question.isVisible = false;
        

        // Built-in 'sphere' shape.
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", 
        {diameter: 2, segments: 32}, scene);
        // Move the sphere upward 1/2 its height
        sphere.material = textureObj.stone_texture;


        disc = BABYLON.MeshBuilder.CreateDisc("disc", {} ,  scene);
        disc.position.x = BUTTON_ANSWER_X;
        disc.position.y = BUTTON_ANSWER_Y;
        disc.position.z = BUTTON_ANSWER_Z;
        disc.id="answer1";

        disc.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        buttonList.player1.answer1.linkWithMesh(disc);
        // Built-in 'ground' shape.
        const ground = BABYLON.MeshBuilder.CreateGround("ground", 
            {width: 16, height: 12}, scene);
        
        
        // debugger;
        buttonList.startGameButton.onPointerUpObservable.add(function() {
                hideTitleScreen();
                changeRound(1);
        });

        return scene;
    };
    const PromiseScene = createScene(); //Call the createScene function that returns a promise
        PromiseScene.then(scene => {
        scene.debugLayer.show();//show debugger
        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () {
            scene.render();
            // console.log(scene.pointerX + '||' + scene.pointerY);
        });
        const hl = new BABYLON.HighlightLayer("hl1", scene);
        scene.onKeyboardObservable.add((kbInfo) => {
            if(kbInfo.type == BABYLON.KeyboardEventTypes.KEYDOWN){
                switch (kbInfo.event.key) {
                        case 'A':
                        case 'a':
                        console.log("KEY DOWN: ", kbInfo.event.key);
                        // Add the highlight layer.
                        
                        hl.addMesh(disc, BABYLON.Color3.Green());
                        HUD.player1Score.text = Number(HUD.player1Score.text) + 1;
                            break;
                        case 'S':
                        case 's':
                        console.log("KEY DOWN: ", kbInfo.event.key);
                            break;
                        case 'D':
                        case 'd':
                        console.log("KEY DOWN: ", kbInfo.event.key);
                            break;
                        case 'ArrowLeft':
                        console.log("KEY DOWN: ", kbInfo.event.key);
                            break;
                        case 'ArrowUp':
                        console.log("KEY DOWN: ", kbInfo.event.key);
                            break;
                        case 'ArrowRight':
                        console.log("KEY DOWN: ", kbInfo.event.key);
                            break;

                    }
            }
            else if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYUP){
                hl.removeMesh(disc);
            }
        });

        buttonList.player1.answer1.onPointerUpObservable.add(function(e) {
                console.log(e);
                const pick = scene.pick(e.x, e.y);
                console.log(advancedTexture.pick(e.x, e.y));
            });

    })




    const hideTitleScreen = () => {
            HUD.title.isVisible = false;
            HUD.subtitle.isVisible = false;
            
            buttonList.startGameButton.isVisible = false;

            for (const button in buttonList.player1) {
                buttonList.player1[button].isVisible = true;
            }
            for (const button in buttonList.player2) {
                buttonList.player2[button].isVisible = true;
            }
            HUD.question.isVisible = true;
        
        disc.material = textureObj.purple_mat;
    }


    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
            engine.resize();
    });
}