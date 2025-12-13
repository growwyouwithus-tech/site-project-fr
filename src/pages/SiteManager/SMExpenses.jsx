import { useState, useEffect } from 'react';
import { ensureSeedData, getCollection, saveCollection, generateId } from '../../services/storage';
import { showToast } from '../../components/Toast';

const SMExpenses = () => {
  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ projectId: '', name: '', amount: '', voucherNumber: '', remarks: '', receipt: '' });

  useEffect(() => {
    ensureSeedData();
    fetchData();
  }, []);

  const fetchData = () => {
    const proj = getCollection('projects', []);
    const exp = getCollection('expenses', []);
    setProjects(proj);
    setExpenses(exp);
    if (proj.length > 0) setFormData(prev => ({ ...prev, projectId: proj[0].id }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const record = {
      id: generateId(),
      ...formData,
      amount: Number(formData.amount) || 0,
      createdAt: new Date().toISOString()
    };
    const updated = [...getCollection('expenses', []), record];
    saveCollection('expenses', updated);
    showToast('Expense added successfully', 'success');
    setShowForm(false);
    setFormData({ projectId: projects[0]?.id || '', name: '', amount: '', voucherNumber: '', remarks: '', receipt: '' });
    setExpenses(updated);
  };

  const handleReceipt = (file) => {
    if (!file) return setFormData(prev => ({ ...prev, receipt: '' }));
    const reader = new FileReader();
    reader.onload = () => setFormData(prev => ({ ...prev, receipt: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Expenses</h1>
      <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
        {showForm ? 'Cancel' : 'Add Expense'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <select value={formData.projectId} onChange={(e) => setFormData({ ...formData, projectId: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expense Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Material Purchase" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
              <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="Amount" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Number</label>
              <input type="text" value={formData.voucherNumber} onChange={(e) => setFormData({ ...formData, voucherNumber: e.target.value })} placeholder="Optional" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Receipt</label>
              <input type="file" accept="image/*" onChange={(e) => handleReceipt(e.target.files?.[0])} className="w-full" />
              {formData.receipt && <img src={formData.receipt} alt="Receipt" className="mt-2 h-24 w-24 object-cover rounded border" />}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
              <textarea value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} placeholder="Optional remarks" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]" />
            </div>
          </div>
          <button type="submit" className="mt-5 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold">
            Add Expense
          </button>
        </form>
      )}

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Expense Records</h2>

        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {expenses.map(e => (
            <div key={e.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">{e.name}</div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Project:</span> {e.projectId}</div>
                <div><span className="font-medium">Amount:</span> <span className="font-bold text-red-600">₹{e.amount?.toLocaleString()}</span></div>
                <div><span className="font-medium">Voucher:</span> {e.voucherNumber || 'N/A'}</div>
                <div><span className="font-medium">Date:</span> {new Date(e.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Project</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Voucher</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{e.projectId}</td>
                  <td className="px-4 py-3 font-medium">{e.name}</td>
                  <td className="px-4 py-3 font-bold text-red-600">₹{e.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3">{e.voucherNumber || 'N/A'}</td>
                  <td className="px-4 py-3">{new Date(e.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SMExpenses;
