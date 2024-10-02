import { useNavigate } from "react-router-dom";
import Transition from "src/animate/Transition";
import useFindMe from "src/api/useFindMe";
import Button from "src/component/Button";
import Robot from "src/component/Robot";

const Home = () => {
  const { data, error } = useFindMe();
  const navigate = useNavigate();

  const signIn = async () => {
    if (!data || error) {
      navigate("/login");
    } else {
      navigate("/game/multi");
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="fixed lg:bottom-6 lg:right-16 z-50 scale-50 bottom-1 right-1">
        <Robot />
      </div>
      <Transition>
        <div className="bg-gray-900 min-h-screen text-white">
          <section className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-6xl font-extrabold mb-6">
                Identify Humans or AIs
              </h1>
              <p className="text-xl mb-4">
                Can you tell who's human and who's an AI? Test your skills in a
                game of deception and deduction.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                Play with both human and AI players, answer questions, and see
                if you can correctly identify your fellow humans.
              </p>
              <div className="flex items-center justify-center">
                <div className="w-80">
                  <Button message="Get Started!" onCLick={signIn} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </Transition>
    </div>
  );
};

export default Home;
