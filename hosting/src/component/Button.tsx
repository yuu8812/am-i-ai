import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Button = ({
  message,
  disabled = false,
  onCLick,
}: {
  message: string;
  disabled?: boolean;
  onCLick?: () => void | Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async () => {
    setIsLoading(true);
    try {
      onCLick && (await onCLick());
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <button
      disabled={disabled}
      className={`${
        disabled ? "bg-gray-300" : "bg-gradient-to-r from-red-500 to-red-700"
      } flex-1 h-12 relative flex items-center justify-center font-bold text-white rounded-full shadow-md group`}
    >
      <span
        className={`${
          disabled ? "" : "group-hover:scale-100 bg-red-200"
        } absolute inset-0 flex items-center justify-center w-full rounded-full h-full text-white transition-all duration-300 transform scale-0 group-hover:scale-100 ease`}
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`${
          disabled ? "" : "hover:text-black"
        } transition-all flex flex-1 relative  h-12 items-center justify-center px-8 gap-0`}
      >
        <div className="animate-spin relative -left-2">
          {isLoading && <AiOutlineLoading3Quarters size={14} />}
        </div>
        {message}
      </button>
    </button>
  );
};

export default Button;
