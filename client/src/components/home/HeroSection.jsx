import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { HiSearch, HiLocationMarker, HiArrowRight } from 'react-icons/hi';

const COLLAGE = [
  {
    src: '/images/hundru.jpg',
    alt: 'Hundru Falls',
    label: 'Hundru Falls',
  },
  {
    src: '/images/stadium.jpg',
    alt: 'Ranchi Cricket Stadium',
    label: 'Ranchi Stadium',
  },
  {
    src: '/images/tribal.jpg',
    alt: 'Tribal Dance of Jharkhand',
    label: 'Tribal Culture',
  },
  {
    src: '/images/patratu.jpg',
    alt: 'Patratu Valley',
    label: 'Patratu Valley',
  },
];

const TRENDING = [
  'Hundru Falls',
  'Netarhat',
  'Patratu Valley',
  'Deoghar',
  'Betla National Park',
];

const DISTRICTS = [
  'Anywhere in Jharkhand',
  'Ranchi',
  'Deoghar',
  'Palamu',
  'Dumka',
  'Latehar',
  'Jamshedpur',
  'Netarhat',
  'Giridih',
];

const easeOut = [0.22, 1, 0.36, 1];

const HeroSection = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('Anywhere in Jharkhand');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (district !== 'Anywhere in Jharkhand') params.set('district', district);
    navigate(`/explore?${params.toString()}`);
  };

  const goToTrending = (destination) => {
    setSearch(destination);
    navigate(`/explore?search=${encodeURIComponent(destination)}`);
  };

  const motionProps = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.7, ease: easeOut },
        };

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden isolate">
      {/* 4-column image collage */}
      <div className="absolute inset-0 grid grid-cols-2 lg:grid-cols-4">
        {COLLAGE.map((item, index) => (
          <motion.div
            key={item.alt}
            custom={index}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.1,
              duration: 1.2,
              ease: easeOut,
            }}
            className="relative h-full overflow-hidden group"
          >
            <motion.img
              src={item.src}
              alt={item.alt}
              className="absolute inset-0 h-full w-full object-cover"
              initial={false}
              animate={
                prefersReducedMotion
                  ? {}
                  : { scale: [1, 1.06, 1] }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: 18,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: index * 2,
                      ease: 'easeInOut',
                    }
              }
            />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-500" />
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.08, duration: 0.5 }}
              className="absolute bottom-4 left-4 right-4 text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-white/80 drop-shadow-md hidden sm:block"
            >
              {item.label}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" aria-hidden />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(0,0,0,0.45) 100%), linear-gradient(180deg, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.35) 45%, rgba(15,23,42,0.75) 100%)',
        }}
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent pointer-events-none" aria-hidden />

      {/* Center + bottom content */}
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 text-center pt-16 sm:pt-20">
          <motion.div
            {...motionProps(0.25)}
            className="max-w-5xl mx-auto space-y-3 sm:space-y-4"
          >
            <h1 className="font-bold text-white tracking-tight leading-[1.05]">
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[80px] lg:leading-[1.02]">
                Not Just Places.
              </span>
              <span className="block mt-1 sm:mt-2 text-script text-3xl sm:text-4xl md:text-5xl lg:text-[72px] lg:leading-[1.1] font-normal">
                Experience Jharkhand.
              </span>
            </h1>
            <motion.p
              {...motionProps(0.45)}
              className="text-white/85 text-base sm:text-lg lg:text-xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed px-2"
            >
              Explore Nature, Culture, Adventure and Hidden Gems.
            </motion.p>
          </motion.div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-8 sm:pb-10 lg:pb-12">
          <motion.form
            {...motionProps(0.55)}
            onSubmit={handleSearch}
            className="rounded-2xl sm:rounded-full border border-white/25 bg-white/10 backdrop-blur-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.55)] p-2 sm:p-1.5 flex flex-col sm:flex-row sm:items-stretch gap-2 sm:gap-0"
          >
            <label className="flex flex-1 items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 min-w-0 sm:border-r border-white/15">
              <span className="sr-only">Destination</span>
              <HiSearch className="text-white/60 text-xl shrink-0" aria-hidden />
              <input
                type="text"
                placeholder="Where do you want to explore?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full min-w-0 bg-transparent outline-none text-white placeholder:text-white/50 text-sm sm:text-base"
              />
            </label>

            <label className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 sm:min-w-[220px] sm:border-r border-white/15 relative">
              <span className="sr-only">District</span>
              <HiLocationMarker className="text-secondary text-xl shrink-0" aria-hidden />
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full appearance-none bg-transparent outline-none text-white text-sm sm:text-base cursor-pointer pr-6"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d} className="text-slate-900">
                    {d}
                  </option>
                ))}
              </select>
            </label>

            <motion.button
              type="submit"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-full bg-secondary hover:bg-green-400 text-white font-semibold text-sm sm:text-base px-6 py-3.5 sm:py-0 sm:min-w-[140px] transition-colors shadow-lg"
            >
              Search
              <HiArrowRight className="text-lg" aria-hidden />
            </motion.button>
          </motion.form>

          <motion.div
            {...motionProps(0.7)}
            className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-white/60 text-xs sm:text-sm font-medium tracking-wide mr-0.5">
              Trending
            </span>
            {TRENDING.map((chip, i) => (
              <motion.button
                key={chip}
                type="button"
                onClick={() => goToTrending(chip)}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75 + i * 0.05, duration: 0.4 }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.04, backgroundColor: 'rgba(34, 197, 94, 0.35)' }}
                className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm text-white/95 bg-white/10 hover:bg-secondary/30 backdrop-blur-md border border-white/20 transition-colors"
              >
                {chip}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
