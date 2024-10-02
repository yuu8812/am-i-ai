import React from "react";
import { useParams } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaArrowRight } from "react-icons/fa";
import Transition from "src/animate/Transition";
import useResult from "src/api/useResult";
import Card from "src/component/Card";
import TitleArea from "src/component/TitleArea";
import MatchCard from "src/component/MatchCard";
import useFindMe from "src/api/useFindMe";

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

  const meHumanDetectCurrentRate = data?.result.me.humanDetect.currentRate ?? 0;
  const meHumanDetectPrevRate = data?.result.me.humanDetect.prevRate ?? 0;
  const meHumanNessCurrentRate = data?.result.me.humanNess.currentRate ?? 0;
  const meHumanNessPrevRate = data?.result.me.humanNess.prevRate ?? 0;

  const meHumanDetectRatingChange =
    meHumanDetectCurrentRate - meHumanDetectPrevRate;
  const meHumanNessRatingChange = meHumanNessCurrentRate - meHumanNessPrevRate;

  return (
    <div className="flex flex-1 flex-col">
      <TitleArea title="Result" />
      <Transition>
        <div className="flex flex-col flex-1">
          <div className="h-8"></div>
          {data && (
            <div className="flex gap-4 flex-1 justify-center md:flex-nowrap flex-wrap">
              <div className="md:w-1/2 w-full">
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
              <div className="md:w-1/2 w-full">
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
