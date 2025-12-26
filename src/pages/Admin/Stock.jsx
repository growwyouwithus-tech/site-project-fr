import { useState, useEffect } from 'react';
import { showToast } from '../../components/Toast';
import api from '../../services/api';

const Stock = () => {
  const [stocks, setStocks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    vendorName: '',
    materialName: '',
    unit: 'kg',
    quantity: '',
    unitPrice: '',
    photo: '',
    remarks: ''
  });

  const units = ['kg', 'ltr', 'bags', 'ft', 'meter', 'ton', 'piece', 'box', 'bundle'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stocksRes, projectsRes] = await Promise.all([
        api.get('/admin/stocks'),
        api.get('/admin/projects')
      ]);

      if (stocksRes.data.success) {
        setStocks(stocksRes.data.data);
      }

      if (projectsRes.data.success) {
        setProjects(projectsRes.data.data);
        if (projectsRes.data.data.length > 0) {
          setFormData(prev => ({ ...prev, projectId: projectsRes.data.data[0]._id }));
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/stocks', {
        ...formData,
        quantity: Number(formData.quantity) || 0,
        unitPrice: Number(formData.unitPrice) || 0
      });

      if (response.data.success) {
        showToast('Stock added successfully', 'success');
        setShowForm(false);
        setFormData({
          projectId: projects[0]?._id || '',
          vendorName: '',
          materialName: '',
          unit: 'kg',
          quantity: '',
          unitPrice: '',
          photo: '',
          remarks: ''
        });
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to add stock', 'error');
      console.error('Error adding stock:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this stock entry?')) return;
    try {
      const response = await api.delete(`/admin/stocks/${id}`);
      if (response.data.success) {
        showToast('Stock deleted', 'success');
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete stock', 'error');
      console.error('Error deleting stock:', error);
    }
  };

  const handlePhoto = (file) => {
    if (!file) return setFormData(prev => ({ ...prev, photo: '' }));
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Stock Management</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        {showForm ? 'Cancel' : 'Add Stock'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
              <input
                type="text"
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                placeholder="Vendor name"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Material Name</label>
            <input
              type="text"
              value={formData.materialName}
              onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
              placeholder="e.g., Cement, Steel Rods"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Quantity"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price (₹)</label>
              <input
                type="number"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                placeholder="Price per unit"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhoto(e.target.files?.[0])}
              className="w-full"
            />
            {formData.photo && (
              <img src={formData.photo} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded border" />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
            <input
              type="text"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Optional remarks"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
            Add Stock
          </button>
        </form>
      )}

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Stock Inventory</h2>

        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {stocks.map(s => (
            <div key={s.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">{s.materialName}</div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Project:</span> {s.projectId}</div>
                <div><span className="font-medium">Quantity:</span> <span className="font-bold">{s.quantity} {s.unit}</span></div>
                <div><span className="font-medium">Unit Price:</span> <span className="text-green-600 font-bold">₹{s.unitPrice?.toLocaleString()}</span></div>
                <div><span className="font-medium">Total Price:</span> <span className="text-green-700 font-bold">₹{s.totalPrice?.toLocaleString()}</span></div>
                <div><span className="font-medium">Vendor:</span> {s.vendorName || 'N/A'}</div>
                <div><span className="font-medium">Date:</span> {new Date(s.createdAt).toLocaleDateString()}</div>
              </div>
              {s.photo && (
                <img src={s.photo} alt="Stock" className="mt-2 h-20 w-full object-cover rounded border" />
              )}
              <button
                onClick={() => handleDelete(s.id)}
                className="mt-3 w-full px-3 py-2 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
              >
                Delete
              </button>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vendor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Photo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map(s => (
                <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{s.projectId}</td>
                  <td className="px-4 py-3">{s.materialName}</td>
                  <td className="px-4 py-3 font-bold">{s.quantity}</td>
                  <td className="px-4 py-3">{s.unit}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">₹{s.unitPrice?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-green-700 font-bold">₹{s.totalPrice?.toLocaleString()}</td>
                  <td className="px-4 py-3">{s.vendorName || 'N/A'}</td>
                  <td className="px-4 py-3">
                    {s.photo ? <img src={s.photo} alt="Stock" className="h-12 w-12 object-cover rounded border" /> : '—'}
                  </td>
                  <td className="px-4 py-3">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stock;
