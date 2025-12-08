import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

const SMDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/site/dashboard');
      setData(res.data.data);
    } catch (error) {
      showToast('Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Site Manager Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome, {data?.user?.name}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-5 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium opacity-90 mb-2">Assigned Projects</h3>
          <p className="text-2xl md:text-3xl font-bold">{data?.assignedProjects?.length || 0}</p>
        </div>
        <div className="bg-green-500 text-white p-5 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium opacity-90 mb-2">Total Labours</h3>
          <p className="text-2xl md:text-3xl font-bold">{data?.labourCount || 0}</p>
        </div>
        <div className="bg-orange-500 text-white p-5 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium opacity-90 mb-2">Today Attendance</h3>
          <p className="text-2xl md:text-3xl font-bold">{data?.todayAttendance?.length || 0}</p>
        </div>
        <div className="bg-purple-500 text-white p-5 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium opacity-90 mb-2">Notifications</h3>
          <p className="text-2xl md:text-3xl font-bold">{data?.notifications?.length || 0}</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link to="/site/attendance" className="bg-blue-500 text-white p-4 rounded-lg text-center font-semibold hover:bg-blue-600 transition-colors">
            <div className="text-2xl mb-1">📸</div>
            <div className="text-xs md:text-sm">Mark Attendance</div>
          </Link>
          <Link to="/site/labour" className="bg-green-500 text-white p-4 rounded-lg text-center font-semibold hover:bg-green-600 transition-colors">
            <div className="text-2xl mb-1">👷</div>
            <div className="text-xs md:text-sm">Manage Labour</div>
          </Link>
          <Link to="/site/stock-in" className="bg-orange-500 text-white p-4 rounded-lg text-center font-semibold hover:bg-orange-600 transition-colors">
            <div className="text-2xl mb-1">📦</div>
            <div className="text-xs md:text-sm">Stock In</div>
          </Link>
          <Link to="/site/daily-report" className="bg-purple-500 text-white p-4 rounded-lg text-center font-semibold hover:bg-purple-600 transition-colors">
            <div className="text-2xl mb-1">📝</div>
            <div className="text-xs md:text-sm">Daily Report</div>
          </Link>
          <Link to="/site/expenses" className="bg-red-500 text-white p-4 rounded-lg text-center font-semibold hover:bg-red-600 transition-colors">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-xs md:text-sm">Add Expense</div>
          </Link>
          <Link to="/site/gallery" className="bg-cyan-500 text-white p-4 rounded-lg text-center font-semibold hover:bg-cyan-600 transition-colors">
            <div className="text-2xl mb-1">📷</div>
            <div className="text-xs md:text-sm">Gallery</div>
          </Link>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Projects</h2>
        {data?.assignedProjects && data.assignedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.assignedProjects.map(p => (
              <div key={p.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-900 mb-2">{p.name}</h3>
                <p className="text-gray-600 text-sm mb-1">📍 {p.location}</p>
                <p className="text-gray-600 text-sm">Budget: <span className="font-bold text-green-600">₹{p.budget?.toLocaleString()}</span></p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No projects assigned</p>
        )}
      </div>
    </div>
  );
};

export default SMDashboard;
