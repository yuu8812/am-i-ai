import { memo, useCallback, useEffect, useState } from "react";
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

const Solo = () => {
  const [language, setLanguage] = useState<0 | 1>(0);
  const navigate = useNavigate();

  const { data } = useOnlineCheck();
  const { startGame } = useStartGame();
  const { data: me } = useFindMe();

  const handleClick = async () => {
    const res = await startGame({ language: language === 0 ? "en" : "ja" });
    const waitingUserId = res?.waitingUser.id;
    await delay(1000);
    navigate(`waiting/${waitingUserId}`);
  };

  const speech = useCallback(
    ({
      text,
      language = "en-US",
    }: {
      text: string;
      language: "en-US" | "ja-JP";
    }) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      const voice = voices.find((voice) => voice.lang === language);
      if (voice) {
        utterance.voice = voice;
      }
      window.speechSynthesis.speak(utterance);
    },
    []
  );

  useEffect(() => {
    // speech({ text: "Welcome to the game", language: "en-US" });
  }, [speech]);

  if (!data) return null;

  return (
    <div className="flex flex-1 flex-col">
      <TitleArea title="Game" />
      <Transition>
        <div className="p-2 flex flex-1 flex-col">
          <div className="flex gap-2 h-40 justify-between">
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
            <div className="flex flex-1 gap-2">
              <div className="flex flex-col w-1/3 justify-center gap-10">
                <div className="flex">
                  <div className="h-10 w-full">
                    <Card>
                      <div className="flex items-center gap-6 flex-1">
                        <div className="text-white p-2 text-sm">Language</div>
                        <div className="flex flex-1 items-center justify-center">
                          <LanguageSwitch
                            language={language}
                            onToggle={() =>
                              setLanguage((prev) => (prev === 0 ? 1 : 0))
                            }
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex flex-1 overflow-hidden">
                    <Card>
                      <div className="flex flex-1 m-20 items-center justify-center relative">
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
                    humanDetectionRate={me.rates.humanDetection[0].rate}
                    aiNessRate={me.rates.aiNess[0].rate}
                    chart
                    chartData={{
                      aiNess: me.rates.aiNess
                        .map((rate) => rate.rate)
                        .reverse(),
                      humanDetect: me.rates.humanDetection
                        .map((rate) => rate.rate)
                        .reverse(),
                      dates: me.rates.aiNess
                        .map((rate) => rate.createdAt)
                        .reverse(),
                    }}
                    humanDetectionRank={me.rates.humanDetectionRank}
                    aiNessRank={me.rates.aiNessRank}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="text-white my-4 font-semibold">Game Overview</div>
            <Card>
              <div className="text-slate-100 text-md bg-gray-800 shadow rounded p-4">
                <div>
                  Gather four players to start the game: two humans and two AIs.
                </div>
                <div className="">
                  Your mission? Identify the other human among you through a
                  series of questions. But here’s the twist—keep your humanity
                  hidden and act like an AI to fool the other human. At the end
                  of the game, it’s time to vote. Will you become the perfect
                  AI?
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
