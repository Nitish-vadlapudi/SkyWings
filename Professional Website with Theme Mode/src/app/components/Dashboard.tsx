import { Plane, Calendar, Award, MapPin, Clock, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Flight, Booking } from '../data/mockData';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const upcomingFlights: Booking[] = [
    {
      id: 'b1',
      pnr: 'SKY7X9P2',
      ticketNumber: 'TK8829371',
      flight: {
        id: '1',
        flightNumber: 'SK 401',
        from: 'London',
        fromCode: 'LHR',
        to: 'New York',
        toCode: 'JFK',
        departure: '10:30',
        arrival: '14:45',
        date: '2026-06-15',
        status: 'scheduled',
        gate: 'A12',
        terminal: '3',
        aircraft: 'Boeing 787-9',
        price: 850
      },
      passenger: {
        id: 'p1',
        firstName: 'Travel',
        lastName: 'Guest',
        email: 'guest@example.com',
        phone: '+1234567890',
        passportNumber: 'AB1234567',
        dateOfBirth: '1990-01-01',
        nationality: 'United States',
        loyaltyTier: 'Gold',
        loyaltyPoints: 45000
      },
      checkedIn: false,
      baggage: { cabin: 1, checked: 1, extra: 0, totalCost: 0 }
    }
  ];

  const loyaltyInfo = {
    tier: 'Gold',
    points: 45000,
    nextTier: 'Platinum',
    pointsToNext: 25000
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your bookings and track your journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Flights</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{upcomingFlights.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active bookings</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Check-In Status</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Ready</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Complete your check-in</div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold">{loyaltyInfo.tier} Member</h3>
            </div>
            <div className="text-3xl font-bold mb-1">{loyaltyInfo.points.toLocaleString()}</div>
            <div className="text-sm text-amber-100">{loyaltyInfo.pointsToNext.toLocaleString()} to {loyaltyInfo.nextTier}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Upcoming Flights</h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {upcomingFlights.map(booking => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                        {booking.flight.flightNumber}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.checkedIn
                          ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                      }`}>
                        {booking.checkedIn ? 'Checked In' : 'Not Checked In'}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">From</div>
                        <div className="font-semibold text-gray-900 dark:text-white text-lg">{booking.flight.fromCode}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{booking.flight.from}</div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1 rotate-90" />
                          <div className="text-xs text-gray-600 dark:text-gray-400">Direct Flight</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">To</div>
                        <div className="font-semibold text-gray-900 dark:text-white text-lg">{booking.flight.toCode}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{booking.flight.to}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{booking.flight.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{booking.flight.departure}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Gate {booking.flight.gate}, Terminal {booking.flight.terminal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {!booking.checkedIn ? (
                      <button
                        onClick={() => onNavigate('check-in')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                      >
                        Check-In Now
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigate('boarding-pass')}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        View Boarding Pass
                      </button>
                    )}
                    <button
                      onClick={() => onNavigate('manage')}
                      className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium whitespace-nowrap"
                    >
                      Manage Booking
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('flights')}
                className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
              >
                Book a New Flight
              </button>
              <button
                onClick={() => onNavigate('check-in')}
                className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
              >
                Web Check-In
              </button>
              <button
                onClick={() => onNavigate('manage')}
                className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
              >
                Manage My Trips
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Travel Updates</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Check-in opens 24 hours before departure</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">SK 401 to New York</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Flight on schedule</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">All systems operational</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
