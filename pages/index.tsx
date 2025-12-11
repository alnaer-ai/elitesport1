export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-500">
          EliteSport
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Next.js + Tailwind CSS
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Tailwind utility classes are ready to use. Start building by editing{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-900">
            pages/index.tsx
          </code>
          .
        </p>
      </section>
    </main>
  );
}
