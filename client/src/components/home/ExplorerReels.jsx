import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';
import API from '../../api/axios';
import Skeleton from '../ui/Skeleton';

const ExplorerReels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/reels')
      .then((res) => setReels(res.data.data.slice(0, 6)))
      .catch(() => setReels([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Explorer Reels</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Instagram-style stories from verified influencers
            </p>
          </div>
          <Link to="/reels" className="text-primary dark:text-secondary font-semibold text-sm hover:underline">
            View All Reels →
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-x-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-24 h-24 rounded-full shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 justify-start sm:justify-center">
            {reels.map((reel, i) => (
              <motion.a
                key={reel._id}
                href={reel.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.08 }}
                className="flex flex-col items-center gap-2 shrink-0 group"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-secondary via-primary to-accent">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-slate-900 relative">
                    <img
                      src={reel.thumbnail || 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=200'}
                      alt={reel.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaPlay className="text-white text-sm" />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-800 dark:text-white">
                    {reel.explorerId?.instagram || reel.explorerId?.name || '@explorer'}
                  </p>
                  <p className="text-[10px] text-slate-500">{reel.placeName || reel.location}</p>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExplorerReels;
