import { useState, useEffect } from 'react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';
import Camera from '../../components/Camera';

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [capturedImages, setCapturedImages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projRes, galRes] = await Promise.all([
        api.get('/site/projects'),
        api.get('/site/gallery')
      ]);
      setProjects(projRes.data.data || []);
      setGallery(galRes.data.data || []);
      if (projRes.data.data.length > 0) setSelectedProject(projRes.data.data[0].id);
    } catch (error) {
      showToast('Failed to load data', 'error');
    }
  };

  const handlePhotoCapture = (photoData) => {
    setCapturedImages([...capturedImages, photoData]);
    setShowCamera(false);
  };

  const handleUpload = async () => {
    if (capturedImages.length === 0) {
      showToast('Please capture at least one photo', 'error');
      return;
    }
    try {
      await api.post('/site/gallery', { projectId: selectedProject, images: capturedImages });
      showToast('Images uploaded successfully', 'success');
      setCapturedImages([]);
      fetchData();
    } catch (error) {
      showToast('Failed to upload images', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Gallery</h1>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Progress Photos</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="w-full md:max-w-md px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowCamera(true)} className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
            📸 Capture Photo
          </button>
          {capturedImages.length > 0 && (
            <button onClick={handleUpload} className="px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
              Upload {capturedImages.length} Photo(s)
            </button>
          )}
        </div>
        {capturedImages.length > 0 && (
          <p className="mt-3 text-green-600 font-semibold">✓ {capturedImages.length} photo(s) captured</p>
        )}
      </div>

      {showCamera && <Camera onCapture={handlePhotoCapture} onClose={() => setShowCamera(false)} />}

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Gallery Images</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {gallery.map(g => (
            <div key={g.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 md:h-40 bg-gray-100 flex items-center justify-center">
                <span className="text-4xl md:text-5xl">📷</span>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-600 truncate">{g.projectId}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(g.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
