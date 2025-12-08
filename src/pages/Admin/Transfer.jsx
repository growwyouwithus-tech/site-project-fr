import { useState, useEffect } from 'react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

const Transfer = () => {
  const [transfers, setTransfers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [labours, setLabours] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ type: 'labour', itemId: '', fromProject: '', toProject: '', quantity: 1 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transRes, projRes, labRes] = await Promise.all([
        api.get('/admin/transfers'),
        api.get('/admin/projects'),
        api.get('/admin/labours')
      ]);
      setTransfers(transRes.data.data || []);
      setProjects(projRes.data.data || []);
      setLabours(labRes.data.data || []);
    } catch (error) {
      showToast('Failed to load data', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/transfers', formData);
      showToast('Transfer completed', 'success');
      setShowForm(false);
      fetchData();
    } catch (error) {
      showToast('Transfer failed', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Resource Transfer</h1>
      <button 
        onClick={() => setShowForm(!showForm)} 
        className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        {showForm ? 'Cancel' : 'New Transfer'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Type</label>
              <select 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})} 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="labour">Labour</option>
                <option value="machine">Machine</option>
                <option value="stock">Stock</option>
              </select>
            </div>
            {formData.type === 'labour' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Labour</label>
                <select 
                  value={formData.itemId} 
                  onChange={(e) => setFormData({...formData, itemId: e.target.value})} 
                  required 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Labour</option>
                  {labours.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Project</label>
              <select 
                value={formData.fromProject} 
                onChange={(e) => setFormData({...formData, fromProject: e.target.value})} 
                required 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">From Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Project</label>
              <select 
                value={formData.toProject} 
                onChange={(e) => setFormData({...formData, toProject: e.target.value})} 
                required 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">To Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="mt-5 px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
            Transfer
          </button>
        </form>
      )}

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Transfer History</h2>
        
        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {transfers.map(t => (
            <div key={t.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2 capitalize">{t.type}</div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">From:</span> {t.fromProject}</div>
                <div><span className="font-medium">To:</span> {t.toProject}</div>
                <div><span className="font-medium">Status:</span> <span className="capitalize">{t.status}</span></div>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">From</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">To</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(t => (
                <tr key={t.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 capitalize">{t.type}</td>
                  <td className="px-4 py-3">{t.fromProject}</td>
                  <td className="px-4 py-3">{t.toProject}</td>
                  <td className="px-4 py-3 capitalize">{t.status}</td>
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

export default Transfer;
