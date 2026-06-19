import { useState } from 'react';
import { Search, Plane, Calendar, MapPin, Clock, ArrowRight, Filter } from 'lucide-react';
import { mockFlights } from '../data/mockData';

interface FlightsPageProps {
  onNavigate: (page: string) => void;
}

export function FlightsPage({ onNavigate }: FlightsPageProps) {
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredFlights = mockFlights.filter(flight => {
    const matchesFrom = !searchFrom || flight.from.toLowerCase().includes(searchFrom.toLowerCase()) || flight.fromCode.toLowerCase().includes(searchFrom.toLowerCase());
    const matchesTo = !searchTo || flight.to.toLowerCase().includes(searchTo.toLowerCase()) || flight.toCode.toLowerCase().includes(searchTo.toLowerCase());
    const matchesDate = !searchDate || flight.date === searchDate;
    return matchesFrom && matchesTo && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Find Your Flight
          </h1>
          <p className="text-blue-100 mb-8">
            Search and book flights to destinations worldwide
          </p>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    placeholder="City or airport"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    placeholder="City or airport"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Flights
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="mt-4 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide' : 'Show'} Advanced Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Available Flights ({filteredFlights.length})
          </h2>
        </div>

        {filteredFlights.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No flights found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria to find more flights
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFlights.map(flight => (
              <div
                key={flight.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-400 hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                          {flight.flightNumber}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          flight.status === 'scheduled'
                            ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        }`}>
                          {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6 items-center">
                        <div>
                          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {flight.fromCode}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {flight.from}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                            <Clock className="w-4 h-4" />
                            {flight.departure}
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-px w-12 bg-gray-300 dark:bg-gray-700"></div>
                            <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400 rotate-90" />
                            <div className="h-px w-12 bg-gray-300 dark:bg-gray-700"></div>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Direct Flight</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{flight.aircraft}</div>
                        </div>

                        <div className="text-right md:text-left">
                          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {flight.toCode}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {flight.to}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white md:justify-start justify-end">
                            <Clock className="w-4 h-4" />
                            {flight.arrival}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{flight.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>Terminal {flight.terminal}, Gate {flight.gate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:border-l lg:border-gray-200 lg:dark:border-gray-800 lg:pl-6 flex flex-col items-center lg:items-end gap-4">
                      <div className="text-center lg:text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starting from</div>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          ${flight.price}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">per person</div>
                      </div>

                      <button
                        onClick={() => onNavigate('check-in')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 font-medium flex items-center gap-2 shadow-lg"
                      >
                        Book Now
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
