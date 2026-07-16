import Bracket from "./Bracket";
import clsx from "clsx";

export default function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Bracket
      as="p"
      className={clsx("mono-label text-current/80", className)}
    >
      {children}
    </Bracket>
  );
}
