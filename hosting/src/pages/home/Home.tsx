import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase/config";

const provider = new GoogleAuthProvider();

const Home = () => {
  const handleLogin = async () => {
    const response = await signInWithPopup(auth, provider);
    console.log(response.user);
  };
  return (
    <div>
      <button className="" onClick={handleLogin}>
        ログインする
      </button>
    </div>
  );
};

export default Home;
