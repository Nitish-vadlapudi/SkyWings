import { useState } from 'react';
import { Users, Plane, CheckCircle, BarChart3, Calendar, Settings, Bell, DollarSign } from 'lucide-react';

interface AdminPortalProps {
  onNavigate: (page: string) => void;
}

export function AdminPortal({ onNavigate }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'flights' | 'passengers' | 'checkins' | 'analytics'>('overview');

  const stats = {
    totalFlights: 248,
    activePassengers: 12453,
    checkedIn: 8932,
    revenue: 4285000
  };

  const recentFlights = [
    { id: 'SK401', route: 'LHR → JFK', status: 'On Time', passengers: 245, checkedIn: 198 },
    { id: 'SK208', route: 'DXB → SIN', status: 'Boarding', passengers: 380, checkedIn: 362 },
    { id: 'SK152', route: 'SYD → LAX', status: 'Delayed', passengers: 290, checkedIn: 275 },
    { id: 'SK093', route: 'FRA → BKK', status: 'On Time', passengers: 310, checkedIn: 285 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage flights, passengers, and operations
          </p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'flights', label: 'Flights', icon: Plane },
            { id: 'passengers', label: 'Passengers', icon: Users },
            { id: 'checkins', label: 'Check-Ins', icon: CheckCircle },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Plane className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Flights</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalFlights}</div>
                <div className="text-sm text-green-600 dark:text-green-400 mt-2">+12% from last month</div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Passengers</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activePassengers.toLocaleString()}</div>
                <div className="text-sm text-green-600 dark:text-green-400 mt-2">+8% from last month</div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Checked In</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.checkedIn.toLocaleString()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{Math.round((stats.checkedIn / stats.activePassengers) * 100)}% completion rate</div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-blue-100">Revenue</h3>
                </div>
                <div className="text-3xl font-bold">${(stats.revenue / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-blue-100 mt-2">This month</div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Flights</h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {recentFlights.map(flight => (
                    <div key={flight.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold">
                            {flight.id}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">{flight.route}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          flight.status === 'On Time'
                            ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : flight.status === 'Boarding'
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        }`}>
                          {flight.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{flight.passengers} passengers</span>
                        <span>•</span>
                        <span>{flight.checkedIn} checked in ({Math.round((flight.checkedIn / flight.passengers) * 100)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 text-left bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-blue-900 dark:text-blue-300 font-medium">
                    Add New Flight
                  </button>
                  <button className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white font-medium">
                    Manage Passengers
                  </button>
                  <button className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white font-medium">
                    Send Notifications
                  </button>
                  <button className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white font-medium">
                    View Analytics
                  </button>
                  <button className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white font-medium">
                    System Settings
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">System Alerts</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="font-medium text-green-900 dark:text-green-300">All systems operational</div>
                    <div className="text-sm text-green-700 dark:text-green-400 mt-1">Last checked: 2 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="font-medium text-blue-900 dark:text-blue-300">Flight SK401 check-in now open</div>
                    <div className="text-sm text-blue-700 dark:text-blue-400 mt-1">198 of 245 passengers checked in</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab !== 'overview' && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This section would contain detailed management tools for {activeTab}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
