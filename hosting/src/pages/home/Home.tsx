import { useNavigate } from "react-router-dom";
import Transition from "src/animate/Transition";
import useFindMe from "src/api/useFindMe";
import Button from "src/component/Button";

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
      <Transition>
        <div className="bg-gray-900 min-h-screen text-white">
          <section className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-6xl font-extrabold mb-6">
                Measure Human-ness &<br /> Human Detect Sense
              </h1>
              <p className="text-xl mb-4">
                Discover the power of AI and Human Detection through intelligent
                response analysis.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                Accurately detect the AI-like behavior and human accuracy in any
                system or conversation.
              </p>
              <div className="flex items-center justify-center">
                <div className="w-80">
                  <Button message="Get Start!" onCLick={signIn} />
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
