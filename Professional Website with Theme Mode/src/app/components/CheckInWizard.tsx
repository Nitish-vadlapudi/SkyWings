import { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Plane, User, Armchair, ShoppingBag, Utensils, FileCheck, Download } from 'lucide-react';
import { SeatSelection } from './SeatSelection';
import { mealOptions, MealOption } from '../data/mockData';

interface CheckInWizardProps {
  onNavigate: (page: string) => void;
}

export function CheckInWizard({ onNavigate }: CheckInWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [pnr, setPnr] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealOption | null>(null);
  const [baggageCount, setBaggageCount] = useState(1);

  const steps = [
    { id: 1, name: 'Verify Booking', icon: FileCheck },
    { id: 2, name: 'Passenger Details', icon: User },
    { id: 3, name: 'Select Seat', icon: Armchair },
    { id: 4, name: 'Add Baggage', icon: ShoppingBag },
    { id: 5, name: 'Choose Meal', icon: Utensils },
    { id: 6, name: 'Confirmation', icon: Check },
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onNavigate('boarding-pass');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Online Check-In
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your check-in in just a few simple steps
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200 dark:bg-gray-800"></div>
            <div
              className="absolute left-0 top-5 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isComplete = currentStep > step.id;

              return (
                <div key={step.id} className="relative flex flex-col items-center z-10">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-blue-600 dark:bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900/50'
                        : isComplete
                        ? 'bg-green-600 dark:bg-green-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-2 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="absolute top-14 text-center whitespace-nowrap">
                    <div className={`text-sm font-medium ${isActive || isComplete ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'}`}>
                      {step.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 min-h-[500px]">
          {currentStep === 1 && (
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Booking</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Enter your PNR or ticket number to begin check-in</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    PNR Number
                  </label>
                  <input
                    type="text"
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value.toUpperCase())}
                    placeholder="e.g., SKY7X9P2"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                  />
                </div>

                <div className="pt-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-300">
                      Your PNR number can be found in your booking confirmation email or SMS
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Passenger Details</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Confirm your information</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue="Travel"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Guest"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="guest@example.com"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+1234567890"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Your Seat</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Choose your preferred seat from the available options</p>
              <SeatSelection onSeatSelect={setSelectedSeat} selectedSeat={selectedSeat} />
            </div>
          )}

          {currentStep === 4 && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Add Baggage</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Select the number of checked bags</p>

              <div className="space-y-6">
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Cabin Baggage</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">7 kg, included</p>
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">Included</div>
                  </div>
                </div>

                <div className="p-6 border-2 border-blue-600 dark:border-blue-400 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Checked Baggage</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">23 kg per bag</p>
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">${baggageCount * 50}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setBaggageCount(Math.max(0, baggageCount - 1))}
                      className="w-10 h-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-bold text-gray-900 dark:text-white"
                    >
                      -
                    </button>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{baggageCount}</div>
                    <button
                      onClick={() => setBaggageCount(baggageCount + 1)}
                      className="w-10 h-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-bold text-gray-900 dark:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose Your Meal</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Select your preferred meal for the flight</p>

              <div className="grid md:grid-cols-2 gap-4">
                {mealOptions.map(meal => (
                  <button
                    key={meal.id}
                    onClick={() => setSelectedMeal(meal)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedMeal?.id === meal.id
                        ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-400'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">{meal.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 uppercase">{meal.type}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{meal.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Check-In Complete!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Your boarding pass is ready</p>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Booking Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Flight</span>
                    <span className="font-medium text-gray-900 dark:text-white">SK 401</span>
                  </div>
                  {selectedSeat && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Seat</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedSeat}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Baggage</span>
                    <span className="font-medium text-gray-900 dark:text-white">{baggageCount} checked bag(s)</span>
                  </div>
                  {selectedMeal && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Meal</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedMeal.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-105 font-semibold text-lg shadow-lg flex items-center gap-2 mx-auto"
              >
                <Download className="w-5 h-5" />
                View Boarding Pass
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep < steps.length && (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
