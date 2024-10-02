import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Transition from "src/animate/Transition";
import useGetAnswers from "src/api/useGetAnswers";
import Card from "src/component/Card";
import CountDown from "src/component/CountDown";
import TitleArea from "src/component/TitleArea";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Pop from "src/component/Pop";
import Button from "src/component/Button";
import useIsVoted from "src/api/useIsVoted";
import useVote from "src/api/useVote";
import DefaultToast from "src/toast/DefaultToast";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa";

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
  const { data: info, mutate } = useIsVoted(gameUserId as string);
  const { vote } = useVote();
  const navigate = useNavigate();

  const [gameUser, setGameUser] = useState<string>();

  const isVoted = !!info?.isVoted;

  const canSubmit = !!answers && !isVoted && !!gameUser;

  const dateOver = !!(
    answers?.shouldAnswerAt && new Date(answers.shouldAnswerAt) < new Date()
  );

  const handleSelectGameUser = (gameUserId: string) => {
    setGameUser(gameUserId);
  };

  const reset = useCallback(() => {
    setGameUser(undefined);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    await vote({
      gameUserId: gameUserId as string,
      voteTo: gameUser as string,
    });
    reset();
    toast.success(
      <DefaultToast
        twClassName="w-60"
        message="Your vote has been submitted!!"
      />,
      {
        id: "vote_succeed_modal",
      }
    );
    await mutate();
  }, [canSubmit, vote, gameUser, gameUserId, reset, mutate]);

  const handleBeforeEnd = async () => {
    await handleSubmit();
  };

  const navigateResult = useCallback(() => {
    // navigate(`/game/multi/${gameUserId}/result`);
  }, [navigate, gameUserId]);

  const handleOnEnd = async () => {
    navigateResult();
  };

  const setUp = useCallback(() => {
    !!dateOver && navigateResult();
  }, [navigateResult, dateOver]);

  useEffect(() => {
    setUp();
  }, [setUp]);

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
                <CountDown
                  date={new Date(answers.shouldAnswerAt)}
                  onBeforeEnd={handleBeforeEnd}
                  onEnd={handleOnEnd}
                />
                <div className="">seconds</div>
              </div>
              <div className="my-6 bg-gray-800 px-4 py-2 w-fit text-blue-400 rounded shadow-lg">
                Questions overview
              </div>
              <div className="mt-4 flex flex-col gap-4">
                {answers.gameQuestions.map((gameQuestion, i) => {
                  return (
                    <div className="" key={`${gameQuestion}_${i}`}>
                      <Card>
                        <div className="p-2">
                          <div className="flex gap gap-2 md:flex-row flex-col">
                            <div className="">Q.{i + 1}</div>
                            <div className="">
                              {gameQuestion.question.question}
                            </div>
                          </div>
                        </div>
                      </Card>
                      <div className="h-4"></div>
                      <div className="flex flex-col gap-2">
                        {gameQuestion.answers.map((answer, i) => {
                          return (
                            <div className="flex" key={`${answer}_${i}`}>
                              <div className="flex items-center gap-2 md:flex-row flex-col">
                                <div className="bg-white min-w-24 rounded text-black p-2 text-sm self-start text-center">
                                  {i === 0 ? "You" : `Player ${i}`}
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
          className="fixed bottom-5 md:bottom-10 md:h-32 md:w-[70%] w-[96%] flex-col rounded shadow-lg md:left-[15%] z-20 flex"
        >
          {isVoted ? (
            <Card>
              <div className="flex items-center gap-2 pl-4 text-white text-md font-semibold">
                <div className="w-6">
                  <FaCheck size={20} color="#15da12" />
                </div>
                <div className="">Please wait</div>
                {answers && (
                  <CountDown date={new Date(answers.shouldAnswerAt)} />
                )}
                <div className="">seconds to see result</div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex md:flex-row flex-col p-1 justify-around flex-1">
                <div className="inline-flex">
                  <div className="absolute -top-16 self-center w-full flex items-center justify-center">
                    <div className="w-80">
                      <AnimatePresence>
                        {!gameUser && (
                          <Pop
                            type="bottom"
                            text="Choose one user and submit"
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="flex justify-center h-full flex-col md:m-2 relative z-50">
                    <div className="flex md:flex-row flex-col">
                      <div className="flex self-start md:p-2 underline font-bold text-white my-2">
                        Who is the human?
                      </div>
                      <div className="flex items-center gap-2 text-sm pl-4 text-blue-600">
                        <div className="">You have more</div>
                        {answers && (
                          <CountDown date={new Date(answers.shouldAnswerAt)} />
                        )}
                        <div className="">seconds to answer</div>
                      </div>
                    </div>
                    <div className="flex flex-1 m-2 gap-6 pt-2">
                      {answers?.gameQuestions[0].answers
                        .slice(1)
                        .map((answer, i) => {
                          return (
                            <button
                              onClick={() =>
                                handleSelectGameUser(answer.gameUserId)
                              }
                              type="button"
                              key={`${answer}_${i}_user`}
                              className={`min-w-28 h-10 shadow-lg rounded p-2 text-sm hover:scale-105 transition-all border border-slate-500 ${
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
                </div>
                <div className="flex flex-1 items-center md:justify-end justify-center mt-4 mb:mt-0">
                  <div className="w-auto">
                    <Button
                      message="Submit!!"
                      disabled={!canSubmit}
                      onCLick={handleSubmit}
                      width="w-auto"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </Transition>
    </div>
  );
};

export default Vote;
