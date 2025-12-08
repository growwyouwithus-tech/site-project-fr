import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/admin/projects/${id}`);
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!data) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{data.project.name}</h1>
      <p className="text-gray-600 mt-2">📍 {data.project.location}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Budget</h3>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">₹{data.project.budget?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Expenses</h3>
          <p className="text-2xl md:text-3xl font-bold text-red-600">₹{data.project.expenses?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Labours</h3>
          <p className="text-2xl md:text-3xl font-bold text-green-600">{data.labours?.length || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Stock Items</h3>
          <p className="text-2xl md:text-3xl font-bold text-orange-600">{data.stocks?.length || 0}</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Project Manager</h2>
        {data.manager ? (
          <p className="text-gray-700">{data.manager.name} - {data.manager.email}</p>
        ) : (
          <p className="text-gray-400">No manager assigned</p>
        )}
      </div>

      {/* Active Machines Section */}
      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Machines</h2>
        {data.machines && data.machines.length > 0 ? (
          <div className="space-y-3">
            {data.machines.map(machine => (
              <div key={machine.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{machine.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {machine.model && `Model: ${machine.model}`}
                      {machine.plateNumber && ` | Plate: ${machine.plateNumber}`}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    machine.status === 'in-use' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {machine.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No machines assigned to this project</p>
        )}
      </div>

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Expenses</h2>
        {data.expenses && data.expenses.length > 0 ? (
          <>
            {/* Mobile View */}
            <div className="block md:hidden space-y-3">
              {data.expenses.slice(0, 5).map(e => (
                <div key={e.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="font-medium text-gray-900">{e.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <div className="font-bold text-green-600">₹{e.amount?.toLocaleString()}</div>
                    <div>{new Date(e.createdAt).toLocaleDateString()}</div>
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
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.expenses.slice(0, 5).map(e => (
                    <tr key={e.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">{e.name}</td>
                      <td className="px-4 py-3 font-bold text-green-600">₹{e.amount?.toLocaleString()}</td>
                      <td className="px-4 py-3">{new Date(e.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-gray-400">No expenses recorded</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
