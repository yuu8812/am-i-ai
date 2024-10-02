import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Transition from "src/animate/Transition";
import useFindMe from "src/api/useFindMe";
import useOnlineCheck from "src/api/useOnlineCheck";
import useStartGame from "src/api/useStartGame";
import Box from "src/component/Box";
import Button from "src/component/Button";
import Card from "src/component/Card";
import MatchCard from "src/component/MatchCard";
import LanguageSwitch from "src/component/Switch";
import TitleArea from "src/component/TitleArea";
import { delay } from "src/util/delay.util";
import { localStorageUtil } from "src/util/localStorage.util";

const Solo = () => {
  const [language, setLanguage] = useState<0 | 1>(0);
  const navigate = useNavigate();

  const { data } = useOnlineCheck();
  const { startGame } = useStartGame();
  const { data: me } = useFindMe();
  const { getItem, setItem } = localStorageUtil();

  const handleClick = async () => {
    const res = await startGame({ language: language === 0 ? "en" : "ja" });
    const waitingUserId = res?.waitingUser.id;
    await delay(1000);
    navigate(`waiting/${waitingUserId}`);
  };

  const setup = useCallback(() => {
    const language = getItem("game-language");
    language && setLanguage(Number(language) as 0 | 1);
  }, [getItem]);

  useEffect(() => {
    setup();
  }, [setup]);

  if (!data) return null;

  return (
    <div className="flex flex-1 flex-col">
      <TitleArea title="Game" />
      <Transition>
        <div className="p-2 flex flex-1 flex-col">
          <div className="lg:flex-nowrap gap-2 justify-between flex flex-wrap">
            <Box
              title="Online users"
              message={data.onlineUsersCount.toString()}
            />
            <Box
              title="Waiting users"
              message={data.waitingUsersCount.toString()}
            />
            <Box
              title="Active games"
              message={data.activeGameCount.toString()}
            />
          </div>
          <div className="flex flex-col flex-1">
            <div className="text-white my-4 font-semibold">Game Setting</div>
            <div className="flex flex-1 gap-2 lg:flex-row flex-col">
              <div className="flex flex-col lg:w-1/3 w-full justify-center gap-10 ">
                <div className="flex">
                  <div className="h-10 w-full">
                    <Card>
                      <div className="flex items-center gap-6 flex-1">
                        <div className="text-white p-2 text-sm">Language</div>
                        <div className="flex flex-1 items-center justify-center">
                          <LanguageSwitch
                            language={language}
                            onToggle={() => {
                              setLanguage((prev) => {
                                const current = prev === 0 ? 1 : 0;
                                setItem("game-language", current);
                                return current;
                              });
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex flex-1 overflow-hidden">
                    <Card>
                      <div className="flex flex-1 my-10 px-4 items-center justify-center relative">
                        <div className="absolute bg-red-100/40 h-40 w-40 animate-pulse rounded-full blur-sm"></div>
                        <div className="absolute bg-red-900/40 h-52 w-52 animate-pulse rounded-full blur-sm"></div>
                        <div className="absolute bg-red-400/40 h-60 w-60 animate-pulse rounded-full blur-sm"></div>
                        <Button
                          message="Start a new game"
                          onCLick={handleClick}
                        />
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
              <div className="flex flex-1">
                {me && (
                  <MatchCard
                    iconUrl={me.iconUrl}
                    name={me.name}
                    humanDetectRate={me.rates.humanDetection[0].rate}
                    humanNessRate={me.rates.humanNess[0].rate}
                    chart
                    chartData={{
                      humanNess: me.rates.humanNess
                        .map((rate) => rate.rate)
                        .reverse(),
                      humanDetect: me.rates.humanDetection
                        .map((rate) => rate.rate)
                        .reverse(),
                      dates: me.rates.humanNess
                        .map((rate) => rate.createdAt)
                        .reverse(),
                    }}
                    humanDetectionRank={me.rates.humanDetectionRank}
                    humanNessRank={me.rates.humanNessRank}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="text-white my-4 font-semibold">Game Overview</div>
            <Card>
              <div className="text-slate-100 text-md rounded-lg p-6">
                <div className="flex flex-col gap-6">
                  <p className="border-l-4 border-blue-500 pl-4 text-lg">
                    <span>
                      <b>1: Waiting for matching</b>: The game consists of 2
                      human players and 2 AI players.
                    </span>
                  </p>
                  <p className="border-l-4 border-green-500 pl-4 text-lg">
                    <span>
                      <b>2: Answering questions</b>: Each player answers
                      questions. AI players act as if they are human, trying to
                      deceive the human players.
                    </span>
                  </p>
                  <p className="border-l-4 border-yellow-500 pl-4 text-lg">
                    <span>
                      <b>2: Identifying the humans</b>: After the questions, you
                      guess who the other human players are and vote. The key is
                      whether you can correctly identify the humans.
                    </span>
                  </p>
                  <p className="border-l-4 border-red-500 pl-4 text-lg">
                    <span>
                      <b>4: Checking the results</b>: In the final results, each
                      player's guesses and true identities are revealed. Your
                      rating will change based on the outcome. If you
                      successfully identify the other humans or prove your own
                      humanity, your rating will increase or decrease
                      accordingly.
                    </span>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default Solo;
