import { GiLeafSwirl } from 'react-icons/gi';
import { FaHeart } from 'react-icons/fa';
import { HiShieldCheck, HiSparkles, HiUsers } from 'react-icons/hi2';

const stats = [
  { icon: GiLeafSwirl, label: '500+ Tourist Places' },
  { icon: HiUsers, label: '24+ Districts' },
  { icon: HiSparkles, label: '100+ Hidden Gems' },
  { icon: HiUsers, label: '15+ Tribal Cultures' },
  { icon: GiLeafSwirl, label: '30+ Festivals' },
  { icon: FaHeart, label: 'Unlimited Memories' },
];

const Footer = () => (
  <footer>
    <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 section-padding">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {stats.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center text-center gap-2">
            <Icon className="text-2xl text-secondary" />
            <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-dark text-slate-400 py-4 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <span className="flex items-center gap-1">
            <HiUsers className="text-secondary" /> Curated by Locals
          </span>
          <span className="flex items-center gap-1">
            <HiShieldCheck className="text-secondary" /> Verified & Trusted
          </span>
          <span className="flex items-center gap-1">
            <HiSparkles className="text-secondary" /> Smart & Hassle-free
          </span>
        </div>
        <span className="flex items-center gap-1">
          Made with <FaHeart className="text-red-500" /> for Jharkhand
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
