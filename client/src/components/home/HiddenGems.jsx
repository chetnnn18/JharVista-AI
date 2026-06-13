import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';
import API from '../../api/axios';
import { GridSkeleton } from '../ui/Skeleton';

const HiddenGems = () => {
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/places?hiddenGem=true')
      .then((res) => setGems(res.data.data.slice(0, 4)))
      .catch(() => setGems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Hidden Gems of Jharkhand
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Discovered by verified explorers
            </p>
          </div>
          <Link
            to="/explore?hiddenGem=true"
            className="text-primary dark:text-secondary font-semibold text-sm hover:underline"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <GridSkeleton count={4} />
        ) : (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {gems.map((gem, i) => (
              <motion.div
                key={gem._id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="shrink-0 w-64 sm:w-72"
              >
                <Link
                  to={`/places/${gem._id}`}
                  className="block rounded-2xl overflow-hidden shadow-lg card-hover bg-white dark:bg-slate-800"
                >
                  <div className="relative h-44">
                    <img
                      src={gem.images?.[0] || 'https://images.unsplash.com/photo-1519904981064-b0cf111d2940?w=400'}
                      alt={gem.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      New
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">{gem.name}</h3>
                    <p className="text-sm text-slate-500">{gem.district}</p>
                    <p className="text-xs text-slate-400 mt-1">{gem.category}</p>
                    <div className="flex items-center gap-1 mt-2 text-secondary text-xs font-medium">
                      <HiSparkles />
                      Explorer Verified — {gem.explorerName || 'Local Explorer'}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HiddenGems;
