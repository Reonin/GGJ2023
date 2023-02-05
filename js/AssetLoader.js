export default function loadAssets(BABYLON, scene){
    // BABYLON.SceneLoader.ImportMesh("", Assets.meshes.pirateFort.rootUrl, Assets.meshes.pirateFort.filename, scene)
   
    const stone_texture = new BABYLON.StandardMaterial("stone", scene);

    stone_texture.diffuseTexture = new BABYLON.Texture("../textures/stoneso.png", scene);


    const purple_mat = new BABYLON.StandardMaterial("purple_mat", scene);
    purple_mat.diffuseColor = new BABYLON.Color3(1, 0, 1);

    const blue_mat = new BABYLON.StandardMaterial("blue_mat", scene);
    blue_mat.diffuseColor = new BABYLON.Color3(0, 0, 1);

    const red_mat = new BABYLON.StandardMaterial("red_mat", scene);
    red_mat.diffuseColor = new BABYLON.Color3(1, 0, 0);

    const brown_mat = new BABYLON.StandardMaterial("brown_mat", scene);
    brown_mat.diffuseColor = new BABYLON.Color3(0.306,0.157,0.016);

    const textureObj = {stone_texture, purple_mat, blue_mat, red_mat, brown_mat};
return textureObj;
}