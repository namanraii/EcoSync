export default function Loading(): JSX.Element {
  return (
    <main
      id="main-content"
      role="main"
      aria-label="Loading page content"
      className="container mx-auto px-4 py-8"
    >
      {/* Screen reader announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Loading page content, please wait...
      </div>

      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-1/3 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-1/4 animate-pulse rounded-md bg-muted" />
        </div>

        {/* Stats grid skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-6" aria-hidden="true">
              <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
              <div className="mt-4 h-8 w-24 animate-pulse rounded-md bg-muted" />
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6" aria-hidden="true">
            <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
            <div className="mt-4 h-[250px] animate-pulse rounded-md bg-muted" />
          </div>
          <div className="rounded-lg border bg-card p-6" aria-hidden="true">
            <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
            <div className="mt-4 h-[250px] animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </main>
  )
}
