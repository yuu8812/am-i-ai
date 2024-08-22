import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Transition from "src/animate/Transition";
import useProgress, { ProgressResponse } from "src/api/useProgress";
import Button from "src/component/Button";
import Card from "src/component/Card";
import CountDown from "src/component/CountDown";
import OnlineBadge from "src/component/OnlineBadge";
import TextArea from "src/component/TextArea";
import TextAreaPlaceHolder from "src/component/TextAreaPlaceholder";
import TitleArea from "src/component/TitleArea";
import { motion } from "framer-motion";
import useHealthCheck from "src/api/useHealthCheck";

const variants = {
  show: {
    opacity: 1,
    y: 0,
    transition: {
      ease: "easeOut",
      duration: 0.3,
    },
  },
  hide: {
    y: -20,
    opacity: 0,
  },
};

const MultiPlay = () => {
  const [currentQuestion, setCurrentQuestion] =
    useState<ProgressResponse["questions"][number]>();
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const { id: gameUserId } = useParams();
  const { data: progress } = useProgress(gameUserId as string);
  const { data: health } = useHealthCheck(gameUserId as string);
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const dateOver =
    progress &&
    progress.questions[currentPhase]?.shouldAnswerAt &&
    new Date(progress.questions[currentPhase]?.shouldAnswerAt) < new Date();

  const navigateVote = useCallback(() => {
    navigate("vote", { replace: true });
  }, [navigate]);

  const updateCurrentQuestion = useCallback(() => {
    if (!progress) return;
    if (!dateOver) return;
    if (!health) return;
    setCurrentPhase((prev) => {
      const next = prev + 1;
      setCurrentQuestion(progress.questions[next]);
      return next;
    });
    if (currentPhase === progress.questions.length - 1 && currentPhase !== 0) {
      return navigateVote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, dateOver, progress]);

  const findCurrentQuestion = useCallback(() => {
    if (!progress || progress.questions.length === 0) return;
    const now = new Date();
    const currentQuestion = progress.questions.reduce(
      (
        prev: ProgressResponse["questions"][number],
        current: ProgressResponse["questions"][number]
      ) => {
        const currentDate = new Date(current.shouldAnswerAt);
        if (currentDate > now) return prev;
        if (!prev) return current;
        const prevDate = new Date(prev.shouldAnswerAt);
        if (currentDate > prevDate) return current;
        return prev;
      }
    );

    return currentQuestion;
  }, [progress]);

  const setUp = useCallback(() => {
    if (!progress) return;
    if (progress.questions.length === 0) return;
    const currentQuestion = findCurrentQuestion();
    if (!currentQuestion) return;
    setCurrentQuestion(currentQuestion);
    setCurrentPhase(currentQuestion.phase);
  }, [progress, findCurrentQuestion]);

  useEffect(() => {
    setUp();
  }, [setUp]);

  useEffect(() => {
    updateCurrentQuestion();
  }, [updateCurrentQuestion]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentQuestion]);

  return (
    <div className="flex flex-1 flex-col">
      <TitleArea title="MultiPlay" />
      {progress && health && (
        <Transition>
          <div className="text-white my-4 pl-1">Joined Players</div>
          <div className="flex gap-2">
            {health.gameUsers?.map((user, i) => {
              return (
                <div key={user.id} className="h-10 text-white w-1/2 text-sm">
                  <Card>
                    <div className="flex items-center justify-between flex-1">
                      <div className="m-1 flex items-center gap-2">
                        {user.name}
                        {i === 0 && <div className="">(you)</div>}
                      </div>
                      <OnlineBadge isOnline={user.online} />
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
          {progress.questions.length > 0 && currentQuestion && (
            <div className="flex flex-1 flex-col">
              <div className="text-white mb-4 mt-6">
                Question {currentPhase + 1} / {progress.questions.length}
              </div>
              <motion.div
                key={currentQuestion.question}
                variants={variants}
                initial="hide"
                animate="show"
                className="text-white inline-flex"
              >
                <Card>
                  <div className="m-2 text-xl justify-center flex flex-1 border my-2 py-2 p-2">
                    {currentQuestion.question}
                  </div>
                </Card>
              </motion.div>
              <div className="flex h-40 w-[80%] self-center mt-10">
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-white">
                    <div>Please answer in</div>
                    <CountDown
                      date={new Date(currentQuestion.shouldAnswerAt)}
                    />
                    <div className="">seconds</div>
                  </div>
                  {!dateOver ? (
                    <TextArea inputRef={inputRef} ref={inputRef} />
                  ) : (
                    <TextAreaPlaceHolder message="回答は締め切られました" />
                  )}
                </div>
              </div>
              <div className="self-center my-10">
                <Button message="Submit" width="w-60" disabled={dateOver} />
              </div>
            </div>
          )}
        </Transition>
      )}
    </div>
  );
};

export default MultiPlay;
