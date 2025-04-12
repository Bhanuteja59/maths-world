export const generateRandomProblem = (operation) => {
  let num1, num2, answer, explanation;

  switch (operation) {
    case "addition":
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      answer = num1 + num2;
      explanation = `${num1} + ${num2} = ${answer}`;
      break;

    case "subtraction":
      num1 = Math.floor(Math.random() * 50) + 20;
      num2 = Math.floor(Math.random() * num1) + 1;
      answer = num1 - num2;
      explanation = `${num1} - ${num2} = ${answer}`;
      break;

    case "multiplication":
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 * num2;
      explanation = `${num1} × ${num2} = ${answer}`;
      break;

    case "division":
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = Math.floor(Math.random() * 10) + 1;
      num1 = num2 * answer;
      explanation = `${num1} ÷ ${num2} = ${answer}`;
      break;

    case "square-root":
      answer = Math.floor(Math.random() * 10) + 1;
      num1 = answer * answer;
      explanation = `√${num1} = ${answer}`;
      break;

    default:
      throw new Error("Invalid operation");
  }

  return { num1, num2, answer, explanation };
};

export const checkAnswer = (userAnswer, correctAnswer, explanation) => {
  const isCorrect = parseFloat(userAnswer) === correctAnswer;
  return { isCorrect, correctAnswer, explanation };
};
