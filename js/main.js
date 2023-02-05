import {BUTTON_ANSWER_X, BUTTON_ANSWER_Y, BUTTON_ANSWER_Z } from './Constants.js';
import setUpButtons from './buttonConfig.js';
import setUpHUD from './HUDConfig.js';
import loadAssets from './AssetLoader.js';
import { GameManager } from './RoundSwap.js';
import { AudioManager } from './AudioManager.js';

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

    let textureObj;
    const gameManager = new GameManager();
    let audioManager;

    let p1Roots;
    let p1FullPaths;
    let p2Roots;
    let p2FullPaths;

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
            new BABYLON.Vector3(0, 1, -0.400), scene);
        // Dim the light a small amount - 0 to 1
        light.intensity = 0.5;
        
        //GUI
        advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene, BABYLON.Texture.NEAREST_NEAREST);
        let loadedGUI = await advancedTexture.parseFromURLAsync("./json/guiTexture.json");

        textureObj = loadAssets(BABYLON, scene);
        setUpButtons(advancedTexture, buttonList);
        setUpHUD(advancedTexture, HUD);
        audioManager = new AudioManager(BABYLON, scene);

        audioManager.loadSounds();
        // HUD.question.isVisible = false;
        

        // // Built-in 'sphere' shape.
        // const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", 
        // {diameter: 2, segments: 32}, scene);
        // Move the sphere upward 1/2 its height
        // sphere.material = textureObj.stone_texture;

        // BABYLON.SceneLoader.Append("./models/", "pistachio.obj", scene, function (scene) {
        //     // do something with the scene
        // });

        const assetsManager = new BABYLON.AssetsManager(scene);
        const meshTask = assetsManager.addMeshTask('seed task', '', './models/', 'pistachio.glb');
        meshTask.onSuccess = (task) => {
            const seedMesh = task.loadedMeshes[0];
            // Do something with the mesh here
            seedMesh.position.x = 0;
            seedMesh.position.y = 1;
            seedMesh.position.z = 0;
            // seedMesh.rotationQuaternion.x = Math.PI/2;
            seedMesh.material = textureObj.purple_mat;
        }
        assetsManager.load();

        HUD.player1.meshes = [
           {}, {}, {}
        ];
      
        HUD.player2.meshes = [
            {}, {}, {}
         ];

        for (let  element = 0; element < HUD.player1.meshes.length; element++) {
            HUD.player1.meshes[element] = BABYLON.MeshBuilder.CreateDisc(`disc${element}`, {radius:0.3} ,  scene);
            HUD.player1.meshes[element].position.x = BUTTON_ANSWER_X - element * 1.15;
            HUD.player1.meshes[element].position.y = BUTTON_ANSWER_Y;
            HUD.player1.meshes[element].position.z = BUTTON_ANSWER_Z - (element * 0.25);
            HUD.player1.meshes[element].id= `answer${element}`;
            HUD.player1.meshes[element].billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        };

        for (let  element = 0; element < HUD.player2.meshes.length; element++) {
            HUD.player2.meshes[element] = BABYLON.MeshBuilder.CreateDisc(`disc${element}`, {radius:0.3} ,  scene);
            HUD.player2.meshes[element].position.x = BUTTON_ANSWER_X - element * 1.2 - 5.4; //Magic number bs make const
            HUD.player2.meshes[element].position.y = BUTTON_ANSWER_Y;
            HUD.player2.meshes[element].position.z = BUTTON_ANSWER_Z - (element * 0.25);
            HUD.player2.meshes[element].id= `P2answer${element}`;
            HUD.player2.meshes[element].billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        };
        
        
        
        HUD.player1.answer1.linkWithMesh(HUD.player1.meshes[0]);
        HUD.player1.answer2.linkWithMesh(HUD.player1.meshes[1]);
        HUD.player1.answer3.linkWithMesh(HUD.player1.meshes[2]);

        HUD.player2.answer1.linkWithMesh(HUD.player2.meshes[0]);
        HUD.player2.answer2.linkWithMesh(HUD.player2.meshes[1]);
        HUD.player2.answer3.linkWithMesh(HUD.player2.meshes[2]);


     
         // Code in this function will run ~60 times per second
        const directionArr1 = [true, true, true];
        const directionArr2= [true, true, true];

        
        let linesystem;
        let linesystem2;
        scene.registerBeforeRender( () => {

            HUD.player1.meshes.forEach( (but, index) => {
                let oldVal = directionArr1[index];

                 // Check if box is moving up
                if (but.position.z < BUTTON_ANSWER_Z + 0.5 && directionArr1[index]) {
                    // Increment box position to the up
                    but.position.z += 0.0125;
                }
                else {
                    // Swap directions to move down
                    directionArr1[index] = false;
                   
                }
                // Check if box is moving down
                if (but.position.z > BUTTON_ANSWER_Z - 0.5 && !directionArr1[index]) {
                    // Decrement box position to the down
                    but.position.z -= 0.0125;
                }
                else {
                    // Swap directions to move up
                    directionArr1[index] = true;
                }

                if((oldVal !== directionArr1[index]) && (gameManager.roundNumber > 0)){
                    audioManager.softFX.play();
                }
            });
          
            HUD.player2.meshes.forEach( (but, index) => {
                // let oldVal = directionArr1[index];
                // Check if box is moving up
               if (but.position.z < BUTTON_ANSWER_Z + 0.5 && directionArr2[index]) {
                   // Increment box position to the up
                   but.position.z += 0.0125;
               }
               else {
                   // Swap directions to move down
                   directionArr2[index] = false;
               }
               // Check if box is moving down
               if (but.position.z > BUTTON_ANSWER_Z - 0.5 && !directionArr2[index]) {
                   // Decrement box position to the down
                   but.position.z -= 0.0125;
               }
               else {
                   // Swap directions to move up
                   directionArr2[index] = true;
               }

           });
            if(linesystem){
                linesystem.dispose();
                linesystem2.dispose();
            }
            linesystem = BABYLON.MeshBuilder.CreateLineSystem("linesystem", {lines: p1Roots, updatable: true}, scene); 
            linesystem.color = new BABYLON.Color3(0.824,0.706,0.549);

            linesystem2 = BABYLON.MeshBuilder.CreateLineSystem("linesystem2", {lines: p2Roots, updatable: true}, scene); 
            linesystem2.color = new BABYLON.Color3(0.824,0.706,0.549);

            linesystem.enableEdgesRendering();	
            linesystem.edgesWidth = 3;
            linesystem.edgesColor = new BABYLON.Color4(0.824,0.706,0.549, 1);

            linesystem2.enableEdgesRendering();	
            linesystem2.edgesWidth = 3;
            linesystem2.edgesColor = new BABYLON.Color4(0.824,0.706,0.549, 1);
        //    debugger;
        });
        
        p1Roots = [
            [ 	new BABYLON.Vector3(0, 1, 0),
                new BABYLON.Vector3(0, 1, 1) //init
            ]
        ];

        p1FullPaths =[  
        [ 	new BABYLON.Vector3(0, 1, 0),
            new BABYLON.Vector3(0, 1, 1) //init
        ],
        [
            new BABYLON.Vector3(0, 1, 1),
            new BABYLON.Vector3(1, 1, 1.5), //diag
        ],
        [	new BABYLON.Vector3(1, 1, 1.5),
            new BABYLON.Vector3(6.5, 1, 1.5), //left
        ],
        [	new BABYLON.Vector3(6.5, 1, 1.5),
            new BABYLON.Vector3(6.5, 1, 5.5),//down
        ],
        [	new BABYLON.Vector3(6.5, 1, 5.5),
            new BABYLON.Vector3(2, 1, 5.5), //right
        ],
        [	new BABYLON.Vector3(2, 1, 5.5),
            new BABYLON.Vector3(2, 1, 1.5), //up
        ]];

        p2Roots = [
            [ 	new BABYLON.Vector3(0, 1, 0),
                new BABYLON.Vector3(0, 1, 1) //init
            ]
        ];

        p2FullPaths =[  
            [ 	new BABYLON.Vector3(0, 1, 0),
                new BABYLON.Vector3(0, 1, 1) //init
            ],
            [
                new BABYLON.Vector3(0, 1, 1),
                new BABYLON.Vector3(-1, 1, 1.5), //diag
            ],
            [	new BABYLON.Vector3(-1, 1, 1.5),
                new BABYLON.Vector3(-6.5, 1, 1.5), //left
            ],
            [	new BABYLON.Vector3(-6.5, 1, 1.5),
                new BABYLON.Vector3(-6.5, 1, 5.5),//down
            ],
            [	new BABYLON.Vector3(-6.5, 1, 5.5),
                new BABYLON.Vector3(-2, 1, 5.5), //right
            ],
            [	new BABYLON.Vector3(-2, 1, 5.5),
                new BABYLON.Vector3(-2, 1, 1.5), //up
            ]];
       




        HUD.player1.meshes.forEach(element => {
            element.material = textureObj.blue_mat;
         });
         HUD.player2.meshes.forEach(element => {
             element.material = textureObj.red_mat;
          });

        // Built-in 'ground' shape.
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 20, height: 14}, scene);
        // Built-in 'ground' shape.
        // const sky = BABYLON.MeshBuilder.CreateGround("sky", {width: 20, height: 7}, scene);
        // sky.material = textureObj.blue_mat;
        // sky.position.y = 0.1;
        // sky.position.z = -5.0;


        ground.material = textureObj.soil_texture;
        ground.material.diffuseTexture.wAng = Math.PI;
        ground.position.z = 1;
        
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
                                if(HUD.player1Score.text < p1FullPaths.length){
                                    p1Roots.push(p1FullPaths[HUD.player1Score.text]); 
                                }else {
                                    HUD.question.text = "Player one wins!"
                                }
                               
                            }
                            break;
                        case 'S':
                        case 's':
                            if(!gameManager.player1IsLocked){
                                hl.addMesh(HUD.player1.meshes[1], BABYLON.Color3.Green());
                                HUD.player1Score.text = gameManager.checkForCorrectAnswer(HUD.player1Score.text, HUD.player1.answer2.text, HUD, 'player1');
                                console.log("KEY DOWN: ", kbInfo.event.key);
                                if(HUD.player1Score.text < p1FullPaths.length){
                                    p1Roots.push(p1FullPaths[HUD.player1Score.text]); 
                                }else {
                                    HUD.question.text = "Player one wins!"
                                }
                            }
                            break;
                        case 'D':
                        case 'd':
                            if(!gameManager.player1IsLocked){
                                console.log("KEY DOWN: ", kbInfo.event.key);
                                hl.addMesh(HUD.player1.meshes[2], BABYLON.Color3.Green());
                                HUD.player1Score.text = gameManager.checkForCorrectAnswer(HUD.player1Score.text, HUD.player1.answer3.text, HUD, 'player1');
                                if(HUD.player1Score.text < p1FullPaths.length){
                                    p1Roots.push(p1FullPaths[HUD.player1Score.text]); 
                                }else {
                                    HUD.question.text = "Player one wins!"
                                }
                            }
                            break;
                        
                        case 'ArrowLeft':
                            if(!gameManager.player2IsLocked){
                                console.log("KEY DOWN: ", kbInfo.event.key);
                                hl.addMesh(HUD.player2.meshes[0], BABYLON.Color3.Green());
                                HUD.player2Score.text = gameManager.checkForCorrectAnswer(HUD.player2Score.text, HUD.player2.answer1.text, HUD, 'player2');
                                if(HUD.player2Score.text < p2FullPaths.length){
                                    p2Roots.push(p2FullPaths[HUD.player2Score.text]); 
                                }else {
                                    HUD.question.text = "Player two wins!"
                                }
                            }
                        
                            break;
                        case 'ArrowDown':
                            if(!gameManager.player2IsLocked){
                                console.log("KEY DOWN: ", kbInfo.event.key);
                                hl.addMesh(HUD.player2.meshes[1], BABYLON.Color3.Green());
                                HUD.player2Score.text = gameManager.checkForCorrectAnswer(HUD.player2Score.text, HUD.player2.answer2.text, HUD, 'player2');
                                if(HUD.player2Score.text < p2FullPaths.length){
                                    p2Roots.push(p2FullPaths[HUD.player2Score.text]); 
                                }else {
                                    HUD.question.text = "Player two wins!"
                                }
                            }
                            break;
                        case 'ArrowRight':
                            if(!gameManager.player2IsLocked){
                                console.log("KEY DOWN: ", kbInfo.event.key);
                                hl.addMesh(HUD.player2.meshes[2], BABYLON.Color3.Green());
                                HUD.player2Score.text = gameManager.checkForCorrectAnswer(HUD.player2Score.text, HUD.player2.answer3.text, HUD, 'player2');
                                if(HUD.player2Score.text < p2FullPaths.length){
                                    p2Roots.push(p2FullPaths[HUD.player2Score.text]); 
                                }else {
                                    HUD.question.text = "Player two wins!"
                                }
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

            // for (const button in HUD.player1) {
            //     HUD.player1[button].isVisible = true;
            // }
            // for (const button in HUD.player2) {
            //     HUD.player2[button].isVisible = true;
            // }
            // HUD.question.isVisible = true;
            
           
            

    }


    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
            engine.resize();
    });
}