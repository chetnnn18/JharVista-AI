import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiMap } from 'react-icons/hi';
import API from '../../api/axios';
import Button from '../ui/Button';
import { GridSkeleton } from '../ui/Skeleton';

const PopularPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    API.get('/places')
      .then((res) => {
        const data = res.data.data.filter((p) => !p.hiddenGem).slice(0, 4);
        setPlaces(data);
        setSelected(data[0]);
      })
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-background dark:bg-dark">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Popular Places Near You
        </h2>

        {loading ? (
          <GridSkeleton count={2} />
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide lg:flex-col lg:overflow-visible">
              {places.map((place) => (
                <motion.button
                  key={place._id}
                  onClick={() => setSelected(place)}
                  whileHover={{ scale: 1.02 }}
                  className={`shrink-0 lg:shrink flex gap-4 p-4 rounded-2xl text-left transition-all card-hover ${
                    selected?._id === place._id
                      ? 'bg-primary/10 border-2 border-primary dark:border-secondary'
                      : 'bg-white dark:bg-slate-800 shadow-md'
                  }`}
                >
                  <img
                    src={place.images?.[0]}
                    alt={place.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{place.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <HiLocationMarker className="text-primary" />
                      {place.district}
                    </p>
                    <p className="text-xs text-secondary mt-1">
                      {place.nearbyPlaces?.[0]?.distance || '18 km'} away
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="space-y-6">
              {selected && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">{selected.name} — Nearby</h3>
                  <ul className="space-y-3">
                    {selected.nearbyPlaces?.map((np) => (
                      <li
                        key={np.name}
                        className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                      >
                        <span className="font-medium">{np.name}</span>
                        <span className="text-secondary text-sm font-semibold">{np.distance}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={`/places/${selected._id}`} className="inline-block mt-4">
                    <Button>View Details</Button>
                  </Link>
                </div>
              )}

              <div className="relative rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="absolute inset-0 opacity-30">
                  {[...Array(5)].map((_, i) => (
                    <HiLocationMarker
                      key={i}
                      className="absolute text-primary text-2xl"
                      style={{
                        top: `${20 + i * 15}%`,
                        left: `${15 + i * 18}%`,
                      }}
                    />
                  ))}
                </div>
                <div className="relative text-center z-10">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-3">
                    <HiMap className="text-3xl text-primary" />
                  </div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">Interactive Map</p>
                  <p className="text-sm text-slate-500">Jharkhand Tourism Map</p>
                  <Button variant="outline" className="mt-3 !text-sm">
                    View on Map
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularPlaces;
