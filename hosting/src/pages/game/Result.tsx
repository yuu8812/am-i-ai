import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaArrowRight } from "react-icons/fa";
import Transition from "src/animate/Transition";
import useResult from "src/api/useResult";
import Card from "src/component/Card";
import TitleArea from "src/component/TitleArea";
import MatchCard from "src/component/MatchCard";
import useFindMe from "src/api/useFindMe";
import Button from "src/component/Button";
import useStartGame from "src/api/useStartGame";
import { localStorageUtil } from "src/util/localStorage.util";
import { delay } from "src/util/delay.util";

const renderRatingChange = (ratingChange: number) => {
  if (ratingChange === 0) return <span>No change in points</span>;

  const isPositive = ratingChange > 0;
  const colorClass = isPositive ? "text-green-500" : "text-red-500";
  const Icon = isPositive ? FaArrowUp : FaArrowDown;

  return (
    <div className={`flex items-center ${colorClass}`}>
      <Icon className="mr-2" />
      <span>{`${isPositive ? "+" : ""}${ratingChange} points`}</span>
    </div>
  );
};

const Result = () => {
  const { gameUserId } = useParams();
  const { data } = useResult(gameUserId as string);
  const { data: me } = useFindMe();
  const navigate = useNavigate();
  const { startGame } = useStartGame();
  const { getItem } = localStorageUtil();
  const language = getItem("game-language") as 0 | 1;

  const meHumanDetectCurrentRate = data?.result.me.humanDetect.currentRate ?? 0;
  const meHumanDetectPrevRate = data?.result.me.humanDetect.prevRate ?? 0;
  const meHumanNessCurrentRate = data?.result.me.humanNess.currentRate ?? 0;
  const meHumanNessPrevRate = data?.result.me.humanNess.prevRate ?? 0;

  const meHumanDetectRatingChange =
    meHumanDetectCurrentRate - meHumanDetectPrevRate;
  const meHumanNessRatingChange = meHumanNessCurrentRate - meHumanNessPrevRate;

  const handleClick = async () => {
    const res = await startGame({ language: language === 0 ? "en" : "ja" });
    const waitingUserId = res?.waitingUser.id;
    await delay(1000);
    navigate(`/game/multi/waiting/${waitingUserId}`);
  };

  return (
    <div className="flex flex-1 flex-col">
      <TitleArea title="Result" />
      <Transition>
        <div className="flex flex-col flex-1">
          <div className="h-8"></div>
          {data && (
            <div className="flex gap-4 flex-1 justify-center lg:flex-nowrap flex-wrap">
              <div className="lg:w-1/2 w-full">
                <Card>
                  <div className="p-4 h-52 text-white">
                    <div className="text-2xl font-bold">
                      {data.result?.me.status === "success"
                        ? "You detected the human!"
                        : "You failed to detect the human."}
                    </div>
                    <div className="text-sm py-1 text-gray-400 font-bold">
                      Your human detection rate
                    </div>
                    <div className="flex text-lg font-bold gap-2 items-center py-2">
                      <div className="">{meHumanDetectPrevRate}</div>
                      <div className="">
                        <FaArrowRight size={12} />
                      </div>
                      <div className="">{meHumanDetectCurrentRate}</div>
                    </div>
                    <div className="text-lg">
                      {renderRatingChange(meHumanDetectRatingChange)}
                    </div>
                  </div>
                </Card>
              </div>
              <div className="lg:w-1/2 w-full">
                <Card>
                  <div className="p-4 h-52 text-white">
                    <div className="text-2xl font-bold">
                      {data.result?.opponent.status === "success"
                        ? "Opponent detected that you are the human!"
                        : data.result.opponent.status === "empty"
                        ? "Opponent doesn't choose any user"
                        : "Opponent failed to detect that you are the human."}
                    </div>
                    <div className="text-sm py-1 text-gray-400 font-bold">
                      Your human-ness rate
                    </div>
                    <div className="flex text-lg font-bold gap-2 items-center py-2">
                      <div className="">{meHumanNessPrevRate}</div>
                      <div className="">
                        <FaArrowRight size={12} />
                      </div>
                      <div className="">{meHumanNessCurrentRate}</div>
                    </div>
                    <div className="text-lg">
                      {renderRatingChange(meHumanNessRatingChange)}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
          <div className="w-full h-80 flex flex-1 overflow-hidden mt-4">
            <Card>
              <div className="flex flex-1 my-10 px-4 items-center justify-center relative">
                <div className="absolute bg-red-100/40 h-40 w-40 animate-pulse rounded-full blur-sm"></div>
                <div className="absolute bg-red-900/40 h-52 w-52 animate-pulse rounded-full blur-sm"></div>
                <div className="absolute bg-red-400/40 h-60 w-60 animate-pulse rounded-full blur-sm"></div>
                <div className="lg:w-[50%] w-full">
                  <Button message="Play Again" onCLick={handleClick} />
                </div>
              </div>
            </Card>
          </div>

          <div className="py-4 flex">
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
      </Transition>
    </div>
  );
};

export default Result;
