import { useState, useEffect } from 'react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

const Payment = () => {
  const [labours, setLabours] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ labourId: '', amount: '', deduction: 0, paymentMode: 'cash', remarks: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [labRes, payRes] = await Promise.all([
        api.get('/site/labours'),
        api.get('/site/payments')
      ]);
      setLabours(labRes.data.data || []);
      setPayments(payRes.data.data || []);
    } catch (error) {
      showToast('Failed to load data', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/site/payment', formData);
      showToast('Payment recorded successfully', 'success');
      setShowForm(false);
      setFormData({ labourId: '', amount: '', deduction: 0, paymentMode: 'cash', remarks: '' });
      fetchData();
    } catch (error) {
      showToast('Failed to record payment', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Labour Payment</h1>
      <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
        {showForm ? 'Cancel' : 'Pay Labour'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Labour</label>
              <select value={formData.labourId} onChange={(e) => {
                const labour = labours.find(l => l.id === e.target.value);
                setFormData({...formData, labourId: e.target.value, amount: labour?.pendingPayout || 0});
              }} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Labour</option>
                {labours.map(l => (
                  <option key={l.id} value={l.id}>{l.name} - Pending: ₹{l.pendingPayout || 0}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
              <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deduction (₹)</label>
              <input type="number" value={formData.deduction} onChange={(e) => setFormData({...formData, deduction: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
              <select value={formData.paymentMode} onChange={(e) => setFormData({...formData, paymentMode: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Final Amount</label>
              <div className="w-full px-4 py-2.5 bg-green-50 border border-green-300 rounded-lg text-green-700 font-bold">
                ₹{(parseFloat(formData.amount) || 0) - (parseFloat(formData.deduction) || 0)}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
              <input type="text" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} placeholder="Optional" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button type="submit" className="mt-5 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold">
            Record Payment
          </button>
        </form>
      )}

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment History</h2>
        
        {/* Mobile View */}
        <div className="block lg:hidden space-y-3">
          {payments.map(p => (
            <div key={p.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">{p.labourName}</div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Amount:</span> ₹{p.amount?.toLocaleString()}</div>
                <div><span className="font-medium">Deduction:</span> <span className="text-red-600">₹{p.deduction?.toLocaleString()}</span></div>
                <div><span className="font-medium">Final:</span> <span className="text-green-600 font-bold">₹{p.finalAmount?.toLocaleString()}</span></div>
                <div><span className="font-medium">Mode:</span> <span className="capitalize">{p.paymentMode}</span></div>
                <div><span className="font-medium">Date:</span> {new Date(p.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Labour</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Deduction</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Final Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mode</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.labourName}</td>
                  <td className="px-4 py-3">₹{p.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-600">₹{p.deduction?.toLocaleString()}</td>
                  <td className="px-4 py-3 font-bold text-green-600">₹{p.finalAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3 capitalize">{p.paymentMode}</td>
                  <td className="px-4 py-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payment;
