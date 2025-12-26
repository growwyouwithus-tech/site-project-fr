import { useState, useEffect } from 'react';
import api from '../../services/api';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [attendanceRes, usersRes] = await Promise.all([
        api.get('/admin/attendance'),
        api.get('/admin/users')
      ]);

      if (attendanceRes.data.success) {
        setAttendance(attendanceRes.data.data);
      }

      if (usersRes.data.success) {
        setUsers(usersRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Calculate attendance percentage
  const calculateAttendancePercentage = (userId) => {
    const userAttendance = attendance.filter(att => att.userId === userId || att.userId?._id === userId);
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();

    const attendanceDays = userAttendance.filter(att => {
      const attDate = new Date(att.date);
      return attDate >= startOfMonth && attDate <= today;
    }).length;

    return ((attendanceDays / currentDay) * 100).toFixed(1);
  };

  // Calculate total salary based on attendance
  const calculateTotalSalary = (user) => {
    const percentage = parseFloat(calculateAttendancePercentage(user.id));
    const monthlySalary = user.salary || 0;
    return Math.round((monthlySalary * percentage) / 100);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Attendance Management</h1>

      {/* Site Managers Table */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Site Managers</h2>

        {/* Mobile View */}
        <div className="block md:hidden space-y-4">
          {users.map(user => (
            <div key={user.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">{user.name}</div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Email:</span> {user.email}</div>
                <div><span className="font-medium">Phone:</span> {user.phone || 'N/A'}</div>
                <div><span className="font-medium">DOJ:</span> {user.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString() : 'N/A'}</div>
                <div><span className="font-medium">Monthly Salary:</span> ₹{user.salary?.toLocaleString()}</div>
                <div><span className="font-medium">Attendance:</span> {calculateAttendancePercentage(user.id)}%</div>
                <div><span className="font-medium">Total Salary:</span> <span className="text-green-600 font-bold">₹{calculateTotalSalary(user).toLocaleString()}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">DOJ</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Monthly Salary</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Attendance %</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Salary</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone || 'N/A'}</td>
                  <td className="px-4 py-3">{user.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-3">₹{user.salary?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                      {calculateAttendancePercentage(user.id)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-green-600">₹{calculateTotalSalary(user).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance Records</h2>

        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {attendance.map(att => (
            <div key={att.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-medium text-gray-900">{att.userName}</div>
              <div className="text-sm text-gray-600 mt-1">
                <div>📅 {att.date}</div>
                <div>📍 {att.projectId}</div>
                <div>⏰ {new Date(att.time).toLocaleTimeString()}</div>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Manager</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Project</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(att => (
                <tr key={att.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{att.date}</td>
                  <td className="px-4 py-3">{att.userName}</td>
                  <td className="px-4 py-3">{att.projectId}</td>
                  <td className="px-4 py-3">{new Date(att.time).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
