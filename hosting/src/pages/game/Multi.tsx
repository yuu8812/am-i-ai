import { useNavigate } from "react-router-dom";
import Transition from "src/animate/Transition";
import useOnlineCheck from "src/api/useOnlineCheck";
import useStartGame from "src/api/useStartGame";
import Box from "src/component/Box";
import Button from "src/component/Button";
import TitleArea from "src/component/TitleArea";
import { delay } from "src/util/delay.util";

const Solo = () => {
  const navigate = useNavigate();

  const { data } = useOnlineCheck();
  const { startGame } = useStartGame();

  const handleClick = async () => {
    const res = await startGame();
    const waitingUserId = res?.waitingUser.id;
    await delay(1000);
    navigate(`waiting/${waitingUserId}`, { replace: true });
  };

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
          <div className="text-white my-4 font-semibold">Game Overview</div>
          <div className="text-slate-100 text-md bg-gray-800 shadow rounded p-4">
            <div>
              Gather four players to start the game: two humans and two AIs.
            </div>
            <div className="">
              Your mission? Identify the other human among you through a series
              of questions. But here’s the twist—keep your humanity hidden and
              act like an AI to fool the other human. At the end of the game,
              it’s time to vote. Will you become the perfect AI?
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="">
              <Button message="Start a new game" onCLick={handleClick} />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default Solo;
