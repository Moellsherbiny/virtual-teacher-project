const Robot = () => {
  return (
    <div className="relative w-[170px] h-[170px] flex items-center justify-center">
      {/* Glow Aura */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/10 blur-xl animate-pulse"></div>

      {/* Robot Shell */}
      <div
        className="relative w-[140px] h-[140px] rounded-[35px]
        bg-gradient-to-b from-white to-gray-200 dark:from-gray-800 dark:to-gray-900
        border border-gray-300/30 dark:border-white/10 shadow-xl
        flex items-center justify-center animate-float"
      >
        {/* Face Screen */}
        <div
          className="w-[105px] h-[85px]
          bg-gradient-to-b from-[#0d1b2a] to-[#1b263b] dark:from-[#0a0f1a] dark:to-[#0a0f1a]
          rounded-2xl shadow-inner border border-blue-400/10
          flex items-center justify-center"
        >
          {/* Eyes */}
          <div className="flex gap-6">
            <div className="w-5 h-5 rounded-full bg-cyan-300 eye-glow animate-eye" />
            <div className="w-5 h-5 rounded-full bg-cyan-300 eye-glow animate-eye delay-150" />
          </div>
        </div>

        {/* Antenna Base */}
        <div
          className="absolute -top-5  -translate-x-1/2 w-[16px] h-[25px]
          bg-gradient-to-b from-gray-300 to-gray-500 dark:from-gray-700 dark:to-gray-600
          rounded-lg shadow-md animate-antenna"
        />

        {/* Antenna Light */}
        <div
          className="absolute -top-8  -translate-x-1/2
          w-[14px] h-[14px] bg-pink-400 rounded-full shadow-[0_0_10px_5px_rgba(255,80,150,0.6)]
          animate-pulseSoft"
        />
      </div>
    </div>
  );
};

export default Robot;
