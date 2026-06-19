import { Plane, Calendar, Shield, Clock, Globe, Award, MapPin, Headphones } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: Clock,
      title: 'Quick Check-In',
      description: 'Complete your check-in in under 3 minutes'
    },
    {
      icon: MapPin,
      title: 'Seat Selection',
      description: 'Choose your preferred seat with our interactive map'
    },
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Enterprise-grade security for your peace of mind'
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Connecting you to destinations worldwide'
    },
    {
      icon: Award,
      title: 'Loyalty Rewards',
      description: 'Earn points and unlock exclusive benefits'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Always here to assist you on your journey'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-950 opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-800">
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Welcome to SkyWings
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight">
              Your Journey
              <br />
              <span className="text-blue-600 dark:text-blue-400">Starts Here</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400">
              Experience seamless travel with our world-class airline service.
              Check-in online, select your seat, and get ready for an unforgettable journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => onNavigate('check-in')}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-105 font-semibold text-lg shadow-lg shadow-blue-500/30"
              >
                Start Check-In
              </button>
              <button
                onClick={() => onNavigate('flights')}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-400 transition-all font-semibold text-lg"
              >
                Browse Flights
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
            <div className="p-8 text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Daily Flights</div>
            </div>
            <div className="p-8 text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">150+</div>
              <div className="text-gray-600 dark:text-gray-400">Destinations</div>
            </div>
            <div className="p-8 text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10M+</div>
              <div className="text-gray-600 dark:text-gray-400">Happy Travelers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose SkyWings
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We're committed to making your travel experience exceptional with premium services and unmatched convenience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-400 transition-all hover:shadow-xl hover:scale-105"
            >
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:scale-110 transition-all">
                <feature.icon className="w-7 h-7 text-blue-600 dark:text-blue-400 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Take Off?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of travelers who trust SkyWings for their journey. Start your check-in now and experience the difference.
          </p>
          <button
            onClick={() => onNavigate('check-in')}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all hover:scale-105 font-semibold text-lg shadow-lg"
          >
            Begin Your Journey
          </button>
        </div>
      </div>
    </div>
  );
}
