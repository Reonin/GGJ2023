// let QuestionData;
// let roundNumber;

export class GameManager {
    constructor(){
        this.QuestionData;
        this.roundNumber;
    }


executeRoundSwap(HUD){
    
        console.log(this.QuestionData);
    
        if (!("scramble" in Array.prototype)) {
            Object.defineProperty(Array.prototype, "scramble", {
              enumerable: false,
              value: function() {
                var o, i, ln = this.length;
                while (ln--) {
                  i = Math.random() * (ln + 1) | 0;
                  o = this[ln];
                  this[ln] = this[i];
                  this[i] = o;
                }
                return this;
              }
            });
          }
    
          this.QuestionData[this.roundNumber].answers.forEach(q => {
            // debugger;
          this.QuestionData[this.roundNumber].answers.scramble()});
    
    
    
        // debugger;
        HUD.question.text = this.QuestionData[this.roundNumber].problem;
    
        HUD.player1.answer1.text = this.QuestionData[this.roundNumber].answers[0];
        HUD.player2.answer1.text = this.QuestionData[this.roundNumber].answers[2];
    
        HUD.player1.answer2.text = this.QuestionData[this.roundNumber].answers[1];
        HUD.player2.answer2.text = this.QuestionData[this.roundNumber].answers[1];
    
        HUD.player1.answer3.text = this.QuestionData[this.roundNumber].answers[2];
        HUD.player2.answer3.text = this.QuestionData[this.roundNumber].answers[0];
    
    
        HUD.correctAnswer = this.QuestionData[this.roundNumber].correctAnswer;
    
    }
    
    async loadQuestionData(HUD) {
        try {
            const response = await fetch('../json/data.json');
            this.QuestionData = await response.json();
            this.executeRoundSwap(HUD);
        } catch (error) {
            return console.log(error);
        }
    }
    
    changeRound(number, HUD, shouldILoadData = false){
        console.log(number);
        this.roundNumber = number;
        if(shouldILoadData){
            this.loadQuestionData(HUD);
            // debugger;
            // console.log(QuestionData);
        }else {
            //Skip fetching and use data that's present
            debugger;
            this.executeRoundSwap(HUD);
        }
    
    }
    
    checkForCorrectAnswer(playerScore, playersAnswer, HUD){
        if(Number(playersAnswer) === HUD.correctAnswer){
            this.changeRound(this.roundNumber + 1, HUD);
            return Number(playerScore) + 1;
            
        }else {
            console.log("%cWrong Answer!!!", "color:red");
            return Number(playerScore);
        }
    
    }


    lockOutInputTemporarily(){
        const time = 3000;

    }


}


