import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { showToast } from '../../components/Toast';
import { ensureSeedData, getCollection, saveCollection, generateId } from '../../services/storage';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', budget: '', startDate: '', endDate: '' });

  useEffect(() => {
    ensureSeedData();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const stored = getCollection('projects', []);
    setProjects(stored);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProject = {
      ...formData,
      id: generateId(),
      budget: Number(formData.budget) || 0,
      status: 'Active'
    };
    const updated = [...getCollection('projects', []), newProject];
    saveCollection('projects', updated);
    showToast('Project created successfully', 'success');
    setShowForm(false);
    setFormData({ name: '', location: '', budget: '', startDate: '', endDate: '' });
    setProjects(updated);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project? This will remove all associated data.')) return;
    const updated = getCollection('projects', []).filter(p => p.id !== id);
    saveCollection('projects', updated);
    // Also delete related expenses
    const updatedExpenses = getCollection('expenses', []).filter(e => e.projectId !== id);
    saveCollection('expenses', updatedExpenses);
    showToast('Project deleted', 'success');
    setProjects(updated);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Projects</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        {showForm ? 'Cancel' : 'Create New Project'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Residential Complex Phase 1"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Mumbai, Maharashtra"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₹)</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="Total project budget"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
            Create Project
          </button>
        </form>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex-1">{p.name}</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold ml-2">
                {p.status || 'Active'}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">📍 {p.location}</p>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Budget</p>
              <p className="text-xl font-bold text-gray-900">₹{p.budget?.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Start</p>
                <p className="text-gray-900 font-medium">{p.startDate ? new Date(p.startDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">End</p>
                <p className="text-gray-900 font-medium">{p.endDate ? new Date(p.endDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/admin/projects/${p.id}`}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center text-sm font-medium"
              >
                View Details
              </Link>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !showForm && (
        <div className="mt-6 text-center p-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-400 text-lg">No projects yet. Create your first project!</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
