export default function ConnectionLine() {
  return (
    <div className="relative w-[574px] md:w-[840px] h-[23px]" aria-hidden="true">
      {/* Circle at the start - CSS で描画して潰れを防止 */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-soypoy-accent" />
      {/* Horizontal line */}
      <svg
        width="840"
        height="23"
        viewBox="0 0 840 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="none"
        role="none"
      >
        <line
          x1="0"
          y1="11.5"
          x2="840"
          y2="11.5"
          stroke="black"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
