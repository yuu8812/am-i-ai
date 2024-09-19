import { MouseEvent, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Button = ({
  message,
  disabled = false,
  onCLick,
  width = "w-full",
  type = "button",
}: {
  message: string;
  width?: string;
  disabled?: boolean;
  type?: "submit" | "button";
  onCLick?: () => void | Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
      type={type}
      onClick={handleClick}
      className={`${
        disabled || isLoading
          ? "bg-gray-300 opacity-80"
          : "bg-gradient-to-r from-red-500 to-red-700"
      } flex-1 h-12 relative flex items-center justify-center font-bold text-white shadow-md group ${width}`}
    >
      <span
        className={`${
          disabled || isLoading
            ? "bg-gray-50 opacity-80"
            : "group-hover:scale-100 bg-red-50"
        } absolute inset-0 flex items-center justify-center w-full h-full text-white transition-all duration-300 transform scale-0 group-hover:scale-100 ease`}
      />
      <div
        className={`${
          disabled || isLoading ? "" : "hover:text-black"
        } transition-all flex flex-1 relative  h-12 items-center justify-center pl-4 pr-8 gap-0`}
      >
        <div className="relative w-2">
          {isLoading && (
            <AiOutlineLoading3Quarters
              size={16}
              className="animate-spin text-gray-500"
            />
          )}
        </div>
        <div className={`ml-4 ${disabled || isLoading ? "text-gray-400" : ""}`}>
          {message}
        </div>
      </div>
    </button>
  );
};

export default Button;
