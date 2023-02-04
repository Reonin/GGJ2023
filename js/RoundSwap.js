let QuestionData;
let roundNumber;
function executeRoundSwap(QuestionData, HUD){
    
    console.log(QuestionData);
    debugger;
    HUD.question.text = QuestionData[roundNumber].problem;

    HUD.player1.answer1.text = QuestionData[roundNumber].correctAnswer;
    HUD.player2.answer1.text = QuestionData[roundNumber].correctAnswer;

    HUD.player1.answer2.text = QuestionData[roundNumber].wrongAnswer[0];
    HUD.player2.answer2.text = QuestionData[roundNumber].wrongAnswer[0];

    HUD.player1.answer3.text = QuestionData[roundNumber].wrongAnswer[1];
    HUD.player2.answer3.text = QuestionData[roundNumber].wrongAnswer[1];

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

export default function changeRound(number, HUD, shouldILoadData = false){
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

