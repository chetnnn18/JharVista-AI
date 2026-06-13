import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/home/HeroSection';
import ExploreExperiences from '../components/home/ExploreExperiences';
import PrideSection from '../components/home/PrideSection';
import HiddenGems from '../components/home/HiddenGems';
import ExplorerReels from '../components/home/ExplorerReels';
import TripPlannerSection from '../components/home/TripPlannerSection';
import PopularPlaces from '../components/home/PopularPlaces';
import DistrictsSection from '../components/home/DistrictsSection';
import VerifiedExplorer from '../components/home/VerifiedExplorer';

const Home = () => (
  <>
    <Helmet>
      <title>JharYatra AI — Explore Eco & Cultural Tourism in Jharkhand</title>
      <meta
        name="description"
        content="Smart digital platform to promote eco & cultural tourism in Jharkhand. Discover waterfalls, tribal culture, hidden gems, and AI trip planning."
      />
    </Helmet>
    <HeroSection />
    <ExploreExperiences />
    <PrideSection />
    <HiddenGems />
    <ExplorerReels />
    <TripPlannerSection />
    <PopularPlaces />
    <DistrictsSection />
    <VerifiedExplorer />
  </>
);

export default Home;
