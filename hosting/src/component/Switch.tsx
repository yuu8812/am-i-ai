import React from "react";

interface LanguageSwitchProps {
  language: 0 | 1;
  onToggle: () => void;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({
  language,
  onToggle,
}) => {
  return (
    <div
      className={`relative w-40 h-10 flex items-center rounded-full p-1 cursor-pointer transition-colors ${"bg-gray-400"}`}
      onClick={onToggle}
    >
      <div className="absolute flex w-full text-sm justify-between gap-4 opacity-50 text-black">
        <div className="w-1/2 pl-2">EN</div>
        <div className="w-1/2 pr-2">JA</div>
      </div>
      <div
        className={`w-20 h-8 bg-red-700 rounded-full shadow-md text-sm transform transition-transform ${
          language === 1 ? "translate-x-[90%]" : "translate-x-0"
        }`}
      >
        {language === 0 ? (
          <div className="flex items-center justify-center h-full w-full text-white">
            English
          </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full text-white">
            Japanese
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitch;
