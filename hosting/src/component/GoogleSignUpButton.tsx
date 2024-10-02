import React from "react";
import { FC } from "react";
import { useCallback } from "react";
import { FcGoogle } from "react-icons/fc";

interface GoogleSignUpButtonProps {
  onClick: () => void;
}

const GoogleSignUpButton: FC<GoogleSignUpButtonProps> = ({ onClick }) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center font-bold w-full p-3 text-sm transition-all text-white bg-slate-800 border border-gray-300 rounded-lg shadow-sm hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <FcGoogle className="w-5 h-5 mr-2" />
      Start with Google
    </button>
  );
};

export default GoogleSignUpButton;
