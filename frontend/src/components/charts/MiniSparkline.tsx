type MiniSparklineProps = {
  data: number[];
  positive?: boolean;
};

export function MiniSparkline({ data, positive = true }: MiniSparklineProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 48 - ((value - min) / Math.max(max - min, 1)) * 42;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="sparkline" viewBox="0 0 100 54" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        fill="none"
        stroke={positive ? "var(--success)" : "var(--danger)"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        points={points}
      />
    </svg>
  );
}
