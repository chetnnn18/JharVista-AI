import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaPlay, FaInstagram } from 'react-icons/fa';
import API from '../api/axios';
import { GridSkeleton } from '../components/ui/Skeleton';

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/reels')
      .then((res) => setReels(res.data.data))
      .catch(() => setReels([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Explorer Reels — JharYatra AI</title>
      </Helmet>
      <div className="section-padding max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Explorer Reels</h1>
        <p className="text-slate-500 mb-8">Travel stories from verified Jharkhand explorers</p>

        {loading ? (
          <GridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reels.map((reel) => (
              <a
                key={reel._id}
                href={reel.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl overflow-hidden shadow-lg card-hover bg-white dark:bg-slate-800"
              >
                <div className="relative h-56">
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaPlay className="text-white text-4xl" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{reel.title}</h3>
                  <p className="text-sm text-slate-500">{reel.placeName} — {reel.location}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-pink-600">
                    <FaInstagram />
                    {reel.explorerId?.instagram || reel.explorerId?.name}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Reels;
