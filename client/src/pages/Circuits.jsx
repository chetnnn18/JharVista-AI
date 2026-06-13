import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const circuits = [
  {
    title: 'Waterfall Circuit',
    duration: '3 Days',
    places: ['Hundru Falls', 'Dassam Falls', 'Jonha Falls'],
    image: 'https://images.unsplash.com/photo-1519904981064-b0cf111d2940?w=600&q=80',
  },
  {
    title: 'Spiritual Circuit',
    duration: '2 Days',
    places: ['Baidyanath Temple', 'Basukinath', 'Naulakha Mandir'],
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
  },
  {
    title: 'Wildlife Circuit',
    duration: '4 Days',
    places: ['Betla National Park', 'Palamu Fort', 'Lodh Falls'],
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
  },
  {
    title: 'Hill Station Circuit',
    duration: '3 Days',
    places: ['Netarhat', 'Patratu Valley', 'Tagore Hill'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  },
  {
    title: 'Sports Heritage Circuit',
    duration: '2 Days',
    places: ['Ranchi Cricket Stadium', 'Dhoni Legacy Trail', 'Rock Garden'],
    image: 'https://images.unsplash.com/photo-1459865260367-59721e017ef0?w=600&q=80',
  },
  {
    title: 'Tribal Culture Circuit',
    duration: '3 Days',
    places: ['Dumka Tribal Village', 'Tati Jharna', 'Santhal Heritage'],
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
  },
];

const Circuits = () => (
  <>
    <Helmet>
      <title>Tourism Circuits — JharYatra AI</title>
    </Helmet>
    <div className="section-padding max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Tourism Circuits</h1>
      <p className="text-slate-500 mb-8">Curated multi-day routes across Jharkhand</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {circuits.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl overflow-hidden shadow-lg card-hover bg-white dark:bg-slate-800"
          >
            <div className="relative h-44">
              <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 right-3 bg-primary text-white text-xs px-3 py-1 rounded-full font-semibold">
                {c.duration}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2">{c.title}</h3>
              <p className="text-sm text-slate-500 mb-3">{c.places.join(' → ')}</p>
              <Link
                to="/trip-planner"
                className="text-primary dark:text-secondary font-semibold text-sm hover:underline"
              >
                Plan this circuit →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </>
);

export default Circuits;
