import { useState, useEffect } from 'react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

const StockIn = () => {
  const [vendors, setVendors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [formData, setFormData] = useState({ projectId: '', vendorId: '', materialName: '', unit: '', quantity: '', remarks: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vendRes, projRes, stockRes] = await Promise.all([
        api.get('/site/vendors'),
        api.get('/site/projects'),
        api.get('/site/stocks')
      ]);
      setVendors(vendRes.data.data || []);
      setProjects(projRes.data.data || []);
      setStocks(stockRes.data.data || []);
      if (projRes.data.data.length > 0) setFormData(prev => ({ ...prev, projectId: projRes.data.data[0].id }));
      if (vendRes.data.data.length > 0) setFormData(prev => ({ ...prev, vendorId: vendRes.data.data[0].id }));
    } catch (error) {
      showToast('Failed to load data', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/site/stock-in', formData);
      showToast('Stock added successfully', 'success');
      setFormData({ projectId: projects[0]?.id || '', vendorId: vendors[0]?.id || '', materialName: '', unit: '', quantity: '', remarks: '' });
      fetchData();
    } catch (error) {
      showToast('Failed to add stock', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Stock In (Material Receipt)</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <select value={formData.projectId} onChange={(e) => setFormData({...formData, projectId: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
            <select value={formData.vendorId} onChange={(e) => setFormData({...formData, vendorId: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Material Name</label>
            <input type="text" value={formData.materialName} onChange={(e) => setFormData({...formData, materialName: e.target.value})} placeholder="e.g., Cement, Steel Rods" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <input type="text" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} placeholder="kg/ltr/bags/ft" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} placeholder="Quantity" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
            <input type="text" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} placeholder="Optional remarks" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <button type="submit" className="mt-5 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold">
          Add Stock
        </button>
      </form>

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Stock Records</h2>
        
        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {stocks.map(s => (
            <div key={s.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">{s.materialName}</div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Project:</span> {s.projectId}</div>
                <div><span className="font-medium">Quantity:</span> <span className="font-bold text-green-600">{s.quantity} {s.unit}</span></div>
                <div><span className="font-medium">Vendor:</span> {s.vendorName || 'N/A'}</div>
                <div><span className="font-medium">Date:</span> {new Date(s.createdAt).toLocaleDateString()}</div>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Material</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vendor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map(s => (
                <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{s.projectId}</td>
                  <td className="px-4 py-3 font-medium">{s.materialName}</td>
                  <td className="px-4 py-3 font-bold text-green-600">{s.quantity}</td>
                  <td className="px-4 py-3">{s.unit}</td>
                  <td className="px-4 py-3">{s.vendorName || 'N/A'}</td>
                  <td className="px-4 py-3">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockIn;
