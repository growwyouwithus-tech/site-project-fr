import { useState, useEffect } from 'react';
import { showToast } from '../../components/Toast';
import api from '../../services/api';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState('all');
  const [formData, setFormData] = useState({
    projectId: '',
    name: '',
    amount: '',
    voucherNumber: '',
    category: 'material',
    remarks: ''
  });

  useEffect(() => {
    fetchProjects();
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/admin/expenses');
      if (response.data.success) {
        const expenses = response.data.data;

        const contractorResponse = await api.get('/admin/contractors');
        if (contractorResponse.data.success) {
          const contractors = contractorResponse.data.data;
          const contractorPaymentPromises = contractors.map(c =>
            api.get(`/admin/contractors/${c._id}/payments`)
          );

          const paymentResponses = await Promise.all(contractorPaymentPromises);
          const allPayments = paymentResponses.flatMap(res =>
            res.data.success ? res.data.data : []
          );

          const contractorExpenses = allPayments.map(payment => ({
            _id: payment._id,
            projectId: 'contractor',
            name: `Contractor Payment - ${payment.contractorName}`,
            amount: payment.amount,
            voucherNumber: `CP-${payment._id.slice(0, 8)}`,
            category: 'contractor',
            remarks: payment.remark || 'Contractor payment',
            createdAt: payment.createdAt,
            isContractorPayment: true
          }));

          setExpenses([...expenses, ...contractorExpenses]);
        } else {
          setExpenses(expenses);
        }
      }
    } catch (error) {
      showToast('Failed to fetch expenses', 'error');
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/admin/projects');
      if (response.data.success) {
        setProjects(response.data.data);
        if (response.data.data.length > 0) {
          setFormData(prev => ({ ...prev, projectId: response.data.data[0]._id }));
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/expenses', {
        ...formData,
        amount: Number(formData.amount) || 0
      });
      if (response.data.success) {
        showToast('Expense added successfully', 'success');
        setShowForm(false);
        setFormData({
          projectId: projects[0]?._id || '',
          name: '',
          amount: '',
          voucherNumber: '',
          category: 'material',
          remarks: ''
        });
        fetchExpenses();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to add expense', 'error');
      console.error('Error adding expense:', error);
    }
  };

  const handleDelete = async (id, isContractorPayment) => {
    if (!confirm('Delete this expense?')) return;
    if (isContractorPayment) {
      showToast('Cannot delete contractor payments from here', 'error');
      return;
    }
    try {
      const response = await api.delete(`/admin/expenses/${id}`);
      if (response.data.success) {
        showToast('Expense deleted', 'success');
        fetchExpenses();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete expense', 'error');
      console.error('Error deleting expense:', error);
    }
  };

  const filteredExpenses = selectedProject === 'all'
    ? expenses
    : expenses.filter(e => e.projectId === selectedProject);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Expenses</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          {showForm ? 'Cancel' : 'Add Expense'}
        </button>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Projects</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expense Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Cement Purchase"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Amount"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="material">Material</option>
                <option value="labour">Labour</option>
                <option value="machinery">Machinery</option>
                <option value="transport">Transport</option>
                <option value="contractor">Contractor</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Number</label>
              <input
                type="text"
                value={formData.voucherNumber}
                onChange={(e) => setFormData({ ...formData, voucherNumber: e.target.value })}
                placeholder="Required"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
              <input
                type="text"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Optional remarks"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
            Add Expense
          </button>
        </form>
      )}

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {selectedProject === 'all' ? 'All Expenses' : 'Project Expenses'}
        </h2>

        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {filteredExpenses.map(e => (
            <div key={e._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">{e.name}</div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Project:</span> {e.projectId}</div>
                <div><span className="font-medium">Amount:</span> <span className="text-red-600 font-bold">₹{e.amount?.toLocaleString()}</span></div>
                <div><span className="font-medium">Category:</span> <span className="capitalize">{e.category || 'N/A'}</span></div>
                <div><span className="font-medium">Voucher:</span> {e.voucherNumber || 'N/A'}</div>
                <div><span className="font-medium">Date:</span> {new Date(e.createdAt).toLocaleDateString()}</div>
              </div>
              <button
                onClick={() => alert('Edit coming soon')}
                className="mt-3 w-full px-3 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600"
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Project</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Voucher</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(e => (
                <tr key={e._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{e.projectId}</td>
                  <td className="px-4 py-3">{e.name}</td>
                  <td className="px-4 py-3 capitalize">{e.category || 'N/A'}</td>
                  <td className="px-4 py-3 font-bold text-red-600">₹{e.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3">{e.voucherNumber || 'N/A'}</td>
                  <td className="px-4 py-3">{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {!e.isContractorPayment && (
                      <button
                        onClick={() => handleDelete(e._id, e.isContractorPayment)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete
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

export default Expenses;
