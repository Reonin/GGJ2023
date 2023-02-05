export default function setUpHUD(advancedTexture, HUD){
    HUD.player1Score = advancedTexture.getControlByName("Player1Points");
    HUD.player2Score = advancedTexture.getControlByName("Player2Points");
    HUD.scoreLabel1 = advancedTexture.getControlByName("ScoreLabel1");
    HUD.scoreLabel2 = advancedTexture.getControlByName("ScoreLabel2");
    HUD.title = advancedTexture.getControlByName("Title");
    HUD.subtitle = advancedTexture.getControlByName("Subtitle");
    HUD.question = advancedTexture.getControlByName("Question");

    /**player 1 controls**/
    HUD.player1.answer1 = advancedTexture.getControlByName("Answer1");
    HUD.player1.answer1.onPointerUpObservable.add(function() {
        console.log("%cPlayer 1 Button 1 Pressed", "color:blue");
    });

    HUD.player1.answer2 = advancedTexture.getControlByName("Answer2");
    HUD.player1.answer2.onPointerUpObservable.add(function() {
        console.log("%cPlayer 1 Button 2 Pressed", "color:blue");
    });

    HUD.player1.answer3 = advancedTexture.getControlByName("Answer3");
    HUD.player1.answer3.onPointerUpObservable.add(function() {
        console.log("%cPlayer 1 Button 3 Pressed", "color:blue");
    });

     /**player 2 controls**/
    HUD.player2.answer1 = advancedTexture.getControlByName("Answer4");
    HUD.player2.answer1.onPointerUpObservable.add(function() {
        console.log("%cPlayer 1 Button 1 Pressed", "color:red");
    });

    HUD.player2.answer2 = advancedTexture.getControlByName("Answer5");
    HUD.player2.answer2.onPointerUpObservable.add(function() {
        console.log("%cPlayer 1 Button 2 Pressed", "color:red");
    });

    HUD.player2.answer3 = advancedTexture.getControlByName("Answer6");
    HUD.player2.answer3.onPointerUpObservable.add(function() {
        console.log("%cPlayer 1 Button 3 Pressed", "color:red");
    });

    //     HUD.question.isVisible = false;

    // for (const button in HUD.player1) {
    //     HUD.player1[button].isVisible = false;
    // }
    // for (const button in HUD.player2) {
    //     HUD.player2[button].isVisible = false;
    // }
    
}