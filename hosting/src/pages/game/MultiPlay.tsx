import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { AnimatePresence, motion } from "framer-motion";
import useHealthCheck from "src/api/useHealthCheck";
import useIsAnswered from "src/api/useIsAnswered";
import Pop from "src/component/Pop";
import useAnswerQuestion from "src/api/useAnswerQuestion";
import { FaCheck } from "react-icons/fa";
import DefaultToast from "src/toast/DefaultToast";
import toast from "react-hot-toast";
import Robot from "src/component/Robot";

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
  const [value, setValue] = useState<string>("");

  const { gameUserId } = useParams();
  const { data: progress } = useProgress(gameUserId as string);
  const { data: health } = useHealthCheck(gameUserId as string);
  const { data: check, mutate } = useIsAnswered({
    gameUserId: gameUserId as string,
    questionId: currentQuestion?.id,
  });
  const { answer } = useAnswerQuestion();

  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const dateOver = useMemo(
    () =>
      !!(
        progress &&
        currentQuestion &&
        progress.questions[currentQuestion.phase]?.shouldAnswerAt &&
        new Date(progress.questions[currentQuestion.phase]?.shouldAnswerAt) <
          new Date()
      ),
    [progress, currentQuestion]
  );

  const isAnswered = useMemo(() => check?.isAnswered === true, [check]);

  const canAnswer = useMemo(
    () =>
      !!progress && !!health && !!currentQuestion && !isAnswered && !dateOver,
    [progress, health, currentQuestion, isAnswered, dateOver]
  );

  const reset = useCallback(() => {
    setValue("");
  }, []);

  const handleAnswer = useCallback(async () => {
    if (!currentQuestion || !value) return;
    try {
      await answer({
        questionId: currentQuestion.id,
        answer: value,
        gameUserId: gameUserId as string,
      });
      await mutate();
      toast.success(
        <DefaultToast
          twClassName="w-60"
          message="Your answer has been submitted!!"
        />,
        {
          id: "answer_succeed_modal",
        }
      );
    } catch (error) {
      toast.error("Something went wrong. Please retry");
    }
  }, [answer, currentQuestion, value, mutate, gameUserId]);

  const navigateVote = useCallback(() => {
    navigate("vote", { replace: true });
  }, [navigate]);

  const updateCurrentQuestion = useCallback(() => {
    if (!progress) return;
    if (!health) return;
    if (!currentQuestion) return;
    if (currentQuestion.phase === progress.questions.length - 1) navigateVote();
    reset();
    setCurrentQuestion((prev) => progress.questions[(prev?.phase ?? 0) + 1]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateOver, progress, currentQuestion, reset, navigateVote]);

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

  const onEnd = useCallback(() => {
    updateCurrentQuestion();
  }, [updateCurrentQuestion]);

  const setUp = useCallback(() => {
    if (!progress) return;
    if (progress.questions.length === 0) return;
    const currentQuestion = findCurrentQuestion();
    if (!currentQuestion) return;
    setCurrentQuestion(currentQuestion);
  }, [progress, findCurrentQuestion]);

  const handleBeforeEnd = useCallback(async () => {
    if (!value || isAnswered) return;
    await handleAnswer();
  }, [handleAnswer, value, isAnswered]);

  useEffect(() => {
    setUp();
  }, [setUp]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentQuestion]);

  return (
    <div className="flex flex-1 flex-col">
      <TitleArea title="MultiPlay" />
      <div className="fixed lg:bottom-6 lg:right-16 z-50 scale-50 bottom-1 right-1">
        <Robot />
      </div>
      {progress && health && (
        <Transition>
          <div className="text-white my-4 pl-1">Joined Players</div>
          <div className="flex flex-col lg:flex-row gap-2">
            {health.gameUsers?.map((user, i) => {
              return (
                <div key={user.id} className="h-10 text-white lg:w-1/2 text-sm">
                  <Card>
                    <div className="flex items-center justify-between flex-1">
                      <div className="m-1 flex items-center gap-2">
                        {user.name}
                        {i === 0 && <div className="">( you )</div>}
                      </div>
                      <OnlineBadge isOnline={user.online} />
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
          {progress.questions.length > 0 && currentQuestion && (
            <form className="flex flex-1 flex-col">
              <div className="text-white mb-4 mt-6">
                Question {currentQuestion.phase + 1} /{" "}
                {progress.questions.length}
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
              <div className="text-gray-400 text-sm p-2">
                ** Please answer deeply as much as you can
              </div>
              <div className="flex h-40 w-full lg:w-[80%] self-center mt-10">
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-white pb-2 pl-8">
                    <div className="">
                      Please {isAnswered ? "wait" : "answer in"}
                    </div>
                    <CountDown
                      date={new Date(currentQuestion.shouldAnswerAt)}
                      onEnd={onEnd}
                      onBeforeEnd={handleBeforeEnd}
                    />
                    <div className="">seconds</div>
                  </div>
                  <div className="flex flex-1 items-center gap-2 h-40">
                    <div className="w-6">
                      {isAnswered && <FaCheck size={20} color="green" />}
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                      {!dateOver ? (
                        <TextArea
                          inputRef={inputRef}
                          ref={inputRef}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          editable={!isAnswered}
                        />
                      ) : (
                        <TextAreaPlaceHolder message="回答は締め切られました" />
                      )}
                      <div className="text-gray-400 text-sm">
                        ** Once you sent, you cant edit here
                      </div>
                    </div>
                  </div>
                  <div className="h-20 flex flex-1 self-center">
                    <AnimatePresence>
                      {!isAnswered && <Pop text="Answer here" type="top" />}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="self-center my-10">
                <Button
                  message="Submit"
                  width="w-60"
                  disabled={!canAnswer}
                  onCLick={handleAnswer}
                  type="submit"
                />
              </div>
            </form>
          )}
        </Transition>
      )}
    </div>
  );
};

export default MultiPlay;
