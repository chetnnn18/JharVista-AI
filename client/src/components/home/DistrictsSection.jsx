import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import { GridSkeleton } from '../ui/Skeleton';

const DistrictsSection = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/districts')
      .then((res) => setDistricts(res.data.data.slice(0, 7)))
      .catch(() => setDistricts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Explore by District</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            All Jharkhand districts at a glance
          </p>
        </div>

        {loading ? (
          <GridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {districts.map((d, i) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/districts?district=${encodeURIComponent(d.name)}`}
                  className="block rounded-2xl overflow-hidden shadow-lg card-hover group"
                >
                  <div className="relative h-40">
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 gradient-overlay" />
                    <h3 className="absolute bottom-3 left-4 text-white font-bold text-xl">
                      {d.name}
                    </h3>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="font-bold text-primary dark:text-secondary">{d.touristPlaces}+</p>
                      <p className="text-slate-500">Places</p>
                    </div>
                    <div>
                      <p className="font-bold text-primary dark:text-secondary">{d.culturalPlaces}+</p>
                      <p className="text-slate-500">Culture</p>
                    </div>
                    <div>
                      <p className="font-bold text-primary dark:text-secondary">{d.hiddenGems}+</p>
                      <p className="text-slate-500">Gems</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/districts"
            className="text-primary dark:text-secondary font-semibold hover:underline"
          >
            View All Districts →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DistrictsSection;
