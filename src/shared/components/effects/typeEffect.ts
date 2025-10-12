import { useEffect, useMemo, useReducer, useRef } from "react";

export type UseTypingEffectOptions = {
  words: string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  delayBetweenWords?: number;
  loop?: boolean;
  startDelay?: number;
  caret?: boolean;
  jitter?: number;
};

export type UseTypingEffectReturn = {
  text: string;
  isTyping: boolean;
  isDeleting: boolean;
  wordIndex: number;
  caretChar: string;
};

function usePrefersReducedMotion() {
  const get = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  return !!get();
}

function splitGraphemes(str: string): string[] {
  type Segment = { segment: string };
  type Segmenter = new (
    locales?: string | string[] | undefined,
    options?: { granularity?: "grapheme" | "word" | "sentence" }
  ) => { segment(input: string): Iterable<Segment> };

  const SegmenterCtor: Segmenter | undefined = (Intl as unknown as {
    Segmenter?: Segmenter;
  }).Segmenter;

  if (typeof SegmenterCtor === "function") {
    const seg = new SegmenterCtor(undefined, { granularity: "grapheme" });
    const out: string[] = [];
    for (const s of seg.segment(str)) out.push(s.segment);
    return out;
  }
  return Array.from(str);
}

type Phase = "typing" | "pausing" | "deleting" | "idle";

type State = {
  text: string;
  index: number;
  phase: Phase;
};

type Action =
  | { type: "NEXT_CHAR"; next: string }
  | { type: "PREV_CHAR"; next: string }
  | { type: "SET_PHASE"; phase: Phase }
  | { type: "NEXT_WORD" }
  | { type: "RESET_TEXT" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "NEXT_CHAR":
      return { ...state, text: action.next, phase: "typing" };
    case "PREV_CHAR":
      return { ...state, text: action.next, phase: "deleting" };
    case "SET_PHASE":
      return { ...state, phase: action.phase };
    case "NEXT_WORD":
      return { text: "", index: state.index + 1, phase: "typing" };
    case "RESET_TEXT":
      return { ...state, text: "" };
    default:
      return state;
  }
}

export function useTypingEffect(options: UseTypingEffectOptions): UseTypingEffectReturn {
  const {
    words,
    typingSpeed = 80,
    deleteSpeed = 40,
    delayBetweenWords = 1200,
    loop = true,
    startDelay = 0,
    caret = true,
    jitter = 0.15,
  } = options;

  const reduced = usePrefersReducedMotion();
  const safeWords = words?.length ? words : [""];
  const [state, dispatch] = useReducer(reducer, {
    text: "",
    index: 0,
    phase: startDelay > 0 ? "idle" : "typing",
  });

  const currentWord = useMemo(() => {
    const i = state.index % safeWords.length;
    return safeWords[i] ?? "";
  }, [state.index, safeWords]);

  const parts = useMemo(() => splitGraphemes(currentWord), [currentWord]);

  const raf = useRef<number | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAll = () => {
    if (raf.current != null) cancelAnimationFrame(raf.current);
    if (timeout.current != null) clearTimeout(timeout.current);
    raf.current = null;
    timeout.current = null;
  };

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) clearAll();
      else tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    clearAll();
    if (reduced) {
      // In reduced motion, just jump to the full word once
      dispatch({ type: "RESET_TEXT" });
      dispatch({ type: "SET_PHASE", phase: "typing" });
      dispatch({ type: "NEXT_CHAR", next: currentWord });
      dispatch({ type: "SET_PHASE", phase: "pausing" });
      return;
    }
    if (state.phase === "idle" && startDelay > 0) {
      timeout.current = setTimeout(() => {
        dispatch({ type: "SET_PHASE", phase: "typing" });
        tick();
      }, startDelay);
      return () => clearAll();
    }
    // Ensure we render at least the first character so users see immediate progress
    if (!reduced && state.text.length === 0 && parts.length > 0) {
      dispatch({ type: "NEXT_CHAR", next: parts[0] });
    }
    tick();
    return () => clearAll();
  }, [reduced, startDelay, currentWord]);
  const tick = () => {
    clearAll();
    if (reduced) return;

    const charCount = splitGraphemes(state.text).length;
    const total = parts.length;

    const rand = (base: number) => {
      const r = 1 + (Math.random() * 2 - 1) * Math.max(0, Math.min(jitter, 0.6));
      return Math.max(10, Math.round(base * r));
    };

    if (state.phase === "typing") {
      if (charCount < total) {
        timeout.current = setTimeout(() => {
          const next = parts.slice(0, charCount + 1).join("");
          dispatch({ type: "NEXT_CHAR", next });
          tick();
        }, rand(typingSpeed));
      } else {
        timeout.current = setTimeout(() => {
          dispatch({ type: "SET_PHASE", phase: "deleting" });
          tick();
        }, delayBetweenWords);
      }
      return;
    }

    if (state.phase === "deleting") {
      if (charCount > 0) {
        timeout.current = setTimeout(() => {
          const next = parts.slice(0, charCount - 1).join("");
          dispatch({ type: "PREV_CHAR", next });
          tick();
        }, rand(deleteSpeed));
      } else {
        if (!loop && state.index + 1 >= safeWords.length) {
          dispatch({ type: "SET_PHASE", phase: "pausing" });
          return;
        }
        // Move to next word without showing an empty frame: render first char immediately
        const nextIndex = (state.index + 1) % safeWords.length;
        const nextWord = safeWords[nextIndex] ?? "";
        const nextFirst = splitGraphemes(nextWord).slice(0, 1).join("");
        dispatch({ type: "NEXT_WORD" });
        if (nextFirst) {
          dispatch({ type: "NEXT_CHAR", next: nextFirst });
        }
        raf.current = requestAnimationFrame(tick);
      }
      return;
    }
  };

  useEffect(() => {
    if (reduced || document.hidden) return;
    raf.current = requestAnimationFrame(() => tick());
    return () => clearAll();
  }, [state.text, state.phase, state.index, typingSpeed, deleteSpeed, delayBetweenWords, loop, jitter]);

  const isTyping = state.phase === "typing";
  const isDeleting = state.phase === "deleting";
  const wordIndex = state.index % Math.max(safeWords.length, 1);
  const caretChar = caret ? "|" : "";

  return { text: state.text, isTyping, isDeleting, wordIndex, caretChar };
}

export default useTypingEffect;

// Default words and a convenience hook for headings
export const headingWords = [
  "Gift",
  "Kado Ulang Tahun",
  "Surprise Box",
  "Hampers",
];

export function useHeadingTyping(overrides?: Partial<UseTypingEffectOptions>) {
  return useTypingEffect({
    words: headingWords,
    typingSpeed: 70,
    deleteSpeed: 35,
    delayBetweenWords: 1200,
    loop: true,
    startDelay: 200,
    caret: true, // steady caret (no blink handled in this file)
    ...(overrides || {}),
  });
}
