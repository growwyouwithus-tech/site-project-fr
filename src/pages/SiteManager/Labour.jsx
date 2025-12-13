import { useState, useEffect } from 'react';
import { ensureSeedData, getCollection, saveCollection, generateId } from '../../services/storage';
import { showToast } from '../../components/Toast';

const Labour = () => {
  const [labours, setLabours] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', dailyWage: '', designation: '', assignedSite: '' });

  useEffect(() => {
    ensureSeedData();
    fetchData();
  }, []);

  const fetchData = () => {
    const storedLabours = getCollection('labours', []);
    const storedProjects = getCollection('projects', []);
    setLabours(storedLabours);
    setProjects(storedProjects);
    if (storedProjects.length > 0) {
      setFormData(prev => ({ ...prev, assignedSite: storedProjects[0].id }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const labourData = {
      id: generateId(),
      ...formData,
      pendingPayout: 0
    };
    const updated = [...getCollection('labours', []), labourData];
    saveCollection('labours', updated);
    showToast('Labour enrolled successfully', 'success');
    setShowForm(false);
    setFormData({ name: '', phone: '', dailyWage: '', designation: '', assignedSite: projects[0]?.id || '' });
    setLabours(updated);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Labour Management</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        {showForm ? 'Cancel' : 'Enroll New Labour'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Labour Name</label>
              <input
                type="text"
                placeholder="Labour Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Wage (₹)</label>
              <input
                type="number"
                placeholder="Daily Wage"
                value={formData.dailyWage}
                onChange={(e) => setFormData({ ...formData, dailyWage: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
              <input
                type="text"
                placeholder="e.g., Mason, Helper"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Site</label>
              <select
                value={formData.assignedSite}
                onChange={(e) => setFormData({ ...formData, assignedSite: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="mt-5 px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
            Enroll Labour
          </button>
        </form>
      )}

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Labour List</h2>

        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {labours.map(l => (
            <div key={l.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">{l.name}</div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">ID:</span> {l.id}</div>
                <div><span className="font-medium">Phone:</span> {l.phone}</div>
                <div><span className="font-medium">Daily Wage:</span> <span className="text-green-600 font-bold">₹{l.dailyWage}</span></div>
                <div><span className="font-medium">Designation:</span> {l.designation}</div>
                <div><span className="font-medium">Site:</span> {l.assignedSite}</div>
                <div><span className="font-medium">Pending:</span> <span className="text-red-600 font-bold">₹{l.pendingPayout || 0}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Daily Wage</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Designation</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Site</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pending Payout</th>
              </tr>
            </thead>
            <tbody>
              {labours.map(l => (
                <tr key={l.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{l.id}</td>
                  <td className="px-4 py-3 font-medium">{l.name}</td>
                  <td className="px-4 py-3">{l.phone}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">₹{l.dailyWage}</td>
                  <td className="px-4 py-3">{l.designation}</td>
                  <td className="px-4 py-3">{l.assignedSite}</td>
                  <td className="px-4 py-3 text-red-600 font-bold">₹{l.pendingPayout || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Labour;
