export default class MathSystem {
    constructor() {
        this.currentQuestion = null;
        this.correctAnswer = null;
    }

    generateQuestion() {
        let num1 = Phaser.Math.Between(1, this.maxNumber || 10);
        let num2 = Phaser.Math.Between(1, this.maxNumber || 10);
        const operator = Phaser.Math.RND.pick(['+', '-', '*']);

        let question;
        let answer;

        switch (operator) {
            case '+':
                question = `${num1} + ${num2}`;
                answer = num1 + num2;
                break;
            case '-':
                // ensure no negative answers
                if (!this.allowNegatives && num2 > num1) {
                    [num1, num2] = [num2, num1];
                }
                question = `${num1} - ${num2}`;
                answer
                    = num1 - num2;
                break;
            case '*':
                question = `${num1} × ${num2}`;
                answer = num1 * num2;
                break;
        }

        this.currentQuestion = question;
        this.correctAnswer = answer;

        return question;
    }

    checkAnswer(playerAnswer) {
        const isCorrect = Number(playerAnswer) === this.correctAnswer;

        return {
            correct: isCorrect,
            damageMultiplier: isCorrect ? 1.5 : 0.5
        };
    }
}