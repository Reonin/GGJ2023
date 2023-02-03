export default function setUpHUD(advancedTexture, HUD){
    HUD.player1Score = advancedTexture.getControlByName("Player1Points");
    HUD.player2Score = advancedTexture.getControlByName("Player2Points");
    HUD.scoreLabel1 = advancedTexture.getControlByName("ScoreLabel1");
    HUD.scoreLabel2 = advancedTexture.getControlByName("ScoreLabel2");
    HUD.title = advancedTexture.getControlByName("Title");
    HUD.subtitle = advancedTexture.getControlByName("Subtitle");
    HUD.question = advancedTexture.getControlByName("Question");


    HUD.question.isVisible = false;
}