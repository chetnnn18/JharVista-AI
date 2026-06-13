import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './pages/Home';
import Explore from './pages/Explore';
import PlaceDetail from './pages/PlaceDetail';
import TripPlanner from './pages/TripPlanner';
import Reels from './pages/Reels';
import Districts from './pages/Districts';
import Circuits from './pages/Circuits';
import Login from './pages/Login';
import Register from './pages/Register';
import ExplorerDashboard from './pages/ExplorerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '12px',
                  background: '#0f172a',
                  color: '#f8fafc',
                },
              }}
            />
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="explore" element={<Explore />} />
                <Route path="places/:id" element={<PlaceDetail />} />
                <Route path="trip-planner" element={<TripPlanner />} />
                <Route path="reels" element={<Reels />} />
                <Route path="districts" element={<Districts />} />
                <Route path="circuits" element={<Circuits />} />
              </Route>

              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              <Route element={<ProtectedRoute roles={['explorer', 'admin']} />}>
                <Route element={<Layout />}>
                  <Route path="explorer" element={<ExplorerDashboard />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute roles={['admin']} />}>
                <Route element={<Layout />}>
                  <Route path="admin" element={<AdminDashboard />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
