/** Initial-monogram placeholder on Republic Blue, standing in for team
 * photography until the shoot happens. AI-generated portraits forbidden. */
export default function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      role="img"
      aria-label={`Portrait placeholder for ${name}`}
      className="flex aspect-square w-full items-center justify-center rounded-[var(--radius-card)] bg-republic"
    >
      <span className="display-type text-4xl text-paper">{initials}</span>
    </div>
  );
}
