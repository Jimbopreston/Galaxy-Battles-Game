export default class MathSystem {
    constructor() {
        this.currentQuestion = null;
        this.correctAnswer = null;
    }

    generateQuestion() {
        const num1 = Phaser.Math.Between(1, 10);
        const num2 = Phaser.Math.Between(1, 10);
        const operator = Phaser.Math.RND.pick(['+', '-', '*']);

        let question;
        let answer;

        switch (operator) {
            case '+':
                question = `${num1} + ${num2}`;
                answer = num1 + num2;
                break;
            case '-':
                question = `${num1} - ${num2}`;
                answer = num1 - num2;
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