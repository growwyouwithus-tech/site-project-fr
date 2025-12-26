import { useState, useEffect } from 'react';
import { showToast } from '../../components/Toast';
import api from '../../services/api';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [formData, setFormData] = useState({ name: '', contact: '', email: '', address: '' });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await api.get('/admin/vendors');
      if (response.data.success) {
        setVendors(response.data.data);
      }
    } catch (error) {
      showToast('Failed to fetch vendors', 'error');
      console.error('Error fetching vendors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVendor) {
        const response = await api.put(`/admin/vendors/${editingVendor._id}`, formData);
        if (response.data.success) {
          showToast('Vendor updated successfully', 'success');
        }
      } else {
        const response = await api.post('/admin/vendors', formData);
        if (response.data.success) {
          showToast('Vendor created successfully', 'success');
        }
      }
      setShowForm(false);
      setEditingVendor(null);
      setFormData({ name: '', contact: '', email: '', address: '' });
      fetchVendors();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to save vendor', 'error');
      console.error('Error saving vendor:', error);
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      contact: vendor.contact,
      email: vendor.email || '',
      address: vendor.address || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this vendor?')) return;
    try {
      const response = await api.delete(`/admin/vendors/${id}`);
      if (response.data.success) {
        showToast('Vendor deleted', 'success');
        fetchVendors();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete vendor', 'error');
      console.error('Error deleting vendor:', error);
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
              <input
                type="text"
                placeholder="Vendor Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                placeholder="Full Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button type="submit" className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
              {editingVendor ? 'Update Vendor' : 'Add Vendor'}
            </button>
            {editingVendor && (
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingVendor(null);
                  setFormData({ name: '', contact: '', email: '', address: '' });
                }}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Vendors List</h2>

        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {vendors.map(v => (
            <div key={v._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">{v.name}</div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Vendor ID:</span> {v.vendorId || 'N/A'}</div>
                <div><span className="font-medium">Contact:</span> {v.contact}</div>
                <div><span className="font-medium">Email:</span> {v.email || 'N/A'}</div>
                <div><span className="font-medium">Address:</span> {v.address || 'N/A'}</div>
                <div><span className="font-medium">Pending:</span> <span className="text-red-600 font-bold">₹{v.pendingAmount?.toLocaleString()}</span></div>
                <div><span className="font-medium">Total Supplied:</span> <span className="text-green-600 font-bold">₹{v.totalSupplied?.toLocaleString()}</span></div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setSelectedVendor(v)}
                  className="flex-1 px-3 py-2 bg-purple-500 text-white rounded text-sm font-medium hover:bg-purple-600"
                >
                  👁️ View
                </button>
                <button
                  onClick={() => handleEdit(v)}
                  className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
                >
                  🗑️ Remove
                </button>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(v => (
                <tr key={v._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{v.vendorId || 'N/A'}</td>
                  <td className="px-4 py-3 font-medium">{v.name}</td>
                  <td className="px-4 py-3">{v.contact}</td>
                  <td className="px-4 py-3">{v.email || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{v.address || 'N/A'}</td>
                  <td className="px-4 py-3 text-red-600 font-bold">₹{v.pendingAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">₹{v.totalSupplied?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedVendor(v)}
                        className="px-3 py-1.5 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleEdit(v)}
                        className="px-3 py-1.5 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(v._id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        title="Remove"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Vendor Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Vendor Details</h3>
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-700">Vendor ID:</span> {selectedVendor.vendorId || 'N/A'}
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-700">Name:</span> {selectedVendor.name}
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-700">Contact:</span> {selectedVendor.contact}
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-700">Email:</span> {selectedVendor.email || 'N/A'}
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-700">Address:</span> {selectedVendor.address || 'N/A'}
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-700">Pending Amount:</span> <span className="text-red-600 font-bold">₹{selectedVendor.pendingAmount?.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-700">Total Supplied:</span> <span className="text-green-600 font-bold">₹{selectedVendor.totalSupplied?.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedVendor(null)}
              className="mt-4 w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
