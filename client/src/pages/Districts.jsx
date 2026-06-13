import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import API from '../api/axios';
import { GridSkeleton } from '../components/ui/Skeleton';

const Districts = () => {
  const [searchParams] = useSearchParams();
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const filterDistrict = searchParams.get('district');

  useEffect(() => {
    API.get('/districts')
      .then((res) => setDistricts(res.data.data))
      .catch(() => setDistricts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterDistrict
    ? districts.filter((d) => d.name.toLowerCase() === filterDistrict.toLowerCase())
    : districts;

  return (
    <>
      <Helmet>
        <title>Districts — JharYatra AI</title>
      </Helmet>
      <div className="section-padding max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Explore by District</h1>
        <p className="text-slate-500 mb-8">All 24 districts of Jharkhand</p>

        {loading ? (
          <GridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d) => (
              <div key={d._id} className="rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-slate-800 card-hover">
                <img src={d.image} alt={d.name} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-2">{d.name}</h2>
                  <p className="text-slate-500 text-sm mb-4">{d.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <p className="font-bold text-primary">{d.touristPlaces}+</p>
                      <p className="text-xs text-slate-500">Tourist</p>
                    </div>
                    <div className="bg-secondary/10 rounded-lg p-2">
                      <p className="font-bold text-secondary">{d.culturalPlaces}+</p>
                      <p className="text-xs text-slate-500">Cultural</p>
                    </div>
                    <div className="bg-accent/10 rounded-lg p-2">
                      <p className="font-bold text-accent">{d.hiddenGems}+</p>
                      <p className="text-xs text-slate-500">Gems</p>
                    </div>
                  </div>
                  <Link
                    to={`/explore?district=${encodeURIComponent(d.name)}`}
                    className="text-primary dark:text-secondary font-semibold text-sm hover:underline"
                  >
                    Explore {d.name} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Districts;
