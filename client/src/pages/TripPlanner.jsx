import { Helmet } from 'react-helmet-async';
import TripPlannerSection from '../components/home/TripPlannerSection';

const TripPlanner = () => (
  <>
    <Helmet>
      <title>AI Trip Planner — JharYatra AI</title>
    </Helmet>
    <div className="pt-8">
      <TripPlannerSection />
    </div>
  </>
);

export default TripPlanner;
