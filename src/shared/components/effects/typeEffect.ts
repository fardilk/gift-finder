import { useEffect, useMemo, useReducer, useRef } from "react";

export type UseTypingEffectOptions = {
  words: string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  delayBetweenWords?: number;
  pauseAfterDelete?: number;
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

export function useTypingEffect(options: UseTypingEffectOptions): UseTypingEffectReturn {
  const {
    words,
    typingSpeed = 80,
    deleteSpeed = 40,
    delayBetweenWords = 1200,
    pauseAfterDelete = 16,
    loop = true,
    startDelay = 0,
    caret = true,
    jitter = 0.15,
  } = options;

  const reduced = usePrefersReducedMotion();
  const safeWords = words?.length ? words : [""];
  // Stable key for words content to avoid rebuilding join in effect deps
  const wordsKey = useMemo(() => words.join("\u0000"), [words]);

  const [wordIndexState, setWordIndexState] = useReducer((n: number) => n + 1, 0);
  const [text, setText] = useReducer((_: string, v: string) => v, "");
  const [phase, setPhase] = useReducer((_: Phase, p: Phase) => p, startDelay > 0 ? "idle" : "typing");

  const currentIndex = wordIndexState % Math.max(safeWords.length, 1);
  const currentWord = safeWords[currentIndex] ?? "";
  const parts = useMemo(() => splitGraphemes(currentWord), [currentWord]);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visKey, bumpVisKey] = useReducer((n: number) => n + 1, 0);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => {
    const onVis = () => {
      if (!document.hidden) bumpVisKey();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    // clear any existing timer before scheduling a new one
    clearTimer();
    // Allow timers to schedule even if the tab is hidden; browsers will throttle safely.
    if (reduced) {
      // reduced motion: set full word and pause using async micro-task to avoid sync loops
      timer.current = setTimeout(() => {
        if (text !== currentWord) setText(currentWord);
        if (phase !== "pausing") setPhase("pausing");
      }, 0);
      return () => clearTimer();
    }

    if (phase === "idle") {
      if (startDelay > 0) {
        timer.current = setTimeout(() => setPhase("typing"), startDelay);
      } else {
        timer.current = setTimeout(() => setPhase("typing"), 0);
      }
      return () => clearTimer();
    }

    const rand = (base: number) => {
      const r = 1 + (Math.random() * 2 - 1) * Math.max(0, Math.min(jitter, 0.6));
      return Math.max(10, Math.round(base * r));
    };

    if (phase === "typing") {
      const charCount = splitGraphemes(text).length;
      // Seed first character immediately to avoid a blank frame on start
      if ((charCount === 0 || !currentWord.startsWith(text)) && parts.length > 0) {
        timer.current = setTimeout(() => setText(parts[0]), 0);
        return () => clearTimer();
      }
      if (charCount < parts.length) {
        timer.current = setTimeout(() => {
          setText(parts.slice(0, charCount + 1).join(""));
        }, rand(typingSpeed));
      } else {
        timer.current = setTimeout(() => setPhase("deleting"), delayBetweenWords);
      }
    } else if (phase === "deleting") {
      const charCount = splitGraphemes(text).length;
      if (charCount > 0) {
        timer.current = setTimeout(() => {
          setText(parts.slice(0, charCount - 1).join(""));
        }, rand(deleteSpeed));
      } else {
        // finished deleting, advance index
        if (!loop && wordIndexState + 1 >= safeWords.length) {
          setPhase("pausing");
          return;
        }
        // move to next word and resume typing after a tiny pause
        timer.current = setTimeout(() => {
          setWordIndexState();
          setPhase("typing");
        }, pauseAfterDelete);
      }
    }

    return () => clearTimer();
  }, [phase, text, currentIndex, wordsKey, reduced, startDelay, typingSpeed, deleteSpeed, delayBetweenWords, pauseAfterDelete, loop, jitter, visKey]);

  // If the words array identity/content changes, reset
  useEffect(() => {
    setText("");
    setPhase(startDelay > 0 ? "idle" : "typing");
  }, [wordsKey, startDelay]);

  const isTyping = phase === "typing";
  const isDeleting = phase === "deleting";
  const wordIndex = currentIndex;
  const caretChar = caret ? "|" : "";

  return { text, isTyping, isDeleting, wordIndex, caretChar };
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
    deleteSpeed: 28,
    delayBetweenWords: 500,
    pauseAfterDelete: 40,
    loop: true,
    startDelay: 200,
    caret: true, // steady caret (no blink handled in this file)
    ...(overrides || {}),
  });
}
