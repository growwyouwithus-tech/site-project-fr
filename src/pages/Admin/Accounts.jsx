import { useState, useEffect } from 'react';
import { ensureSeedData, getCollection } from '../../services/storage';

const Accounts = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    ensureSeedData();
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    const expenses = getCollection('expenses', []);
    const accounts = getCollection('accounts', { capital: 0 });
    const bankTransactions = getCollection('bankTransactions', []);
    const cashTransactions = getCollection('cashTransactions', []);

    const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const totalBankTransactions = bankTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const totalCashTransactions = cashTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    setData({
      capital: accounts.capital || 0,
      totalExpenses,
      totalBankTransactions,
      totalCashTransactions,
      bankTransactions,
      cashTransactions
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Accounts & Finance</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-5 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium opacity-90 mb-2">Capital</h3>
          <p className="text-2xl md:text-3xl font-bold">₹{data?.capital?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-red-500 text-white p-5 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium opacity-90 mb-2">Total Expenses</h3>
          <p className="text-2xl md:text-3xl font-bold">₹{data?.totalExpenses?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-green-500 text-white p-5 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium opacity-90 mb-2">Bank Transactions</h3>
          <p className="text-2xl md:text-3xl font-bold">₹{data?.totalBankTransactions?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-orange-500 text-white p-5 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium opacity-90 mb-2">Cash Transactions</h3>
          <p className="text-2xl md:text-3xl font-bold">₹{data?.totalCashTransactions?.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bank Transactions</h2>

        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {data?.bankTransactions?.slice(0, 10).map(t => (
            <div key={t.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">{t.type}</div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Amount:</span> <span className="text-green-600 font-bold">₹{t.amount?.toLocaleString()}</span></div>
                <div><span className="font-medium">Date:</span> {new Date(t.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.bankTransactions?.slice(0, 10).map(t => (
                <tr key={t.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{t.type}</td>
                  <td className="px-4 py-3 font-bold text-green-600">₹{t.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3">{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
