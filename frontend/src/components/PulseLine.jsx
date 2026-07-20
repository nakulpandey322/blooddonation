export default function PulseLine({ className = "", stroke = "#C81E3A" }) {
  return (
    <svg
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0 40 L180 40 L210 40 L230 10 L255 70 L280 40 L340 40 L365 25 L385 40 L1200 40"
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        className="animate-ecg"
      />
    </svg>
  );
}
