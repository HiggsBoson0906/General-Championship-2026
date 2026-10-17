interface NoMatchesProps {
  image: string;
  title: string;
  description: string;
}

export default function NoMatches({
  image,
  title,
  description,
}: NoMatchesProps) {
  return (
    <div className="box-border flex w-full max-w-[900px] flex-col items-center rounded-3xl border border-[rgba(var(--accent-rgb),0.4)] bg-[rgba(var(--accent-rgb),0.09)] px-6 py-[38px] text-center text-[#f8fafc] shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-[background-color,border-color] duration-300 ease-in-out max-[600px]:min-h-[280px] max-[600px]:rounded-2xl max-[600px]:px-[18px] max-[600px]:py-7">
      <div className="mb-[18px] flex h-[100px] items-center justify-center text-[var(--accent)] [filter:drop-shadow(0_0_14px_rgba(34,211,238,0.12))]">
        <img
          className="h-[inherit]"
          src={ image }
          loading="lazy"
        />
      </div>

      {title && (
        <h2 className="mb-4 mt-1 text-[clamp(20px,2.2vw,25px)] font-[650] tracking-[-0.5px] text-white">
          {title}
        </h2>
      )}

      {description && (
        <p className="m-0 max-w-[500px] text-base leading-[1.7] text-[#cbd5e1] max-[600px]:text-sm">
          {description}
        </p>
      )}
    </div>
  );
}