import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Itinerary } from '../types';
import { itineraryApi } from '../services/api';
import ItineraryCard from '../components/ItineraryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusCircle, MapPin, Calendar, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const response = await itineraryApi.getMyItineraries(token);
      if (response.status === 'success') {
        // Support both array and object response for data
        let itinerariesArr: Itinerary[] = [];
        if (Array.isArray(response.data)) {
          itinerariesArr = response.data;
        } else if (response.data && Array.isArray(response.data.itineraries)) {
          itinerariesArr = response.data.itineraries;
        }
        setItineraries(itinerariesArr);
      } else {
        toast.error('Failed to load itineraries');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load itineraries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    
    if (!window.confirm('Are you sure you want to delete this itinerary?')) {
      return;
    }

    try {
      setDeletingIds(prev => new Set(prev).add(id));
      const response = await itineraryApi.deleteItinerary(id, token);
      
      if (response.status === 'success') {
        setItineraries(prev => prev.filter(itinerary => itinerary.id !== id));
        toast.success('Itinerary deleted successfully');
      } else {
        toast.error('Failed to delete itinerary');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete itinerary');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your itineraries..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back, {user?.full_name || user?.email}!
              </h1>
              <p className="text-slate-600">
                Manage your travel itineraries and plan your next adventure
              </p>
            </div>
            
            <Link
              to="/generate"
              className="btn btn-primary flex items-center space-x-2 self-start sm:self-center"
            >
              <PlusCircle className="h-5 w-5" />
              <span>New Itinerary</span>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <MapPin className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{itineraries.length}</h3>
                <p className="text-slate-600">Total Itineraries</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-secondary-100 rounded-lg">
                <Calendar className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {itineraries.reduce((sum, itinerary) => sum + itinerary.days.length, 0)}
                </h3>
                <p className="text-slate-600">Total Days Planned</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-accent-100 rounded-lg">
                <Sparkles className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {new Set(itineraries.map(i => i.travel_itinerary.to_location)).size}
                </h3>
                <p className="text-slate-600">Destinations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Itineraries Grid */}
        {itineraries.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Your Itineraries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraries.map((itinerary) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  onDelete={handleDelete}
                  isDeleting={deletingIds.has(itinerary.id!)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-6">
              <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Itineraries Yet</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Start planning your perfect trip! Generate your first itinerary and let AI create 
                amazing travel experiences for you.
              </p>
            </div>
            
            <Link
              to="/generate"
              className="btn btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
            >
              <Sparkles className="h-5 w-5" />
              <span>Create Your First Itinerary</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;