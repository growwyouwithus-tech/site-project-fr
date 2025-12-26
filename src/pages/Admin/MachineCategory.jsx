import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from '../../components/Toast';
import api from '../../services/api';

const MachineCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [assignProjectId, setAssignProjectId] = useState('');
  const [assignAsRental, setAssignAsRental] = useState(false);
  const [rentalPerDay, setRentalPerDay] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    plateNumber: '',
    quantity: 1,
    status: 'available',
    ownershipType: 'own',
    vendorName: '',
    machineCategory: '',
    machinePhoto: '',
    perDayExpense: 0
  });

  useEffect(() => {
    fetchMachines();
    fetchProjects();
    fetchContractors();
  }, [category]);

  const fetchMachines = async () => {
    try {
      const response = await api.get('/admin/machines');
      if (response.data.success) {
        const filtered = response.data.data.filter(m => m.category === category);
        setMachines(filtered);
      }
    } catch (error) {
      showToast('Failed to fetch machines', 'error');
      console.error('Error fetching machines:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/admin/projects');
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchContractors = async () => {
    try {
      const response = await api.get('/admin/contractors');
      if (response.data.success) {
        setContractors(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching contractors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newMachine = {
        ...formData,
        category,
        quantity: isConsumable ? formData.quantity : Number(formData.quantity) || 1
      };
      const response = await api.post('/admin/machines', newMachine);
      if (response.data.success) {
        showToast('Machine added successfully', 'success');
        setShowForm(false);
        setFormData({ name: '', model: '', plateNumber: '', quantity: 1, status: 'available', ownershipType: 'own', vendorName: '', machineCategory: '', machinePhoto: '', perDayExpense: 0 });
        fetchMachines();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to add machine', 'error');
      console.error('Error adding machine:', error);
    }
  };

  const handleAssignMachine = async () => {
    if (!assignProjectId) {
      showToast('Please select a project or contractor', 'error');
      return;
    }
    if (assignAsRental && (!rentalPerDay || rentalPerDay <= 0)) {
      showToast('Please enter valid rental per day amount', 'error');
      return;
    }
    try {
      const updateData = {
        projectId: assignProjectId,
        status: 'in-use',
        assignedAsRental: assignAsRental,
        assignedRentalPerDay: assignAsRental ? Number(rentalPerDay) : 0
      };
      const response = await api.put(`/admin/machines/${selectedMachine._id}`, updateData);
      if (response.data.success) {
        showToast('Machine assigned successfully', 'success');
        setShowAssignModal(false);
        setSelectedMachine(null);
        setAssignProjectId('');
        setAssignAsRental(false);
        setRentalPerDay(0);
        fetchMachines();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to assign machine', 'error');
      console.error('Error assigning machine:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this machine?')) return;
    try {
      const response = await api.delete(`/admin/machines/${id}`);
      if (response.data.success) {
        showToast('Machine deleted', 'success');
        fetchMachines();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete machine', 'error');
      console.error('Error deleting machine:', error);
    }
  };

  const categoryNames = {
    big: 'Big Machines',
    lab: 'Lab Equipment',
    consumables: 'Consumable Goods',
    equipment: 'Equipment'
  };

  const isLabEquipment = category === 'lab';
  const isConsumable = category === 'consumables';
  const isEquipment = category === 'equipment';
  const isBigMachine = category === 'big';

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/machines')}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
      >
        ← Back
      </button>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{categoryNames[category] || category}</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        {showForm ? 'Cancel' : `Add ${isLabEquipment ? 'Equipment' : 'Machine'}`}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isConsumable ? 'Item Name' : isEquipment ? 'Equipment Name' : isLabEquipment ? 'Equipment Name' : 'Machine Name'}
              </label>
              <input
                type="text"
                placeholder={
                  isConsumable ? "e.g., Cement, Steel Rods" :
                    isEquipment ? "e.g., Drill Machine, Hammer" :
                      isLabEquipment ? "e.g., Concrete Tester" :
                        "e.g., JCB, Crane"
                }
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {!isConsumable && !isLabEquipment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ownership Type</label>
                <select
                  value={formData.ownershipType}
                  onChange={(e) => setFormData({ ...formData, ownershipType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="own">Own</option>
                  <option value="rented">Rented</option>
                </select>
              </div>
            )}

            {!isConsumable && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model/Brand</label>
                <input
                  type="text"
                  placeholder="Model Number or Brand"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {isBigMachine && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plate Number</label>
                <input
                  type="text"
                  placeholder="e.g., DL-01-AB-1234"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {!isConsumable && !isLabEquipment && formData.ownershipType === 'rented' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                  <input
                    type="text"
                    placeholder="Enter vendor name"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Per Day Expense (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter daily rental cost"
                    value={formData.perDayExpense}
                    onChange={(e) => setFormData({ ...formData, perDayExpense: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {!isConsumable && !isLabEquipment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Machine Category</label>
                <input
                  type="text"
                  placeholder="e.g., Excavator, Crane, Mixer"
                  value={formData.machineCategory}
                  onChange={(e) => setFormData({ ...formData, machineCategory: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {!isConsumable && !isLabEquipment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Machine Photo URL</label>
                <input
                  type="text"
                  placeholder="Enter photo URL"
                  value={formData.machinePhoto}
                  onChange={(e) => setFormData({ ...formData, machinePhoto: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isConsumable ? 'Quantity (with unit)' : 'Quantity'}
              </label>
              <input
                type={isConsumable ? "text" : "number"}
                placeholder={isConsumable ? "e.g., 100 bags, 50 kg" : "Quantity"}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {!isConsumable && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="in-use">In Use</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            )}
          </div>
          <button type="submit" className="mt-5 px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
            Add {isConsumable ? 'Item' : isEquipment ? 'Equipment' : isLabEquipment ? 'Equipment' : 'Machine'}
          </button>
        </form>
      )}

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{isLabEquipment ? 'Equipment List' : 'Machines List'}</h2>

        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {machines.map(m => (
            <div key={m._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">{m.name}</div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Model:</span> {m.model || 'N/A'}</div>
                {!isLabEquipment && m.plateNumber && <div><span className="font-medium">Plate:</span> {m.plateNumber}</div>}
                <div><span className="font-medium">Quantity:</span> {m.quantity}</div>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${m.status === 'available' ? 'bg-green-100 text-green-800' :
                    m.status === 'in-use' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {m.status}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {!isLabEquipment && (
                  <button
                    onClick={() => { setSelectedMachine(m); setShowAssignModal(true); }}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600"
                  >
                    Assign
                  </button>
                )}
                <button
                  onClick={() => handleDelete(m.id)}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
                >
                  Delete
                </button>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Model</th>
                {!isLabEquipment && <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Plate Number</th>}
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {machines.map(m => (
                <tr key={m._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{m.name}</td>
                  <td className="px-4 py-3">{m.model || 'N/A'}</td>
                  {!isLabEquipment && <td className="px-4 py-3">{m.plateNumber || 'N/A'}</td>}
                  <td className="px-4 py-3">{m.quantity}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${m.status === 'available' ? 'bg-green-100 text-green-800' :
                      m.status === 'in-use' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {!isLabEquipment && (
                        <button
                          onClick={() => { setSelectedMachine(m); setShowAssignModal(true); }}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        >
                          Assign to Project
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Machine Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Machine to Project</h3>
            <p className="text-gray-600 mb-4">Machine: <strong>{selectedMachine?.name}</strong></p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Project or Contractor</label>
              <select
                value={assignProjectId}
                onChange={(e) => setAssignProjectId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Project or Contractor</option>
                <optgroup label="Projects">
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Contractors">
                  {contractors.map(c => (
                    <option key={c._id} value={c._id}>{c.name} (Contractor)</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assignAsRental}
                  onChange={(e) => setAssignAsRental(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Assign as Rental</span>
              </label>
            </div>

            {assignAsRental && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rental Per Day (₹)</label>
                <input
                  type="number"
                  placeholder="Enter rental cost per day"
                  value={rentalPerDay}
                  onChange={(e) => setRentalPerDay(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAssignMachine}
                className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                Assign
              </button>
              <button
                onClick={() => { setShowAssignModal(false); setSelectedMachine(null); setAssignProjectId(''); setAssignAsRental(false); setRentalPerDay(0); }}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineCategory;
