import { FaWater, FaTree, FaMountain, FaPlaceOfWorship, FaUsers, FaHiking } from 'react-icons/fa';
import ExperienceCard from '../ui/ExperienceCard';

const experiences = [
  {
    title: 'Waterfalls',
    count: '25+ Places',
    category: 'Waterfalls',
    image: 'https://images.unsplash.com/photo-1519904981064-b0cf111d2940?w=600&q=80',
    icon: FaWater,
  },
  {
    title: 'Forests & Wildlife',
    count: '18+ Places',
    category: 'Forests & Wildlife',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    icon: FaTree,
  },
  {
    title: 'Hills & Valleys',
    count: '20+ Places',
    category: 'Hills & Valleys',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    icon: FaMountain,
  },
  {
    title: 'Temples',
    count: '30+ Places',
    category: 'Temples',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180a1ea49b?w=600&q=80',
    icon: FaPlaceOfWorship,
  },
  {
    title: 'Tribal Culture',
    count: '15+ Places',
    category: 'Tribal Culture',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    icon: FaUsers,
  },
  {
    title: 'Adventure Trails',
    count: '12+ Places',
    category: 'Adventure Trails',
    image: 'https://images.unsplash.com/photo-1551632811-561732d0560b?w=600&q=80',
    icon: FaHiking,
  },
];

const ExploreExperiences = () => (
  <section className="section-padding bg-background dark:bg-dark">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          Explore Experiences
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Discover Jharkhand through curated categories
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {experiences.map((exp, i) => (
          <ExperienceCard key={exp.title} {...exp} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default ExploreExperiences;
