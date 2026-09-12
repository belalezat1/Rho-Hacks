"use client";

type Props = {
  text: string;
  busy?: boolean;
  className?: string;
};

/** Soft speech bubble for assistant text while Pilot is “speaking.” */
export function SpeechBubble({ text, busy = false, className = "" }: Props) {
  return (
    <div
      className={`relative max-w-xl rounded-[1.75rem] rounded-bl-md border border-hairline bg-surface px-6 py-5 shadow-sm ${className}`}
    >
      <p
        className={`text-[17px] leading-relaxed text-ink transition-opacity duration-300 ${
          busy ? "opacity-80" : "opacity-100"
        }`}
      >
        {text}
      </p>
      {busy && (
        <p className="mt-3 text-[13px] text-muted">
          Pulling Rho + Spend Context…
          <span className="ml-1 inline-flex gap-0.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint [animation-delay:240ms]" />
          </span>
        </p>
      )}
      <span
        className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 border-b border-r border-hairline bg-surface"
        aria-hidden
      />
    </div>
  );
}
