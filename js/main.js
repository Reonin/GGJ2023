import {BUTTON_ANSWER_X, BUTTON_ANSWER_Y, BUTTON_ANSWER_Z } from './Constants.js';
import setUpButtons from './buttonConfig.js';
import setUpHUD from './HUDConfig.js';
import loadAssets from './AssetLoader.js';
import { GameManager } from './RoundSwap.js';

// import {changeRound, checkForCorrectAnswer} from './RoundSwap.js';
export function init() {
   
    const canvas = document.getElementById("renderCanvas"); // Get the canvas element
    const engine = new BABYLON.Engine(canvas, true ,{ stencil: true }); // Generate the BABYLON 3D engine
    let advancedTexture;
    let startGameButton;
    let player1 = {};
    let player2 = {};
    let correctAnswer;
    let currentRound = 0;

    const buttonList = {
        startGameButton,
    };

    let player1Score = {},
        player2Score= {},
        scoreLabel1 = {},
        scoreLabel2 = {},
        title = {},
        subtitle = {},
        question = {}; 


    const HUD = {
        player1, 
        player2,
        correctAnswer,
        player1Score,
        player2Score,
        scoreLabel1,
        scoreLabel2,
        title,
        subtitle,
        question,
        currentRound,
    }
    let answer1;
    let answer2;
    let answer3;

    let disc;
    let textureObj;
    const gameManager = new GameManager();

    const createScene = async function () {
        // Creates a basic Babylon Scene object
        const scene = new BABYLON.Scene(engine);
        // Creates and positions a free camera
        const camera = new BABYLON.UniversalCamera("camera1", 
            // new BABYLON.Vector3(0, 2, 0), scene);
        new BABYLON.Vector3(0, 15, 0), scene);
        // Targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());
        // This attaches the camera to the canvas
        // camera.attachControl(canvas, true);
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
        HUD.question.isVisible = false;
        

        // Built-in 'sphere' shape.
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", 
        {diameter: 2, segments: 32}, scene);
        // Move the sphere upward 1/2 its height
        sphere.material = textureObj.stone_texture;

       
        HUD.player1.meshes = [
           {}, {}, {}
        ];
      
        HUD.player2.meshes = [
            {}, {}, {}
         ];

        for (let  element = 0; element < HUD.player1.meshes.length; element++) {
            HUD.player1.meshes[element] = BABYLON.MeshBuilder.CreateDisc(`disc${element}`, {} ,  scene);
            HUD.player1.meshes[element].position.x = BUTTON_ANSWER_X - element;
            HUD.player1.meshes[element].position.y = BUTTON_ANSWER_Y;
            HUD.player1.meshes[element].position.z = BUTTON_ANSWER_Z;
            HUD.player1.meshes[element].id= `answer${element}`;
            HUD.player1.meshes[element].billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        };

        for (let  element = 0; element < HUD.player2.meshes.length; element++) {
            HUD.player2.meshes[element] = BABYLON.MeshBuilder.CreateDisc(`disc${element}`, {} ,  scene);
            HUD.player2.meshes[element].position.x = BUTTON_ANSWER_X - element - 6; //Magic number bs make const
            HUD.player2.meshes[element].position.y = BUTTON_ANSWER_Y;
            HUD.player2.meshes[element].position.z = BUTTON_ANSWER_Z;
            HUD.player2.meshes[element].id= `P2answer${element}`;
            HUD.player2.meshes[element].billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        };
        
        
        
        HUD.player1.answer1.linkWithMesh(HUD.player1.meshes[0]);
        HUD.player1.answer2.linkWithMesh(HUD.player1.meshes[1]);
        HUD.player1.answer3.linkWithMesh(HUD.player1.meshes[2]);

        HUD.player2.answer1.linkWithMesh(HUD.player2.meshes[0]);
        HUD.player2.answer2.linkWithMesh(HUD.player2.meshes[1]);
        HUD.player2.answer3.linkWithMesh(HUD.player2.meshes[2]);

        // Built-in 'ground' shape.
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 16, height: 12}, scene);
        
        
        // debugger;
        buttonList.startGameButton.onPointerUpObservable.add(function() {
                hideTitleScreen();
                gameManager.changeRound(1, HUD, true);
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
                        if(!gameManager.player1IsLocked){
                             // Add the highlight layer.
                            hl.addMesh(HUD.player1.meshes[0], BABYLON.Color3.Green());
                            HUD.player1Score.text = gameManager.checkForCorrectAnswer(HUD.player1Score.text, HUD.player1.answer1.text, HUD, 'player1');
                        }
                            break;
                        case 'S':
                        case 's':
                            if(!gameManager.player1IsLocked){
                                hl.addMesh(HUD.player1.meshes[1], BABYLON.Color3.Green());
                                HUD.player1Score.text = gameManager.checkForCorrectAnswer(HUD.player1Score.text, HUD.player1.answer2.text, HUD, 'player1');
                                console.log("KEY DOWN: ", kbInfo.event.key);
                            }
                            break;
                        case 'D':
                        case 'd':
                            if(!gameManager.player1IsLocked){
                                console.log("KEY DOWN: ", kbInfo.event.key);
                                hl.addMesh(HUD.player1.meshes[2], BABYLON.Color3.Green());
                                HUD.player1Score.text = gameManager.checkForCorrectAnswer(HUD.player1Score.text, HUD.player1.answer3.text, HUD, 'player1');
                            }
                            break;
                        
                        case 'ArrowLeft':
                            if(!gameManager.player2IsLocked){
                                console.log("KEY DOWN: ", kbInfo.event.key);
                                hl.addMesh(HUD.player2.meshes[0], BABYLON.Color3.Green());
                                HUD.player2Score.text = gameManager.checkForCorrectAnswer(HUD.player2Score.text, HUD.player2.answer1.text, HUD, 'player2');
                            }
                        
                            break;
                        case 'ArrowUp':
                            if(!gameManager.player2IsLocked){
                                console.log("KEY DOWN: ", kbInfo.event.key);
                                hl.addMesh(HUD.player2.meshes[1], BABYLON.Color3.Green());
                                HUD.player2Score.text = gameManager.checkForCorrectAnswer(HUD.player2Score.text, HUD.player2.answer2.text, HUD, 'player2');
                            }
                            break;
                        case 'ArrowRight':
                            if(!gameManager.player2IsLocked){
                                console.log("KEY DOWN: ", kbInfo.event.key);
                                hl.addMesh(HUD.player2.meshes[2], BABYLON.Color3.Green());
                                HUD.player2Score.text = gameManager.checkForCorrectAnswer(HUD.player2Score.text, HUD.player2.answer3.text, HUD, 'player2');
                            }
                            break;

                    }
            }
            else if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYUP){
                HUD.player1.meshes.forEach(element => {
                    hl.removeMesh(element);
                });
                HUD.player2.meshes.forEach(element => {
                    hl.removeMesh(element);
                });
            }
        });

        HUD.player1.answer1.onPointerUpObservable.add(function(e) {
                console.log(e);
                const pick = scene.pick(e.x, e.y);
                console.log(advancedTexture.pick(e.x, e.y));
            });

    })




    const hideTitleScreen = () => {
            HUD.title.isVisible = false;
            HUD.subtitle.isVisible = false;
            
            buttonList.startGameButton.isVisible = false;

            for (const button in HUD.player1) {
                HUD.player1[button].isVisible = true;
            }
            for (const button in HUD.player2) {
                HUD.player2[button].isVisible = true;
            }
            HUD.question.isVisible = true;
            
            HUD.player1.meshes.forEach(element => {
               element.material = textureObj.blue_mat;
            });
            HUD.player2.meshes.forEach(element => {
                element.material = textureObj.red_mat;
             });
            

    }


    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
            engine.resize();
    });
}