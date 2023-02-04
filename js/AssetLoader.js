export default function loadAssets(BABYLON, scene){
    // BABYLON.SceneLoader.ImportMesh("", Assets.meshes.pirateFort.rootUrl, Assets.meshes.pirateFort.filename, scene)
   
    const stone_texture = new BABYLON.StandardMaterial("stone", scene);

    stone_texture.diffuseTexture = new BABYLON.Texture("../textures/stoneso.png", scene);


    const purple_mat = new BABYLON.StandardMaterial("", scene);
    purple_mat.diffuseColor = new BABYLON.Color3(1, 0, 1);

    const textureObj = {stone_texture, purple_mat};
return textureObj;
}