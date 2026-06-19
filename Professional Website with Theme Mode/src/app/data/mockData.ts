export interface Flight {
  id: string;
  flightNumber: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departure: string;
  arrival: string;
  date: string;
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'delayed';
  gate: string;
  terminal: string;
  aircraft: string;
  price: number;
}

export interface Booking {
  id: string;
  pnr: string;
  ticketNumber: string;
  flight: Flight;
  passenger: Passenger;
  seat?: string;
  checkedIn: boolean;
  baggage: BaggageInfo;
  meal?: MealOption;
}

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportNumber: string;
  dateOfBirth: string;
  nationality: string;
  loyaltyTier?: 'Silver' | 'Gold' | 'Platinum';
  loyaltyPoints?: number;
}

export interface BaggageInfo {
  cabin: number;
  checked: number;
  extra: number;
  totalCost: number;
}

export interface MealOption {
  id: string;
  name: string;
  type: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'jain' | 'gluten-free' | 'diabetic';
  description: string;
}

export interface Seat {
  id: string;
  row: number;
  column: string;
  type: 'economy' | 'premium' | 'business' | 'first';
  status: 'available' | 'reserved' | 'occupied';
  price: number;
  isExit: boolean;
  isWindow: boolean;
  isAisle: boolean;
}

export const mockFlights: Flight[] = [
  {
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
  {
    id: '2',
    flightNumber: 'SK 208',
    from: 'Dubai',
    fromCode: 'DXB',
    to: 'Singapore',
    toCode: 'SIN',
    departure: '08:15',
    arrival: '18:30',
    date: '2026-06-16',
    status: 'scheduled',
    gate: 'B7',
    terminal: '1',
    aircraft: 'Airbus A380',
    price: 1200
  }
];

export const mealOptions: MealOption[] = [
  {
    id: 'm1',
    name: 'Vegetarian Delight',
    type: 'vegetarian',
    description: 'Fresh vegetable curry with aromatic rice and garden salad'
  },
  {
    id: 'm2',
    name: 'Grilled Chicken',
    type: 'non-vegetarian',
    description: 'Tender grilled chicken breast with roasted vegetables'
  },
  {
    id: 'm3',
    name: 'Plant-Based Bowl',
    type: 'vegan',
    description: 'Quinoa bowl with mixed vegetables and tahini dressing'
  },
  {
    id: 'm4',
    name: 'Traditional Jain',
    type: 'jain',
    description: 'Specially prepared meal following Jain dietary principles'
  },
  {
    id: 'm5',
    name: 'Gluten-Free Pasta',
    type: 'gluten-free',
    description: 'Gluten-free pasta with tomato basil sauce'
  },
  {
    id: 'm6',
    name: 'Diabetic-Friendly',
    type: 'diabetic',
    description: 'Low-sugar, balanced meal with lean protein and vegetables'
  }
];

export function generateSeats(): Seat[] {
  const seats: Seat[] = [];
  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];

  for (let row = 1; row <= 30; row++) {
    columns.forEach((column, index) => {
      const isWindow = index === 0 || index === 5;
      const isAisle = index === 2 || index === 3;
      const isExit = row === 12 || row === 24;

      let type: Seat['type'] = 'economy';
      let price = 0;

      if (row <= 3) {
        type = 'first';
        price = 500;
      } else if (row <= 8) {
        type = 'business';
        price = 300;
      } else if (row <= 12) {
        type = 'premium';
        price = 100;
      }

      if (isExit) price += 50;

      const occupied = Math.random() > 0.6;

      seats.push({
        id: `${row}${column}`,
        row,
        column,
        type,
        status: occupied ? 'occupied' : 'available',
        price,
        isExit,
        isWindow,
        isAisle
      });
    });
  }

  return seats;
}
