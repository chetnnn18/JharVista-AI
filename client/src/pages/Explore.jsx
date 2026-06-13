import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HiLocationMarker, HiStar } from 'react-icons/hi';
import API from '../api/axios';
import { GridSkeleton } from '../components/ui/Skeleton';

const categories = [
  'All',
  'Waterfalls',
  'Forests & Wildlife',
  'Hills & Valleys',
  'Temples',
  'Tribal Culture',
  'Adventure Trails',
  'Sports',
  'Heritage',
];

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const hiddenGem = searchParams.get('hiddenGem') === 'true';

  useEffect(() => {
    setCategory(searchParams.get('category') || 'All');
    setSearch(searchParams.get('search') || '');
    setDistrict(searchParams.get('district') || '');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (search) params.set('search', search);
    if (district) params.set('district', district);
    if (hiddenGem) params.set('hiddenGem', 'true');

    API.get(`/places?${params}`)
      .then((res) => setPlaces(res.data.data))
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false));
  }, [category, search, district, hiddenGem]);

  return (
    <>
      <Helmet>
        <title>Explore Places — JharYatra AI</title>
      </Helmet>
      <div className="section-padding max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          {hiddenGem ? 'Hidden Gems' : 'Explore Jharkhand'}
        </h1>
        <p className="text-slate-500 mb-6">Discover amazing destinations across Jharkhand</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search places..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-secondary"
          />
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <GridSkeleton count={6} />
        ) : places.length === 0 ? (
          <p className="text-center text-slate-500 py-12">No places found. Try different filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <Link
                key={place._id}
                to={`/places/${place._id}`}
                className="rounded-2xl overflow-hidden shadow-lg card-hover bg-white dark:bg-slate-800 group"
              >
                <div className="relative h-48">
                  <img
                    src={place.images?.[0]}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {place.hiddenGem && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Hidden Gem
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{place.name}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <HiLocationMarker className="text-primary" /> {place.district}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {place.category}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-accent">
                      <HiStar /> {place.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Explore;
