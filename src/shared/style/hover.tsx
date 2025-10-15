import { cn } from '../utils/cn';

type MeshHoverOptions = {
  className?: string;
};

const meshHoverBase =
  "relative overflow-hidden isolate cursor-pointer transition-colors duration-300 before:absolute before:inset-[-45%] before:-z-10 before:rounded-full before:content-[''] before:bg-[radial-gradient(circle_at_15%_20%,rgba(244,114,182,0.65),transparent_60%),radial-gradient(circle_at_85%_30%,rgba(96,165,250,0.55),transparent_60%),radial-gradient(circle_at_50%_80%,rgba(45,212,191,0.45),transparent_65%)] before:opacity-0 before:transition before:duration-500 before:blur-3xl before:transform before:scale-95 before:pointer-events-none hover:before:opacity-90 hover:before:scale-110 hover:shadow-[0_10px_30px_rgba(56,189,248,0.25)]";

export function meshHover(options?: MeshHoverOptions) {
  const { className } = options ?? {};
  return cn(meshHoverBase, className);
}

export type MeshHoverFn = typeof meshHover;
