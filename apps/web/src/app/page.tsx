"use client";

import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  amount: number;
  currency: string;
  senderName: string;
  reference: string;
  receivedAt: string;
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCount = transactions.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">SyncFlow</h1>
        <p className="mt-2 text-slate-600">Payment Operations Dashboard</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-sm text-slate-500">Today's Revenue</h2>
            <p className="mt-2 text-3xl font-bold">₦{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-sm text-slate-500">Transactions</h2>
            <p className="mt-2 text-3xl font-bold">{totalCount}</p>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Recent Payments</h2>
          {loading ? (
            <p className="mt-4 text-slate-500">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="mt-4 text-slate-500">No transactions yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b">
                  <tr>
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Sender</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b">
                      <td className="py-2">{new Date(tx.receivedAt).toLocaleString()}</td>
                      <td className="py-2">{tx.senderName}</td>
                      <td className="py-2">₦{tx.amount.toLocaleString()}</td>
                      <td className="py-2">{tx.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
