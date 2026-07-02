import clsx from "clsx";

/** Constant-speed ticker, pauses on hover, opacity-only under
 * reduced-motion (handled globally via CSS). */
export default function Marquee({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={clsx("overflow-hidden whitespace-nowrap", className)}>
      <div className="marquee-track inline-flex w-max">
        {[0, 1].map((i) => (
          <span key={i} className="display-type flex shrink-0 items-center px-4 text-3xl sm:text-5xl">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
