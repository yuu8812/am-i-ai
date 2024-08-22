import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";
import Transition from "src/animate/Transition";
import useCreateUser from "src/api/useCreateUser";
import Card from "src/component/Card";
import TitleArea from "src/component/TitleArea";
import { auth } from "src/firebase/config";

const Home = () => {
  const { createUser } = useCreateUser();

  const signIn = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
    await createUser();
  };

  return (
    <div className="flex flex-1 flex-col">
      <TitleArea title="Home" />
      <Transition>
        {/* <div className="" onClick={signIn}>
          button
        </div> */}
        <div className="pt-2"></div>
        <div className="flex flex-1 gap-4">
          <Card>
            <div className="flex flex-col flex-1 p-2">
              <div className="text-lg font-semibold text-gray-400">
                New game!!
              </div>
              <div className="text-sm pt-2 text-gray-400">
                Start a new game and test your AI detection skills
              </div>
              <div className="flex gap-10 flex-1 items-center justify-center">
                {/* <Link
                  to={`game/solo`}
                  className="relative w-60 h-24 shadow-lg text-sm rounded flex items-center justify-center bg-gradient-to-r from-red-400 to-red-600 text-white font-bold hover:scale-105 hover:shadow-2xl transition transform duration-300 ease-in-out"
                >
                  <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-0 group-hover:translate-y-0 ease-in-out">
                    🎮
                    <span className="pr-2" />
                    Solo player mode
                  </span>
                </Link> */}
                {/* <button onClick={signIn}>click here</button> */}
                <Link
                  to={`game/multi`}
                  className="relative w-60 h-24 shadow-lg text-sm rounded flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:scale-105 hover:shadow-2xl transition transform duration-300 ease-in-out"
                >
                  <span className="absolute text-base inset-0 flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-0 group-hover:translate-y-0 ease-in-out">
                    🎮
                    <span className="pr-2" />
                    Start a new game
                  </span>
                </Link>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex flex-1 flex-col p-2">
              <div className="text-lg font-semibold text-gray-400">
                Human-ness
              </div>
              <div className="text-sm pt-2 text-gray-400">
                This is how you are likes a human
              </div>
              <div className="flex items-center justify-center flex-1">
                <div className="text-6xl text-blue-500 font-semibold">45%</div>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex flex-1 gap-4 pt-4">
          <Card>
            <div className="flex flex-1 flex-col p-2">
              <div className="text-lg font-semibold text-gray-400">AI-ness</div>
              <div className="text-sm pt-2 text-gray-400">
                This is how you are likes a AI
              </div>
              <div className="flex items-center justify-center flex-1">
                <div className="text-6xl text-blue-500 font-semibold">45%</div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex flex-1 flex-col p-2">
              <div className="text-lg font-semibold text-gray-400">
                AI Detection rate
              </div>
              <div className="text-sm pt-2 text-gray-400">
                This is the probability of you detecting AI-generated text
              </div>
              <div className="flex items-center justify-center flex-1">
                <div className="text-6xl text-blue-500 font-semibold">45%</div>
              </div>
            </div>
          </Card>
        </div>
      </Transition>
    </div>
  );
};

export default Home;
