import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Itinerary } from '../types';
import { itineraryApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Info, 
  Trash2,
  Share2
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const ItineraryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id && token) {
      fetchItinerary();
    }
  }, [id, token]);

  const fetchItinerary = async () => {
    if (!id || !token) return;
    
    try {
      setIsLoading(true);
      const response = await itineraryApi.getItinerary(id, token);
      
      if (response.status === 'success') {
        setItinerary(response.data);
      } else {
        toast.error('Failed to load itinerary');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load itinerary');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !token) return;
    
    if (!window.confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await itineraryApi.deleteItinerary(id, token);
      
      if (response.status === 'success') {
        toast.success('Itinerary deleted successfully');
        navigate('/dashboard');
      } else {
        toast.error('Failed to delete itinerary');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete itinerary');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Travel Itinerary: ${itinerary?.travel_itinerary.from_location} to ${itinerary?.travel_itinerary.to_location}`,
        text: `Check out my travel itinerary from ${itinerary?.travel_itinerary.from_location} to ${itinerary?.travel_itinerary.to_location}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEEE, MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading itinerary..." />
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Itinerary Not Found</h2>
          <p className="text-slate-600 mb-4">The requested itinerary could not be found.</p>
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { travel_itinerary, days, summary, tips, created_at, model_used } = itinerary;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="btn btn-secondary p-2"
              title="Share Itinerary"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn btn-danger p-2 disabled:opacity-50"
              title="Delete Itinerary"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Title and Overview */}
        <div className="card mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              {travel_itinerary.from_location} to {travel_itinerary.to_location}
            </h1>
            <p className="text-slate-600">
              {created_at ? `Created on ${formatDate(created_at)}` : 'Custom Itinerary'}
              {model_used && (
                <span className="ml-2 text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                  Generated with {model_used.toUpperCase()}
                </span>
              )}
            </p>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Route</p>
                <p className="font-semibold text-slate-900">{days.length} Days</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Travel Dates</p>
                <p className="font-semibold text-slate-900">{travel_itinerary.dates}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Budget</p>
                <p className="font-semibold text-slate-900">${travel_itinerary.budget}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Estimated Cost</p>
                <p className="font-semibold text-slate-900">${summary.total_estimated_cost}</p>
              </div>
            </div>
          </div>

          {/* Budget Summary */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-medium">Budget Summary</span>
              <div className="text-right">
                <span className={`text-lg font-bold ${
                  summary.remaining_budget >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {summary.remaining_budget >= 0 ? '+' : ''}${summary.remaining_budget}
                </span>
                <p className="text-sm text-slate-500">Remaining</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Itinerary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Daily Itinerary</h2>
          <div className="space-y-6">
            {days.map((day, index) => (
              <div key={index} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    Day {index + 1}: {day.theme}
                  </h3>
                  <div className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    Budget: ${day.budget}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span>Morning</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed">{day.morning}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                      <span>Afternoon</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed">{day.afternoon}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span>Evening</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed">{day.evening}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Tips */}
        {tips.length > 0 && (
          <div className="card">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Info className="h-6 w-6 text-blue-600" />
              <span>Travel Tips & Recommendations</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryDetail;