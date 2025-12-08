import { useState, useEffect } from 'react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', email: '', address: '' });

  const generateVendorId = () => {
    const prefix = 'VEN';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await api.get('/admin/vendors');
      setVendors(res.data.data || []);
    } catch (error) {
      showToast('Failed to load vendors', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vendorData = {
        ...formData,
        vendorId: generateVendorId()
      };
      await api.post('/admin/vendors', vendorData);
      showToast('Vendor created successfully', 'success');
      setShowForm(false);
      setFormData({ name: '', contact: '', email: '', address: '' });
      fetchVendors();
    } catch (error) {
      showToast('Failed to create vendor', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Vendor Management</h1>
      <button 
        onClick={() => setShowForm(!showForm)} 
        className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        {showForm ? 'Cancel' : 'Add Vendor'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
              <input 
                type="text" 
                placeholder="Vendor Name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
              <input 
                type="tel" 
                placeholder="Contact Number" 
                value={formData.contact} 
                onChange={(e) => setFormData({...formData, contact: e.target.value})} 
                required 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                placeholder="Email (optional)" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input 
                type="text" 
                placeholder="Full Address" 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
          <button type="submit" className="mt-5 px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
            Add Vendor
          </button>
        </form>
      )}

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Vendors List</h2>
        
        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {vendors.map(v => (
            <div key={v.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">{v.name}</div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Vendor ID:</span> {v.vendorId || 'N/A'}</div>
                <div><span className="font-medium">Contact:</span> {v.contact}</div>
                <div><span className="font-medium">Email:</span> {v.email || 'N/A'}</div>
                <div><span className="font-medium">Address:</span> {v.address || 'N/A'}</div>
                <div><span className="font-medium">Pending:</span> <span className="text-red-600 font-bold">₹{v.pendingAmount?.toLocaleString()}</span></div>
                <div><span className="font-medium">Total Supplied:</span> <span className="text-green-600 font-bold">₹{v.totalSupplied?.toLocaleString()}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vendor ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pending Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Supplied</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(v => (
                <tr key={v.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{v.vendorId || 'N/A'}</td>
                  <td className="px-4 py-3 font-medium">{v.name}</td>
                  <td className="px-4 py-3">{v.contact}</td>
                  <td className="px-4 py-3">{v.email || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{v.address || 'N/A'}</td>
                  <td className="px-4 py-3 text-red-600 font-bold">₹{v.pendingAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">₹{v.totalSupplied?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Vendors;
