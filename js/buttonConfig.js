
export default function setUpButtons(advancedTexture, buttonList){
    buttonList.startGameButton =  advancedTexture.getControlByName("Start Game");
    // debugger;
    // startGameButton.isVisible = false;
    buttonList.startGameButton.onPointerUpObservable.add(function() {
        console.log("%cStart Game Pressed", "color:green");
    });
    /**player 1 controls**/
    buttonList.player1.answer1 = advancedTexture.getControlByName("Answer1");
    buttonList.player1.answer1.onPointerUpObservable.add(function() {
        console.log("%cPlayer 1 Button 1 Pressed", "color:blue");
    });

    buttonList.player1.answer2 = advancedTexture.getControlByName("Answer2");
    buttonList.player1.answer2.onPointerUpObservable.add(function() {
        console.log("%cPlayer 1 Button 2 Pressed", "color:blue");
    });

    buttonList.player1.answer3 = advancedTexture.getControlByName("Answer3");
    buttonList.player1.answer3.onPointerUpObservable.add(function() {
        console.log("%cPlayer 1 Button 3 Pressed", "color:blue");
    });

     /**player 2 controls**/
    buttonList.player2.answer1 = advancedTexture.getControlByName("Answer4");
    buttonList.player2.answer1.onPointerUpObservable.add(function() {
        console.log("%cPlayer 1 Button 1 Pressed", "color:red");
    });

    buttonList.player2.answer2 = advancedTexture.getControlByName("Answer5");
    buttonList.player2.answer2.onPointerUpObservable.add(function() {
        console.log("%cPlayer 1 Button 2 Pressed", "color:red");
    });

    buttonList.player2.answer3 = advancedTexture.getControlByName("Answer6");
    buttonList.player2.answer3.onPointerUpObservable.add(function() {
        console.log("%cPlayer 1 Button 3 Pressed", "color:red");
    });

    for (const button in buttonList.player1) {
        buttonList.player1[button].isVisible = false;
    }
    for (const button in buttonList.player2) {
        buttonList.player2[button].isVisible = false;
    }
  
}

