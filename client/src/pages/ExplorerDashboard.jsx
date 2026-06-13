import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import API from '../api/axios';
import Button from '../components/ui/Button';

const ExplorerDashboard = () => {
  const [activeTab, setActiveTab] = useState('place');
  const [loading, setLoading] = useState(false);

  const [placeForm, setPlaceForm] = useState({
    name: '',
    district: 'Ranchi',
    category: 'Waterfalls',
    description: '',
    bestTime: 'October - March',
  });

  const [reelForm, setReelForm] = useState({
    title: '',
    instagramLink: '',
    placeName: '',
    location: '',
  });

  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const submitPlace = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(placeForm).forEach(([k, v]) => formData.append(k, v));
      images.forEach((img) => formData.append('images', img));
      await API.post('/places', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Hidden place submitted for approval!');
      setPlaceForm({ name: '', district: 'Ranchi', category: 'Waterfalls', description: '', bestTime: 'October - March' });
      setImages([]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitReel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(reelForm).forEach(([k, v]) => formData.append(k, v));
      if (thumbnail) formData.append('thumbnail', thumbnail);
      await API.post('/reels', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Reel submitted for approval!');
      setReelForm({ title: '', instagramLink: '', placeName: '', location: '' });
      setThumbnail(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-secondary';

  return (
    <>
      <Helmet>
        <title>Explorer Dashboard — JharYatra AI</title>
      </Helmet>
      <div className="section-padding max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Explorer Dashboard</h1>
        <p className="text-slate-500 mb-8">Add hidden gems and reels for the community</p>

        <div className="flex gap-2 mb-8">
          {['place', 'reel'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-medium capitalize ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              Add {tab}
            </button>
          ))}
        </div>

        {activeTab === 'place' ? (
          <form onSubmit={submitPlace} className="space-y-4 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <input
              className={inputClass}
              placeholder="Place Name"
              required
              value={placeForm.name}
              onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })}
            />
            <select
              className={inputClass}
              value={placeForm.district}
              onChange={(e) => setPlaceForm({ ...placeForm, district: e.target.value })}
            >
              {['Ranchi', 'Deoghar', 'Palamu', 'Dumka', 'Latehar', 'West Singhbhum'].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              className={inputClass}
              value={placeForm.category}
              onChange={(e) => setPlaceForm({ ...placeForm, category: e.target.value })}
            >
              {['Waterfalls', 'Hills & Valleys', 'Tribal Culture', 'Adventure Trails', 'Temples'].map(
                (c) => (
                  <option key={c}>{c}</option>
                )
              )}
            </select>
            <textarea
              className={inputClass}
              placeholder="Description"
              rows={4}
              value={placeForm.description}
              onChange={(e) => setPlaceForm({ ...placeForm, description: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages([...e.target.files])}
              className={inputClass}
            />
            <Button type="submit" loading={loading}>
              Submit Hidden Place
            </Button>
          </form>
        ) : (
          <form onSubmit={submitReel} className="space-y-4 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <input
              className={inputClass}
              placeholder="Reel Title"
              required
              value={reelForm.title}
              onChange={(e) => setReelForm({ ...reelForm, title: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Instagram Reel Link"
              required
              value={reelForm.instagramLink}
              onChange={(e) => setReelForm({ ...reelForm, instagramLink: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Place Name"
              value={reelForm.placeName}
              onChange={(e) => setReelForm({ ...reelForm, placeName: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Location"
              value={reelForm.location}
              onChange={(e) => setReelForm({ ...reelForm, location: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className={inputClass}
            />
            <Button type="submit" loading={loading}>
              Submit Reel
            </Button>
          </form>
        )}
      </div>
    </>
  );
};

export default ExplorerDashboard;
