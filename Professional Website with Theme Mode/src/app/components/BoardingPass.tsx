import { Download, Plane, Calendar, Clock, MapPin, User, Smartphone } from 'lucide-react';

interface BoardingPassProps {
  onNavigate: (page: string) => void;
}

export function BoardingPass({ onNavigate }: BoardingPassProps) {
  const booking = {
    pnr: 'SKY7X9P2',
    flightNumber: 'SK 401',
    from: 'London',
    fromCode: 'LHR',
    to: 'New York',
    toCode: 'JFK',
    departure: '10:30',
    date: '2026-06-15',
    gate: 'A12',
    terminal: '3',
    seat: '12A',
    boardingTime: '09:45',
    passengerName: 'GUEST/TRAVEL',
    class: 'Economy'
  };

  const handleDownload = () => {
    alert('Boarding pass download started. In a real app, this would generate a PDF.');
  };

  const handleEmail = () => {
    alert('Boarding pass sent to your email. Check your inbox.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your Boarding Pass
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Check-in successful! Your boarding pass is ready
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Plane className="w-6 h-6" />
                <span className="text-xl font-bold">SkyWings</span>
              </div>
              <div className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <span className="font-semibold">{booking.flightNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-6">
              <div>
                <div className="text-blue-100 text-sm mb-1">From</div>
                <div className="text-3xl font-bold">{booking.fromCode}</div>
                <div className="text-blue-100 text-sm">{booking.from}</div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-center">
                  <Plane className="w-8 h-8 mx-auto mb-1 rotate-90" />
                  <div className="text-xs text-blue-100">Direct</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-blue-100 text-sm mb-1">To</div>
                <div className="text-3xl font-bold">{booking.toCode}</div>
                <div className="text-blue-100 text-sm">{booking.to}</div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-100" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-100" />
                <span>Departure {booking.departure}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 w-8 h-8 bg-gray-50 dark:bg-gray-950 rounded-full -ml-4"></div>
            <div className="absolute right-0 top-0 w-8 h-8 bg-gray-50 dark:bg-gray-950 rounded-full -mr-4"></div>
            <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-800"></div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Passenger Name</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{booking.passengerName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Seat</div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{booking.seat}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Class</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{booking.class}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gate</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{booking.gate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Terminal</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{booking.terminal}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Boarding Time</div>
                    <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">{booking.boardingTime}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">PNR</div>
                    <div className="text-lg font-mono font-semibold text-gray-900 dark:text-white">{booking.pnr}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
                  <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-white dark:bg-gray-900 rounded-lg mb-2 mx-auto"></div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">{booking.pnr}</div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 text-center mt-3">
                  Scan at airport security and boarding gate
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-900 dark:text-orange-300">
                  <strong>Important:</strong> Please arrive at the boarding gate at least 45 minutes before departure. Boarding closes 15 minutes before departure.
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-105 font-semibold shadow-lg"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <button
                onClick={handleEmail}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold"
              >
                <Smartphone className="w-5 h-5" />
                Email to Me
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex-1 px-6 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Airport Info</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Terminal {booking.terminal}, Gate {booking.gate}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">On Time</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Flight status: Scheduled
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Seat {booking.seat}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Window seat, {booking.class}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
