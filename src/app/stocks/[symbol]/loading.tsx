const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

export default function StockLoading() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl space-y-6 px-6 py-12 lg:py-16">
        <div className="flex items-center gap-3 text-slate-300">
          <div className={`h-3 w-32 rounded-full bg-slate-800 ${shimmer}`} />
          <div className={`h-3 w-16 rounded-full bg-slate-800 ${shimmer}`} />
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className={`h-4 w-32 rounded-full bg-slate-800 ${shimmer}`} />
              <div className="flex flex-wrap items-center gap-3">
                <div className={`h-12 w-12 rounded-2xl bg-slate-800 ${shimmer}`} />
                <div className={`h-6 w-24 rounded-full bg-slate-800 ${shimmer}`} />
                <div className={`h-6 w-20 rounded-full bg-slate-800 ${shimmer}`} />
              </div>
              <div className={`h-8 w-64 rounded-full bg-slate-800 ${shimmer}`} />
              <div className={`h-16 w-full max-w-3xl rounded-lg bg-slate-800 ${shimmer}`} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`h-16 rounded-xl border border-slate-800 bg-slate-900/60 ${shimmer}`}
              />
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div className={`h-4 w-40 rounded-full bg-slate-800 ${shimmer}`} />
            <div className={`h-4 w-16 rounded-full bg-slate-800 ${shimmer}`} />
          </div>

          <div className="mb-6 h-64 w-full rounded-2xl border border-slate-800 bg-slate-900/80">
            <div className={`h-full w-full ${shimmer}`} />
          </div>

          <div className="grid gap-3 sm:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`h-24 rounded-2xl border border-slate-800 bg-slate-900/70 ${shimmer}`}
              />
            ))}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <div className="h-48 w-full min-w-[720px] space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-8 rounded-md bg-slate-800 ${shimmer}`}
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
