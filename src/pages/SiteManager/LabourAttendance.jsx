import { useState, useEffect } from 'react';
import { ensureSeedData, getCollection, saveCollection, generateId } from '../../services/storage';
import { showToast } from '../../components/Toast';

const LabourAttendance = () => {
  const [labours, setLabours] = useState([]);
  const [projects, setProjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    ensureSeedData();
    fetchData();
  }, []);

  const fetchData = () => {
    const labs = getCollection('labours', []);
    const proj = getCollection('projects', []);
    const att = getCollection('labourAttendances', []);
    setLabours(labs);
    setProjects(proj);
    setAttendance(att);

    const defaults = {};
    labs.forEach(l => { defaults[l.id] = 'present'; });
    setStatusMap(defaults);
  };

  const handleSave = (labour) => {
    const status = statusMap[labour.id] || 'present';
    const payload = {
      id: generateId(),
      labourId: labour.id,
      labourName: labour.name,
      projectId: labour.assignedSite || projects[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      remarks: '',
      status,
      time: new Date().toISOString()
    };

    const updated = [...getCollection('labourAttendances', []), payload];
    saveCollection('labourAttendances', updated);
    showToast(`${labour.name} marked ${status}`, 'success');
    setAttendance(updated);
  };

  const handleEditLoad = (record) => {
    setStatusMap((prev) => ({ ...prev, [record.labourId]: record.status || 'present' }));
    showToast('Status loaded. Update dropdown and Save.', 'info');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Labour Attendance</h1>
      <p className="text-gray-600 mb-4">Pick status (Present / Half / Absent) for each labour and hit Save.</p>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b bg-gray-50 text-sm font-semibold text-gray-700">
          <span className="col-span-1 text-center">#</span>
          <span className="col-span-6">Name</span>
          <span className="col-span-3">Status</span>
          <span className="col-span-2 text-center">Action</span>
        </div>

        <div className="divide-y divide-gray-200">
          {labours.map((labour, idx) => (
            <div key={labour.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-4 items-center">
              <div className="md:col-span-1 text-sm font-semibold text-gray-700 text-center md:text-left">{idx + 1}</div>
              <div className="md:col-span-6">
                <div className="text-base font-bold text-gray-900">{labour.name}</div>
                <div className="text-sm text-gray-500">{labour.designation || 'Labour'}</div>
              </div>
              <div className="md:col-span-3">
                <select
                  value={statusMap[labour.id] || 'present'}
                  onChange={(e) => setStatusMap(prev => ({ ...prev, [labour.id]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="present">Present</option>
                  <option value="half">Half</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
              <div className="md:col-span-2 flex md:justify-center">
                <button
                  onClick={() => handleSave(labour)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold w-full md:w-auto"
                >
                  Save
                </button>
              </div>
            </div>
          ))}

          {labours.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">No labour found.</div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Recent Attendance</h2>
        {attendance.length === 0 ? (
          <p className="text-gray-500 text-sm">No attendance records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Labour</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Project</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Time</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(a => (
                  <tr key={a.id} className="border-b border-gray-100">
                    <td className="px-4 py-2">{a.date}</td>
                    <td className="px-4 py-2">{a.labourName}</td>
                    <td className="px-4 py-2">{a.projectId}</td>
                    <td className="px-4 py-2 capitalize">{a.status || 'present'}</td>
                    <td className="px-4 py-2">{new Date(a.time).toLocaleTimeString()}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEditLoad(a)}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded text-xs font-semibold hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabourAttendance;
