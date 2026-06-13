import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HiLocationMarker, HiStar, HiClock } from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

const PlaceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([API.get(`/places/${id}`), API.get(`/reviews/place/${id}`)])
      .then(([placeRes, reviewRes]) => {
        setPlace(placeRes.data.data);
        setReviews(reviewRes.data.data);
      })
      .catch(() => toast.error('Failed to load place'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    setSubmitting(true);
    try {
      await API.post('/reviews', { placeId: id, rating, comment });
      toast.success('Review submitted!');
      const reviewRes = await API.get(`/reviews/place/${id}`);
      setReviews(reviewRes.data.data);
      const placeRes = await API.get(`/places/${id}`);
      setPlace(placeRes.data.data);
      setComment('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!place) return <p className="text-center py-20">Place not found</p>;

  return (
    <>
      <Helmet>
        <title>{place.name} — JharYatra AI</title>
      </Helmet>
      <div className="section-padding max-w-5xl mx-auto">
        <div className="rounded-3xl overflow-hidden shadow-2xl mb-8">
          <img
            src={place.images?.[0]}
            alt={place.name}
            className="w-full h-64 sm:h-96 object-cover"
          />
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">{place.name}</h1>
            <p className="text-slate-500 flex items-center gap-1 mt-1">
              <HiLocationMarker className="text-primary" /> {place.district} • {place.category}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-xl">
            <HiStar className="text-accent text-xl" />
            <span className="font-bold text-lg">{place.rating}</span>
            <span className="text-slate-500 text-sm">({place.reviewCount} reviews)</span>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{place.description}</p>

        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <HiClock className="text-secondary" />
          Best time to visit: {place.bestTime}
        </div>

        {place.nearbyPlaces?.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md mb-8">
            <h2 className="font-bold text-xl mb-4">Nearby Attractions</h2>
            <ul className="space-y-2">
              {place.nearbyPlaces.map((np) => (
                <li key={np.name} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <span>{np.name}</span>
                  <span className="text-secondary font-semibold">{np.distance}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
          <h2 className="font-bold text-xl mb-4">Reviews</h2>
          {user && (
            <form onSubmit={handleReview} className="mb-6 space-y-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRating(r)}
                    className={`text-2xl ${r <= rating ? 'text-accent' : 'text-slate-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-secondary"
                rows={3}
              />
              <Button type="submit" loading={submitting}>
                Submit Review
              </Button>
            </form>
          )}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-slate-500">No reviews yet. Be the first!</p>
            ) : (
              reviews.map((r) => (
                <div key={r._id} className="border-b border-slate-100 dark:border-slate-700 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{r.userId?.name}</span>
                    <span className="text-accent">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceDetail;
