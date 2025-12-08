import { useState, useEffect } from 'react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

const LabourAttendance = () => {
  const [labours, setLabours] = useState([]);
  const [projects, setProjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [formData, setFormData] = useState({ labourId: '', projectId: '', date: new Date().toISOString().split('T')[0], remarks: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [labRes, projRes, attRes] = await Promise.all([
        api.get('/site/labours'),
        api.get('/site/projects'),
        api.get('/site/labour-attendance')
      ]);
      setLabours(labRes.data.data || []);
      setProjects(projRes.data.data || []);
      setAttendance(attRes.data.data || []);
      if (labRes.data.data.length > 0) setFormData(prev => ({ ...prev, labourId: labRes.data.data[0].id }));
      if (projRes.data.data.length > 0) setFormData(prev => ({ ...prev, projectId: projRes.data.data[0].id }));
    } catch (error) {
      showToast('Failed to load data', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/site/labour-attendance', { ...formData, time: new Date().toISOString() });
      showToast('Labour attendance marked', 'success');
      fetchData();
    } catch (error) {
      showToast('Failed to mark attendance', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Labour Attendance</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Labour</label>
            <select value={formData.labourId} onChange={(e) => setFormData({...formData, labourId: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {labours.map(l => <option key={l.id} value={l.id}>{l.name} - {l.designation}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <select value={formData.projectId} onChange={(e) => setFormData({...formData, projectId: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
            <input type="text" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} placeholder="Optional remarks" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <button type="submit" className="mt-5 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold">
          Mark Attendance
        </button>
      </form>

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance Records</h2>
        
        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {attendance.map(a => (
            <div key={a.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">{a.labourName}</div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Date:</span> {a.date}</div>
                <div><span className="font-medium">Project:</span> {a.projectId}</div>
                <div><span className="font-medium">Daily Wage:</span> <span className="text-green-600 font-bold">₹{a.dailyWage}</span></div>
                <div><span className="font-medium">Time:</span> {new Date(a.time).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Labour</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Project</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Daily Wage</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => (
                <tr key={a.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{a.date}</td>
                  <td className="px-4 py-3">{a.labourName}</td>
                  <td className="px-4 py-3">{a.projectId}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">₹{a.dailyWage}</td>
                  <td className="px-4 py-3">{new Date(a.time).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LabourAttendance;
