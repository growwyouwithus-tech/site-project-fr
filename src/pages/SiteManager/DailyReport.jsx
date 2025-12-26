import { useState, useEffect } from 'react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';
import Camera from '../../components/Camera';

const DailyReport = () => {
  const [projects, setProjects] = useState([]);
  const [reports, setReports] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [formData, setFormData] = useState({ projectId: '', reportType: 'morning', description: '', photos: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, reportsRes] = await Promise.all([
        api.get('/site/projects'),
        api.get('/site/daily-reports')
      ]);

      if (projectsRes.data.success) {
        setProjects(projectsRes.data.data);
        if (projectsRes.data.data.length > 0) {
          setFormData(prev => ({ ...prev, projectId: projectsRes.data.data[0]._id }));
        }
      }

      if (reportsRes.data.success) {
        setReports(reportsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePhotoCapture = (photoData) => {
    setFormData({ ...formData, photos: [...formData.photos, photoData] });
    setShowCamera(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/site/daily-report', formData);
      if (response.data.success) {
        showToast('Daily report submitted', 'success');
        setFormData({ projectId: projects[0]?._id || '', reportType: 'morning', description: '', photos: [] });
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to submit report', 'error');
      console.error('Error submitting report:', error);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Daily Report</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <select value={formData.projectId} onChange={(e) => setFormData({ ...formData, projectId: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select value={formData.reportType} onChange={(e) => setFormData({ ...formData, reportType: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="morning">Morning Report</option>
              <option value="evening">Evening Report</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe today's work progress..." required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Photos ({formData.photos.length}/2)</label>
          <button type="button" onClick={() => setShowCamera(true)} disabled={formData.photos.length >= 2} className={`px-5 py-2.5 text-white rounded-lg font-medium transition-colors ${formData.photos.length >= 2 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}>
            📸 Capture Photo
          </button>
        </div>
        <button type="submit" className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold">
          Submit Report
        </button>
      </form>

      {showCamera && <Camera onCapture={handlePhotoCapture} onClose={() => setShowCamera(false)} />}

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Report History</h2>
        <div className="space-y-3">
          {reports.map(r => (
            <div key={r.id} className="p-4 border-b border-gray-200 last:border-b-0">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                <span className="font-semibold text-gray-900 capitalize">{r.reportType} Report - {r.projectId}</span>
                <span className="text-gray-600 text-sm">{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-gray-700">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyReport;
