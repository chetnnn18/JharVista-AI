import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaIndustry } from 'react-icons/fa';
import { GiCricketBat } from 'react-icons/gi';
import { GiTribalMask } from 'react-icons/gi';

const legacyCards = [
  { title: 'Ranchi Cricket Stadium', icon: GiCricketBat, link: '/explore?search=Ranchi+Cricket+Stadium' },
  { title: 'Dhoni Legacy Trail', icon: GiCricketBat, link: '/explore?search=Dhoni' },
  { title: 'Sports Tourism', icon: GiCricketBat, link: '/explore?category=Sports' },
  { title: 'Ratan Tata Legacy', icon: FaIndustry, link: '/explore?search=Jamshedpur' },
  { title: 'Tribal Heritage', icon: GiTribalMask, link: '/explore?category=Tribal+Culture' },
];

const PrideSection = () => (
  <section className="section-padding">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden bg-dark text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-dark to-primary/30" />
        <div className="relative p-6 sm:p-10 lg:p-12">
          <div className="flex items-center gap-2 mb-2">
            <FaShieldAlt className="text-accent text-xl" />
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Pride of Jharkhand
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">
            Legends. Leaders. <span className="text-accent">Jharkhand.</span>
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg">
            From inspiring leaders to unforgettable legacy.
          </p>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="glass-dark rounded-2xl p-5 border border-slate-700/50">
                <h3 className="text-xl font-bold text-secondary mb-2">Mahendra Singh Dhoni</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Indian Cricket Team Captain — Ranchi&apos;s pride. Explore sports tourism & legacy trails.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['Dhoni Legacy Trail', 'Ranchi Cricket Stadium', 'Sports Tourism'].map((t) => (
                    <span key={t} className="px-2 py-1 bg-primary/30 rounded-lg text-secondary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="glass-dark rounded-2xl p-5 border border-slate-700/50">
                <h3 className="text-xl font-bold text-accent mb-2">Ratan Tata</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Visionary industrialist who built Jamshedpur — Tata legacy & heritage tourism.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['Tata Legacy', 'Jamshedpur Heritage', 'Industrial Tourism'].map((t) => (
                    <span key={t} className="px-2 py-1 bg-accent/20 rounded-lg text-accent">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-36 sm:w-44 h-52 rounded-2xl overflow-hidden border-2 border-blue-500/50 shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1531415071028-046d734ae2e0?w=400&q=80"
                  alt="MS Dhoni - Indian Cricket Team"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-blue-900/80 text-center py-1 text-xs">
                  Team India Blue
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-36 sm:w-44 h-52 rounded-2xl overflow-hidden border-2 border-accent/50 shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"
                  alt="Ratan Tata"
                  className="w-full h-full object-cover object-top"
                />
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-8">
            {legacyCards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className="glass-dark rounded-xl p-4 text-center card-hover border border-slate-700/30 group"
              >
                <card.icon className="text-2xl text-secondary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-medium">{card.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PrideSection;
