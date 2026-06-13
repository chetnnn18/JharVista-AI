import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import API from '../api/axios';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingPlaces, setPendingPlaces] = useState([]);
  const [pendingReels, setPendingReels] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, placesRes, reelsRes, usersRes] = await Promise.all([
        API.get('/users/stats'),
        API.get('/places/pending/all'),
        API.get('/reels/pending/all'),
        API.get('/users'),
      ]);
      setStats(statsRes.data.data);
      setPendingPlaces(placesRes.data.data);
      setPendingReels(reelsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approvePlace = async (id) => {
    try {
      await API.put(`/places/${id}/approve`);
      toast.success('Place approved');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const approveReel = async (id) => {
    try {
      await API.put(`/reels/${id}/approve`);
      toast.success('Reel approved');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateRole = async (userId, role) => {
    try {
      await API.put(`/users/${userId}`, { role, explorerVerified: role === 'explorer' });
      toast.success('User role updated');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="section-padding max-w-7xl mx-auto space-y-4">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Users', value: stats?.users },
    { label: 'Places', value: stats?.places },
    { label: 'Reels', value: stats?.reels },
    { label: 'Districts', value: stats?.districts },
    { label: 'Explorers', value: stats?.explorers },
    { label: 'Pending Places', value: stats?.pendingPlaces },
    { label: 'Pending Reels', value: stats?.pendingReels },
    { label: 'Trips Generated', value: stats?.trips },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — JharYatra AI</title>
      </Helmet>
      <div className="section-padding max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md text-center"
            >
              <p className="text-2xl font-bold text-primary dark:text-secondary">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
            <h2 className="font-bold text-xl mb-4">Pending Places ({pendingPlaces.length})</h2>
            {pendingPlaces.length === 0 ? (
              <p className="text-slate-500 text-sm">No pending places</p>
            ) : (
              <div className="space-y-3">
                {pendingPlaces.map((p) => (
                  <div key={p._id} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.district} — by {p.explorerName}</p>
                    </div>
                    <Button className="!px-3 !py-1.5 text-xs" onClick={() => approvePlace(p._id)}>
                      Approve
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
            <h2 className="font-bold text-xl mb-4">Pending Reels ({pendingReels.length})</h2>
            {pendingReels.length === 0 ? (
              <p className="text-slate-500 text-sm">No pending reels</p>
            ) : (
              <div className="space-y-3">
                {pendingReels.map((r) => (
                  <div key={r._id} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="font-medium">{r.title}</p>
                      <p className="text-xs text-slate-500">{r.explorerId?.name}</p>
                    </div>
                    <Button className="!px-3 !py-1.5 text-xs" onClick={() => approveReel(r._id)}>
                      Approve
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
          <h2 className="font-bold text-xl mb-4">Manage Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b dark:border-slate-700">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-slate-50 dark:border-slate-700">
                    <td className="py-3">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs capitalize">
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u._id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                      >
                        <option value="tourist">tourist</option>
                        <option value="explorer">explorer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
