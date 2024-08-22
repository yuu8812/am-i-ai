import Transition from "src/animate/Transition";
import useFindMe from "src/api/useFindMe";
import TitleArea from "src/component/TitleArea";
import Counter from "src/component/Counter";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { delay } from "src/util/delay.util";
import { asyncFunc } from "src/util/asyncFunc.util";
import toast from "react-hot-toast";
import DefaultToast from "src/toast/DefaultToast";
import MatchCard from "src/component/MatchCard";
import useMatching from "src/api/useMatching";

const Wait = () => {
  const { waitingUserId } = useParams();
  const { data: me } = useFindMe();
  const navigate = useNavigate();
  const [gameDataLength, setGameDataLength] = useState<number | undefined>(0);

  const onceRef = useRef(false);

  const handleError = useCallback(() => {
    navigate("/game/multi", { replace: true });
    toast.error(<DefaultToast message="Something went long. Please retry" />);
  }, [navigate]);

  const { data: gameData } = useMatching({
    onErr: handleError,
    waitingUserId: waitingUserId ?? "",
  });

  const memoedGameDataLength = useMemo(
    () => gameData?.gameUsers?.length,
    [gameData]
  );

  const handleNavigate = useCallback(async () => {
    if (onceRef.current) return;
    await delay(1000);
    setGameDataLength(memoedGameDataLength);
    await delay(1000);
    navigate(`/game/multi/${gameData?.gameUserId}`, { replace: true });
    toast.success(
      <DefaultToast twClassName="w-60" message="Game started!!" />,
      {
        id: "game_start_succeed_modal",
      }
    );
    onceRef.current = true;
  }, [navigate, memoedGameDataLength, gameData]);

  useEffect(() => {
    if (!memoedGameDataLength) return;
    if (memoedGameDataLength === 2) {
      asyncFunc(handleNavigate);
    }
  }, [memoedGameDataLength, handleNavigate]);

  const opponent = gameData?.gameUsers?.find((user) => user.userId !== me?.id);

  return (
    <div className="flex flex-1 flex-col">
      <TitleArea title="Now you are waiting for a match" />
      <Transition>
        <div className="text-slate-400">please wait for a while...</div>
        <div className="py-4">
          <Counter />
        </div>
        {me && gameData && (
          <div className="flex flex-1">
            <div className="flex flex-1 items-center justify-around p-4 gap-10">
              <div className="max-w-[500px] w-40 h-[400px] m-4 flex flex-1">
                <MatchCard iconUrl={me.iconUrl} name={me.name} rate="100" />
              </div>
              <div className="w-20 h-40 flex items-center justify-center">
                <img
                  src="/vs.png"
                  width={100}
                  height={100}
                  className="object-cover"
                  alt="vs_icon"
                />
              </div>
              <div className="max-w-[500px] w-40 h-[400px] m-4 flex flex-1">
                <MatchCard
                  iconUrl={opponent?.iconUrl}
                  name={opponent?.userName}
                  rate="100"
                  meOrYou="you"
                  searching={gameDataLength !== 2}
                />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </div>
  );
};

export default Wait;
