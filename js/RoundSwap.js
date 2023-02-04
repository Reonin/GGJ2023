let QuestionData;
let roundNumber;
function executeRoundSwap(QuestionData, HUD){
    
    console.log(QuestionData);
    // debugger;
    HUD.question.text = QuestionData[roundNumber].problem;

    HUD.player1.answer1.text = QuestionData[roundNumber].answers[0];
    HUD.player2.answer1.text = QuestionData[roundNumber].answers[0];

    HUD.player1.answer2.text = QuestionData[roundNumber].answers[1];
    HUD.player2.answer2.text = QuestionData[roundNumber].answers[1];

    HUD.player1.answer3.text = QuestionData[roundNumber].answers[2];
    HUD.player2.answer3.text = QuestionData[roundNumber].answers[2];


    HUD.correctAnswer = QuestionData[roundNumber].correctAnswer;

}

async function loadQuestionData(HUD) {
    try {
        const response = await fetch('../json/data.json');
        const data = await response.json();
        executeRoundSwap(data, HUD);
    } catch (error) {
        return console.log(error);
    }
}

export function changeRound(number, HUD, shouldILoadData = false){
    console.log(number);
    roundNumber = number;
    if(shouldILoadData){
        QuestionData = loadQuestionData(HUD);
        // console.log(QuestionData);
    }else {
        //Skip fetching and use data that's present
        executeRoundSwap(QuestionData, HUD);
    }

   
}


export function checkForCorrectAnswer(playerScore, playersAnswer, correctAnswer){
    if(Number(playersAnswer) === correctAnswer){
        return Number(playerScore) + 1;
        
    }else {
        console.log("%cWrong Answer!!!", "color:red");
        return Number(playerScore);
    }

}
