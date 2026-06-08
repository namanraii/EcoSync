/**
 * Loading State
 * Accessible loading skeleton for the application
 */

export default function Loading(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-[50vh]" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
        <p className="text-muted-foreground text-sm">Loading EcoSync...</p>
      </div>
    </div>
  );
}
