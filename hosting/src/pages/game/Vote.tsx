import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Transition from "src/animate/Transition";
import useGetAnswers from "src/api/useGetAnswers";
import Card from "src/component/Card";
import CountDown from "src/component/CountDown";
import TitleArea from "src/component/TitleArea";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Pop from "src/component/Pop";
import Button from "src/component/Button";
import useIsVoted from "src/api/useIsVoted";

const DUMMY_ANSWERS = [
  {
    id: "a",
    answer: "dummyHere",
    gameUserId: "dummy1",
  },
  {
    id: "b",
    answer: "dummyHere",
    gameUserId: "dummy2",
  },
  {
    id: "b",
    answer: "dummyHere",
    gameUserId: "dummy3",
  },
  {
    id: "b",
    answer: "dummyHere",
    gameUserId: "dummy4",
  },
];

const variants: Variants = {
  hide: {
    opacity: 0.5,
    y: 500, // 下からスライドアップ
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5, // アニメーションの時間
      ease: "easeOut",
    },
  },
};

const Vote = () => {
  const { gameUserId } = useParams();
  const { data: answers } = useGetAnswers(gameUserId as string);
  const { data: info } = useIsVoted(gameUserId as string);

  const [gameUser, setGameUser] = useState<string>();

  const isVoted = !!info?.isVoted;

  const canSubmit = !!answers && !isVoted && !!gameUser;

  const handleSelectGameUser = (gameUserId: string) => {
    setGameUser(gameUserId);
  };

  const handleBeforeEnd = () => {
    console.log("before end");
  };

  return (
    <div className="flex flex-1 flex-col">
      <TitleArea title="Vote" />
      <Transition>
        <div className="p-1 text-white">
          <div className="my-2">Guess! Who is the human?</div>
          {answers && (
            <>
              <div className="flex items-center gap-4">
                <div className="">Please answer in</div>
                <CountDown date={new Date(answers.shouldAnswerAt)} />
                <div className="">seconds</div>
              </div>
              <div className="my-6 bg-gray-800 px-4 py-2 w-fit text-blue-400 rounded">
                Questions overview
              </div>
              <div className="mt-4 flex flex-col gap-4">
                {answers.gameQuestions.map((gameQuestion, i) => {
                  return (
                    <div className="" key={`${gameQuestion}_${i}`}>
                      <Card>
                        <div className="p-2">
                          <div className="flex gap gap-2">
                            <div className="">Q.{i + 1}</div>
                            <div className="">
                              {gameQuestion.question.question}
                            </div>
                          </div>
                        </div>
                      </Card>
                      <div className="h-4"></div>
                      <div className="flex flex-col gap-2">
                        {gameQuestion.answers.sort().map((answer, i) => {
                          return (
                            <div className="flex" key={`${answer}_${i}`}>
                              <div className="flex items-center gap-2">
                                <div className="bg-white w-24 rounded text-black p-2 text-sm text-center">
                                  {answer.gameUserId === gameUserId
                                    ? "You"
                                    : `Player ${i + 1}`}
                                </div>
                                <div className="p-2 hover:underline">
                                  {answer.answer ?? "未回答です"}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <div className="h-40"></div>
        <motion.div
          key={"pop up"}
          variants={variants}
          initial="hide"
          animate="show"
          className="fixed bottom-6 h-32 w-[70%] bg-slate-300 border rounded shadow-lg left-[15%] z-20 flex"
        >
          {isVoted ? (
            <>
              <div className="flex items-center gap-2 text-sm pl-4">
                <div className="">Please wait</div>
                {answers && (
                  <CountDown date={new Date(answers.shouldAnswerAt)} />
                )}
                <div className="">seconds to see result</div>
              </div>
            </>
          ) : (
            <>
              <div className="absolute -top-16 self-center w-full flex items-center justify-center">
                <div className="w-80">
                  <AnimatePresence>
                    {!gameUser && (
                      <Pop type="bottom" text="Choose one user and submit" />
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex justify-center h-full flex-col m-2 relative z-50">
                <div className="flex text-black">
                  <div className="flex self-start p-2 underline font-bold">
                    Who is the human?
                  </div>
                  <div className="flex items-center gap-2 text-sm pl-4 text-blue-600">
                    <div className="">You have more</div>
                    {answers && (
                      <CountDown
                        date={new Date(answers.shouldAnswerAt)}
                        onBeforeEnd={handleBeforeEnd}
                      />
                    )}
                    <div className="">seconds to answer</div>
                  </div>
                </div>
                <div className="flex flex-1 m-2 gap-6 pt-2">
                  {DUMMY_ANSWERS.map((answer, i) => {
                    return (
                      <button
                        onClick={() => handleSelectGameUser(answer.gameUserId)}
                        key={`${answer}_${i}_user`}
                        className={`w-28 h-10 shadow-lg rounded p-2 text-sm hover:scale-105 transition-all border border-slate-500 ${
                          gameUser === answer.gameUserId
                            ? "bg-blue-500 text-white"
                            : "bg-white  text-black"
                        }`}
                      >
                        Player {i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-1 items-center justify-end pr-10">
                <div className="w-60">
                  <Button message="Submit!!" disabled={!canSubmit} />
                </div>
              </div>
            </>
          )}
        </motion.div>
      </Transition>
    </div>
  );
};

export default Vote;
