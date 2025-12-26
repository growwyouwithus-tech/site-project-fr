/**
 * Main App Component
 * Handles routing and layout
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastManager } from './components/Toast';
import { useEffect } from 'react';
import { onNotification } from './services/socket';
import { showToast } from './components/Toast';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';

// Admin Pages
import Dashboard from './pages/Admin/Dashboard';
import Attendance from './pages/Admin/Attendance';
import Machines from './pages/Admin/Machines';
import MachineCategory from './pages/Admin/MachineCategory';
import Stock from './pages/Admin/Stock';
import Projects from './pages/Admin/Projects';
import ProjectDetail from './pages/Admin/ProjectDetail';
import Vendors from './pages/Admin/Vendors';
import Contractors from './pages/Admin/Contractors';
import Expenses from './pages/Admin/Expenses';
import Transfer from './pages/Admin/Transfer';
import Accounts from './pages/Admin/Accounts';
import Users from './pages/Admin/Users';
import Reports from './pages/Admin/Reports';
import Notifications from './pages/Admin/Notifications';

// Site Manager Pages
import SMDashboard from './pages/SiteManager/SMDashboard';
import SMAttendance from './pages/SiteManager/SMAttendance';
import Labour from './pages/SiteManager/Labour';
import LabourAttendance from './pages/SiteManager/LabourAttendance';
import StockIn from './pages/SiteManager/StockIn';
import SMTransfer from './pages/SiteManager/SMTransfer';
import DailyReport from './pages/SiteManager/DailyReport';
import Gallery from './pages/SiteManager/Gallery';
import SMExpenses from './pages/SiteManager/SMExpenses';
import Payment from './pages/SiteManager/Payment';
import SMNotifications from './pages/SiteManager/SMNotifications';
import Profile from './pages/SiteManager/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout with Sidebar and Navbar
const Layout = ({ children }) => {
  const { user } = useAuth();

  // Setup notification listener
  useEffect(() => {
    if (user) {
      // Play notification sound
      const playNotificationSound = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      };

      onNotification((notification) => {
        showToast(notification.message, 'info', 5000);
        playNotificationSound();
      });
    }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-bg-main">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-60 ml-0 transition-all duration-300">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// Main App Routes
const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        {/* Admin Routes */}
        {user.role === 'admin' ? (
          <>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/attendance" element={<Attendance />} />
            <Route path="/admin/machines" element={<Machines />} />
            <Route path="/admin/machines/:category" element={<MachineCategory />} />
            <Route path="/admin/stock" element={<Stock />} />
            <Route path="/admin/projects" element={<Projects />} />
            <Route path="/admin/projects/:id" element={<ProjectDetail />} />
            <Route path="/admin/vendors" element={<Vendors />} />
            <Route path="/admin/contractors" element={<Contractors />} />
            <Route path="/admin/expenses" element={<Expenses />} />
            <Route path="/admin/transfer" element={<Transfer />} />
            <Route path="/admin/accounts" element={<Accounts />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/site" replace />} />
            <Route path="/site" element={<SMDashboard />} />
            <Route path="/site/attendance" element={<SMAttendance />} />
            <Route path="/site/labour" element={<Labour />} />
            <Route path="/site/labour-attendance" element={<LabourAttendance />} />
            <Route path="/site/stock-in" element={<StockIn />} />
            <Route path="/site/transfer" element={<SMTransfer />} />
            <Route path="/site/daily-report" element={<DailyReport />} />
            <Route path="/site/gallery" element={<Gallery />} />
            <Route path="/site/expenses" element={<SMExpenses />} />
            <Route path="/site/payment" element={<Payment />} />
            <Route path="/site/notifications" element={<SMNotifications />} />
            <Route path="/site/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/site" replace />} />
          </>
        )}
      </Routes>
    </Layout>
  );
};

// Main App
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastManager />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
