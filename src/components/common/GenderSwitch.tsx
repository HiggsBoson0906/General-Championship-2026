interface GenderSwitchProps {
  isMale: boolean;
  setIsMale: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GenderSwitch({
  isMale,
  setIsMale,
}: GenderSwitchProps) {
  const accentColor = isMale ? "#00e5d4" : "#f472b6";

  return (
    <button
      type="button"
      onClick={() => setIsMale(!isMale)}
      role="switch"
      aria-checked={isMale}
      aria-label="Select gender"
      style={{
        color: accentColor,
        borderColor: accentColor,
      }}
      className="flex min-w-[180px] items-center justify-between rounded-[40px] border-2 bg-transparent px-[10px] py-[5px] text-[15px] font-semibold transition-colors duration-300 ease-in-out"
    >
      {isMale ? (
        <>
          <span className="text-inherit">♂</span>
          <span className="text-inherit">MALE</span>
          <span className="h-[18px] w-[18px] shrink-0 rounded-full border-2 border-[#00e5d4] bg-[#00e5d4]" />
        </>
      ) : (
        <>
          <span className="h-[18px] w-[18px] shrink-0 rounded-full border-2 border-[#f472b6] bg-[#f472b6]" />
          <span className="text-inherit">FEMALE</span>
          <span className="text-inherit">♀</span>
        </>
      )}
    </button>
  );
}