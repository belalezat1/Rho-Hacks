/**
 * Full-viewport scroll bridge: sticky gradient holds while you scroll,
 * so the whole screen eases black → white instead of a hard cut.
 */
export function ScrollColorBridge() {
  return (
    <div
      className="scroll-color-track relative z-20 w-full"
      aria-hidden
    >
      <div className="scroll-color-sticky sticky top-0 h-screen w-full">
        <div className="scroll-color-wash absolute inset-0" />
      </div>
    </div>
  );
}
