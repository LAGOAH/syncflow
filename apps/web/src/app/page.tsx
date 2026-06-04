export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">SyncFlow</h1>

        <p className="mt-2 text-slate-600">
          Payment Operations Dashboard
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-sm text-slate-500">Today's Revenue</h2>

            <p className="mt-2 text-3xl font-bold">
              ₦0
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-sm text-slate-500">Transactions</h2>

            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">
            Recent Payments
          </h2>

          <p className="mt-4 text-slate-500">
            No transactions yet.
          </p>
        </div>
      </div>
    </main>
  );
}
