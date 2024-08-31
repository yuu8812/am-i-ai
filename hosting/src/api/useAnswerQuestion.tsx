import { client } from "src/client";

const useAnswerQuestion = () => {
  const answer = async ({
    answer,
    questionId,
    gameUserId,
  }: {
    questionId: string;
    answer: string;
    gameUserId: string;
  }) => {
    const res = await client.GAMES.answerQuestion({
      body: { answer: answer, questionId },
      params: { gameUserId },
    });
    return res;
  };

  return { answer };
};

export default useAnswerQuestion;
