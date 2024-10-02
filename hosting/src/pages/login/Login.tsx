import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Transition from "src/animate/Transition";
import useCreateUser from "src/api/useCreateUser";
import useFindMe from "src/api/useFindMe";
import Card from "src/component/Card";
import GoogleSignUpButton from "src/component/GoogleSignUpButton";
import TitleArea from "src/component/TitleArea";
import { auth } from "src/firebase/config";

const Login = () => {
  const { createUser } = useCreateUser();
  const { data, error, mutate } = useFindMe();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    const user = await signInWithPopup(auth, new GoogleAuthProvider());
    const me = await mutate();
    if (!me) await createUser({ name: user.user.displayName ?? "unknown" });
  };

  const signIn = async () => {
    if (!data || error) {
      await handleSignIn().catch(() => {
        toast.error("Login failed");
      });
      toast.success("Login succeed");
    }
    navigate("/game/multi");
  };
  return (
    <div className="flex flex-1 flex-col">
      <TitleArea title="Login" />
      <Transition>
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="h-fit w-fit">
            <Card>
              <div className="h-80 w-80 lg:w-[500px] flex flex-1 flex-col items-center justify-center">
                <div className="w-[80%]">
                  <GoogleSignUpButton onClick={signIn} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default Login;
