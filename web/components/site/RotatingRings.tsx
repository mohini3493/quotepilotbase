export default function RotatingRings() {
  return (
    <>
      {/* Outer ring */}
      <svg
        className="pointer-events-none absolute left-1/2 top-28 -z-10 w-[900px] -translate-x-1/2 animate-spin-slow opacity-30"
        viewBox="0 0 920 920"
      >
        <circle
          cx="460"
          cy="460"
          r="450"
          fill="none"
          stroke="black"
          strokeOpacity="0.15"
          strokeWidth="0.6"
        />
        {Array.from({ length: 8 }).map((_, i) => (
          <circle
            key={i}
            cx="460"
            cy="10"
            r="3"
            fill="black"
            transform={`rotate(${i * 45} 460 460)`}
          />
        ))}
      </svg>

      {/* Inner ring */}
      <svg
        className="pointer-events-none absolute left-1/2 top-36 -z-10 w-[700px] -translate-x-1/2 animate-spin-slower opacity-20"
        viewBox="0 0 920 920"
      >
        <circle
          cx="460"
          cy="460"
          r="320"
          fill="none"
          stroke="black"
          strokeOpacity="0.15"
          strokeWidth="0.6"
        />
      </svg>
    </>
  );
}
