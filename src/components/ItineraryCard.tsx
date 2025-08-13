import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Trash2, Eye } from 'lucide-react';
import { Itinerary } from '../types';
import { format, parseISO } from 'date-fns';

interface ItineraryCardProps {
  itinerary: Itinerary;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ 
  itinerary, 
  onDelete,
  isDeleting = false 
}) => {
  const { travel_itinerary, summary, days, id, created_at } = itinerary;

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete && id) {
      onDelete(id);
    }
  };

  return (
    <div className="card-hover group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary-600" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
              {travel_itinerary.from_location} → {travel_itinerary.to_location}
            </h3>
            <p className="text-sm text-slate-500">
              {created_at ? formatDate(created_at) : 'Recently created'}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to={`/itinerary/${id}`}
            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete Itinerary"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4" />
          <span>{travel_itinerary.dates}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <DollarSign className="h-4 w-4" />
          <span>Budget: ${travel_itinerary.budget}</span>
        </div>
        
        <div className="text-sm">
          <span className="text-slate-500">Est. Cost: </span>
          <span className="font-semibold text-slate-900">
            ${summary.total_estimated_cost}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-slate-600 mb-2">
          {days.length} day{days.length !== 1 ? 's' : ''} • {days.length > 0 ? days[0].theme : 'Custom itinerary'}
        </p>
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Remaining Budget:</span>
          <span className={`font-semibold ${
            summary.remaining_budget >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${summary.remaining_budget}
          </span>
        </div>
      </div>

      <Link
        to={`/itinerary/${id}`}
        className="block w-full text-center py-2 px-4 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg font-medium transition-colors"
      >
        View Full Itinerary
      </Link>
    </div>
  );
};

export default ItineraryCard;