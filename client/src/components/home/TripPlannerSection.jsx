import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const budgets = ['Budget', 'Mid-Range', 'Luxury'];
const durations = [1, 2, 3, 4, 5, 7];
const interestOptions = [
  'Waterfalls',
  'Wildlife',
  'Temples',
  'Tribal Culture',
  'Adventure',
  'Hills',
  'Sports Tourism',
];
const districtOptions = [
  'Ranchi',
  'Deoghar',
  'Palamu',
  'Dumka',
  'Latehar',
  'Jamshedpur',
  'West Singhbhum',
];

const TripPlannerSection = () => {
  const [budget, setBudget] = useState('Mid-Range');
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState(['Waterfalls', 'Hills']);
  const [startingDistrict, setStartingDistrict] = useState('Ranchi');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (item) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleGenerate = async () => {
    if (interests.length === 0) {
      toast.error('Select at least one interest');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/trips/generate-trip', {
        budget,
        days,
        interests,
        startingDistrict,
      });
      setPlan(res.data.data);
      toast.success('Your trip plan is ready!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="trip-planner" className="section-padding bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-dark opacity-95" />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HiSparkles className="text-accent text-2xl" />
              <span className="text-secondary font-semibold uppercase text-sm tracking-wider">
                AI Trip Planner
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Plan Your Perfect Jharkhand Journey
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-white/80 text-sm mb-1 block">Budget</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white text-slate-800 outline-none"
                >
                  {budgets.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white/80 text-sm mb-1 block">Trip Duration</label>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-white text-slate-800 outline-none"
                >
                  {durations.map((d) => (
                    <option key={d} value={d}>
                      {d} Day{d > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-white/80 text-sm mb-2 block">Your Interests</label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        interests.includes(item)
                          ? 'bg-secondary text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-white/80 text-sm mb-1 block">Starting District</label>
                <select
                  value={startingDistrict}
                  onChange={(e) => setStartingDistrict(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white text-slate-800 outline-none"
                >
                  {districtOptions.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              variant="secondary"
              className="w-full sm:w-auto !px-8 !py-3 text-base"
              onClick={handleGenerate}
              loading={loading}
            >
              <HiSparkles /> Generate My Trip
            </Button>
          </div>

          <div className="hidden lg:flex justify-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-8xl"
            >
              🎒🗺️📷🧭
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10 glass-dark rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-2">Your Itinerary</h3>
              <p className="text-slate-300 text-sm mb-6">{plan.summary}</p>
              <div className="space-y-4">
                {plan.days?.map((day) => (
                  <div key={day.day} className="bg-white/10 rounded-xl p-4">
                    <h4 className="font-bold text-secondary">
                      Day {day.day}: {day.title}
                    </h4>
                    <p className="text-white text-sm mt-1">
                      {day.places?.join(' → ')}
                    </p>
                    <p className="text-slate-400 text-xs mt-2">
                      {day.activities?.join(' • ')}
                    </p>
                    {day.estimatedCost && (
                      <span className="text-accent text-xs font-medium">{day.estimatedCost}</span>
                    )}
                  </div>
                ))}
              </div>
              {plan.tips && (
                <div className="mt-4">
                  <p className="text-white/80 text-sm font-semibold mb-2">Pro Tips:</p>
                  <ul className="text-slate-400 text-sm space-y-1">
                    {plan.tips.map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-center mt-8">
            <LoadingSpinner size="lg" />
          </div>
        )}
      </div>
    </section>
  );
};

export default TripPlannerSection;
