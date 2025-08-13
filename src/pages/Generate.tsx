import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { ItineraryRequest, Itinerary } from '../types';
import { itineraryApi } from '../services/api';
import { MapPin, Calendar, DollarSign, Bot, Sparkles, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Generate: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ItineraryRequest>({
    defaultValues: {
      model: 'local',
    },
  });

  const selectedModel = watch('model');

  const onSubmit = async (data: ItineraryRequest) => {
    setIsGenerating(true);
    try {
      const response = await itineraryApi.generate(data, token || undefined);
      
      if (response.status === 'success') {
        setGeneratedItinerary(response.data);
        toast.success(isAuthenticated ? 'Itinerary generated and saved!' : 'Itinerary generated successfully!');
      } else {
        toast.error(response.message || 'Failed to generate itinerary');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate itinerary');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndView = () => {
    if (generatedItinerary?.id) {
      navigate(`/itinerary/${generatedItinerary.id}`);
    } else if (isAuthenticated) {
      navigate('/dashboard');
    }
  };

  const modelOptions = [
    {
      value: 'local',
      label: 'Static Template',
      description: 'Fast generation with pre-designed templates',
      icon: Sparkles,
      recommended: false,
    },
    {
      value: 'groq',
      label: 'Groq AI',
      description: 'Ultra-fast AI generation with smart recommendations',
      icon: Bot,
      recommended: true,
    },
    {
      value: 'openai',
      label: 'OpenAI GPT',
      description: 'Premium AI with detailed personalization',
      icon: Bot,
      recommended: false,
    },
  ];

  if (generatedItinerary) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Your Itinerary is Ready!
            </h1>
            <p className="text-slate-600">
              {generatedItinerary.travel_itinerary.from_location} → {generatedItinerary.travel_itinerary.to_location}
            </p>
          </div>

          {/* Itinerary Preview */}
          <div className="card mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                  {generatedItinerary.travel_itinerary.from_location} to {generatedItinerary.travel_itinerary.to_location}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{generatedItinerary.travel_itinerary.dates}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Budget: ${generatedItinerary.travel_itinerary.budget}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Est. Cost: ${generatedItinerary.summary.total_estimated_cost}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-semibold ${
                  generatedItinerary.summary.remaining_budget >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {generatedItinerary.summary.remaining_budget >= 0 ? '+' : ''}${generatedItinerary.summary.remaining_budget}
                </div>
                <div className="text-sm text-slate-500">Remaining Budget</div>
              </div>
            </div>

            {/* Days Overview */}
            <div className="space-y-4 mb-6">
              {generatedItinerary.days.map((day, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Day {index + 1}: {day.theme}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-slate-700">Morning:</span>
                      <p className="text-slate-600">{day.morning}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Afternoon:</span>
                      <p className="text-slate-600">{day.afternoon}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Evening:</span>
                      <p className="text-slate-600">{day.evening}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-sm font-medium text-slate-700">
                      Daily Budget: ${day.budget}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            {generatedItinerary.tips.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span>Travel Tips</span>
                </h4>
                <ul className="space-y-1">
                  {generatedItinerary.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-slate-700">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleSaveAndView}
                  className="btn btn-primary px-6 py-3"
                >
                  {generatedItinerary.id ? 'View Full Details' : 'Go to Dashboard'}
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-secondary px-6 py-3"
                >
                  Generate Another
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="btn btn-primary px-6 py-3"
                >
                  Sign Up to Save Itinerary
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-secondary px-6 py-3"
                >
                  Generate Another
                </button>
              </>
            )}
          </div>

          {!isAuthenticated && (
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Create an account to save your itineraries and access them anytime!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Generate Your Itinerary</h1>
          <p className="text-slate-600">
            Tell us about your dream trip and we'll create a personalized itinerary for you
          </p>
          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 <strong>Tip:</strong> Sign up to save your itineraries and access them later!
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
          {/* Origin */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              From Where?
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                {...register('from_location', {
                  required: 'Origin is required',
                  minLength: { value: 2, message: 'Please enter a valid city name' },
                })}
                type="text"
                className={`input pl-10 ${errors.from_location ? 'border-red-500' : ''}`}
                placeholder="e.g., Mumbai, New York, London"
              />
            </div>
            {errors.from_location && (
              <p className="text-red-600 text-sm mt-1">{errors.from_location.message}</p>
            )}
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              To Where?
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                {...register('to_location', {
                  required: 'Destination is required',
                  minLength: { value: 2, message: 'Please enter a valid city name' },
                })}
                type="text"
                className={`input pl-10 ${errors.to_location ? 'border-red-500' : ''}`}
                placeholder="e.g., Paris, Tokyo, Bali"
              />
            </div>
            {errors.to_location && (
              <p className="text-red-600 text-sm mt-1">{errors.to_location.message}</p>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Total Budget (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                {...register('budget', {
                  required: 'Budget is required',
                  min: { value: 100, message: 'Budget must be at least $100' },
                  max: { value: 50000, message: 'Budget cannot exceed $50,000' },
                  valueAsNumber: true,
                })}
                type="number"
                className={`input pl-10 ${errors.budget ? 'border-red-500' : ''}`}
                placeholder="e.g., 2000"
                min="100"
                step="50"
              />
            </div>
            {errors.budget && (
              <p className="text-red-600 text-sm mt-1">{errors.budget.message}</p>
            )}
          </div>

          {/* Dates */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Travel Dates
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                {...register('dates', {
                  required: 'Travel dates are required',
                  minLength: { value: 5, message: 'Please enter valid date range' },
                })}
                type="text"
                className={`input pl-10 ${errors.dates ? 'border-red-500' : ''}`}
                placeholder="e.g., 2025-08-15 to 2025-08-20"
              />
            </div>
            {errors.dates && (
              <p className="text-red-600 text-sm mt-1">{errors.dates.message}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Format: YYYY-MM-DD to YYYY-MM-DD
            </p>
          </div>

          {/* AI Model Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Choose AI Model
            </label>
            <div className="space-y-3">
              {modelOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedModel === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      {...register('model')}
                      type="radio"
                      value={option.value}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        selectedModel === option.value ? 'bg-primary-100' : 'bg-slate-100'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${
                          selectedModel === option.value ? 'text-primary-600' : 'text-slate-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-slate-900">{option.label}</h4>
                          {option.recommended && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{option.description}</p>
                      </div>
                    </div>
                    {selectedModel === option.value && (
                      <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full btn btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Generating Your Perfect Trip...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Generate Itinerary</span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Generate;