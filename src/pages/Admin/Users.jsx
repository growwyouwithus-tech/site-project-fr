import { useState, useEffect } from 'react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', salary: '', dateOfJoining: new Date().toISOString().split('T')[0] });

  const generateUserId = () => {
    const prefix = 'USR';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users?role=sitemanager');
      setUsers(res.data.data || []);
    } catch (error) {
      showToast('Failed to load users', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        ...formData,
        userId: generateUserId()
      };
      await api.post('/admin/users', userData);
      showToast('Site manager created successfully', 'success');
      setShowForm(false);
      setFormData({ name: '', email: '', password: '', phone: '', salary: '', dateOfJoining: new Date().toISOString().split('T')[0] });
      fetchUsers();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to create user', 'error');
    }
  };

  const handleDeactivate = async (id) => {
    if (!confirm('Deactivate this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      showToast('User deactivated', 'success');
      fetchUsers();
    } catch (error) {
      showToast('Failed to deactivate user', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">User Management</h1>
      <button 
        onClick={() => setShowForm(!showForm)} 
        className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        {showForm ? 'Cancel' : 'Add Site Manager'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="Password (min 6 chars)" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
                minLength="6"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Salary</label>
              <input 
                type="number" 
                placeholder="Monthly Salary" 
                value={formData.salary} 
                onChange={(e) => setFormData({...formData, salary: e.target.value})} 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining</label>
              <input 
                type="date" 
                value={formData.dateOfJoining} 
                onChange={(e) => setFormData({...formData, dateOfJoining: e.target.value})} 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
          <button type="submit" className="mt-5 px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
            Create User
          </button>
        </form>
      )}

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Site Managers</h2>
        
        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {users.map(u => (
            <div key={u.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">{u.name}</div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">User ID:</span> <span className="font-mono text-xs">{u.userId || 'N/A'}</span></div>
                <div><span className="font-medium">Email:</span> {u.email}</div>
                <div><span className="font-medium">Phone:</span> {u.phone || 'N/A'}</div>
                <div><span className="font-medium">DOJ:</span> {u.dateOfJoining ? new Date(u.dateOfJoining).toLocaleDateString() : 'N/A'}</div>
                <div><span className="font-medium">Salary:</span> <span className="text-green-600 font-bold">₹{u.salary?.toLocaleString()}</span></div>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    u.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              {u.active && (
                <button 
                  onClick={() => handleDeactivate(u.id)} 
                  className="mt-3 w-full px-3 py-2 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
                >
                  Deactivate
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">DOJ</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Salary</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{u.userId || 'N/A'}</td>
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.phone || 'N/A'}</td>
                  <td className="px-4 py-3">{u.dateOfJoining ? new Date(u.dateOfJoining).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">₹{u.salary?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.active && (
                      <button 
                        onClick={() => handleDeactivate(u.id)} 
                        className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Deactivate
                      </button>
                    )}
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

export default Users;
