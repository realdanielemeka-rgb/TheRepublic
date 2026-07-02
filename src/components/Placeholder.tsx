import clsx from "clsx";

/** Designed placeholder for any image/media slot: a blue or ink field with
 * a mono label describing what belongs there, so the site is presentable
 * before real assets land. Never a broken image, never lorem ipsum. */
export default function Placeholder({
  label,
  tone = "republic",
  className,
  ratio = "aspect-[4/3]",
}: {
  label: string;
  tone?: "republic" | "ink";
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={clsx(
        "flex items-end overflow-hidden rounded-[var(--radius-card)] p-5",
        ratio,
        tone === "republic"
          ? "bg-republic text-paper"
          : "bg-ink text-paper",
        className
      )}
    >
      <span className="mono-label opacity-80">{label}</span>
    </div>
  );
}
