import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ExperienceCard = ({ title, count, image, icon: Icon, category, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08 }}
  >
    <Link
      to={`/explore?category=${encodeURIComponent(category)}`}
      className="group relative block h-52 sm:h-56 rounded-2xl overflow-hidden card-hover shadow-lg"
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 gradient-overlay" />
      <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white">
            <Icon className="text-xl" />
          </div>
        )}
        <div>
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <p className="text-white/80 text-sm">{count}</p>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default ExperienceCard;
