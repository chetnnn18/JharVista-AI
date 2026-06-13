import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiBadgeCheck } from 'react-icons/hi';
import Button from '../ui/Button';

const benefits = [
  'Add Hidden Places',
  'Upload Reels',
  'Upload Photos',
  'Share Travel Tips',
  'Build Community',
];

const VerifiedExplorer = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-primary to-primary-dark p-8 sm:p-12 text-center text-white shadow-2xl"
      >
        <HiBadgeCheck className="text-5xl text-accent mx-auto mb-4" />
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">Become a Verified Explorer</h2>
        <p className="text-white/80 mb-8 max-w-xl mx-auto">
          Join our community of local explorers and help discover Jharkhand&apos;s hidden treasures.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {benefits.map((b) => (
            <span
              key={b}
              className="px-4 py-2 rounded-full bg-white/15 text-sm font-medium backdrop-blur"
            >
              {b}
            </span>
          ))}
        </div>
        <Button
          variant="secondary"
          className="!px-8 !py-3"
          onClick={() => navigate('/register?role=explorer')}
        >
          Join as Explorer
        </Button>
      </motion.div>
    </section>
  );
};

export default VerifiedExplorer;
