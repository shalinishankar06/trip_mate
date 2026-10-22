import { destinations, type Destination } from '../data/destinations';

export type Preferences = { interests: string[]; budget: number; style: string };
export type DemoUser = { name: string; email: string };
export type SavedTrip = {
  id: string;
  destinationId: string;
  days: number;
  createdAt: string;
  variant?: number;
};

const keys = {
  user: 'tripmate-user',
  preferences: 'tripmate-preferences',
  trips: 'tripmate-saved-trips',
  itineraryVariant: 'tripmate-itinerary-variant',
};
const INR_PER_USD_ESTIMATE = 85;

const read = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const formatINR = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount * INR_PER_USD_ESTIMATE));

export const getUser = () => read<DemoUser | null>(keys.user, null);
export const setUser = (user: DemoUser | null) =>
  user
    ? localStorage.setItem(keys.user, JSON.stringify(user))
    : localStorage.removeItem(keys.user);

export const defaultPreferences: Preferences = {
  interests: ['Culture', 'Food', 'Nature'],
  budget: 120,
  style: 'A little of everything',
};

export const getPreferences = () =>
  read<Preferences>(keys.preferences, defaultPreferences);

export const savePreferences = (prefs: Preferences) =>
  localStorage.setItem(keys.preferences, JSON.stringify(prefs));
export const getTrips = () => {
  const saved = read<SavedTrip[]>(keys.trips, []);
  let migrated = false;
  const trips = saved.map((trip, index) => {
    if (typeof trip.variant === 'number') return trip;
    migrated = true;
    return { ...trip, variant: index + 1 };
  });
  if (migrated) localStorage.setItem(keys.trips, JSON.stringify(trips));
  return trips;
};
export const saveTrips = (trips: SavedTrip[]) =>
  localStorage.setItem(keys.trips, JSON.stringify(trips));

export function nextItineraryVariant() {
  const highestSavedVariant = getTrips().reduce(
    (highest, trip) => Math.max(highest, trip.variant ?? 0),
    0,
  );
  const next =
    Math.max(read<number>(keys.itineraryVariant, 0), highestSavedVariant) + 1;
  localStorage.setItem(keys.itineraryVariant, JSON.stringify(next));
  return next;
}

export function recommendDestinations(prefs: Preferences, limit = 6) {
  return destinations
    .filter((place) => place.budget <= prefs.budget)
    .map((place) => {
      const matched = place.categories.filter((category) =>
        prefs.interests.includes(category),
      );
      return { place, matched, score: matched.length };
    })
    .sort(
      (a, b) =>
        b.score - a.score || a.place.name.localeCompare(b.place.name),
    )
    .slice(0, limit);
}

export type DayPlan = {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
  cost: number;
};

const morningPlans = [
  'Catch the early light at',
  'Take an unhurried morning walk through',
  'Begin with a closer look at',
  'Beat the crowds with a visit to',
  'Spend a slow morning exploring',
  'Start with a guided stop at',
  'Follow the local buzz to',
];

const afternoonPlans = [
  'Make time for',
  'Continue the day at',
  'Head across town to',
  'Keep the afternoon open for',
  'Take the scenic route to',
  'Settle into a longer visit at',
  'Explore more of',
];

const eveningPlans = [
  'Dinner at',
  'Try a local favorite at',
  'End the day over a meal at',
  'Make dinner plans at',
  'Take it slow with dinner at',
  'Catch an evening table at',
  'Wind down over dinner at',
];

const dailyCostFactors = [0.72, 0.86, 0.94, 1.08, 0.78];

export function generateItinerary(
  place: Destination,
  days: number,
  variant = 0,
): DayPlan[] {
  const attractions = place.attractions;
  const restaurants = place.restaurants;

  return Array.from({ length: days }, (_, index) => {
    // A persisted variant makes each newly generated trip feel different while
    // keeping its itinerary unchanged when the traveler reopens it.
    const slot = (variant + index) % 21;
    const attractionIndex = slot % attractions.length;
    const secondAttractionIndex =
      (attractionIndex + 1 + Math.floor(slot / attractions.length)) %
      attractions.length;
    const restaurantIndex =
      Math.floor(slot / 7) % restaurants.length;
    const factor = dailyCostFactors[(variant + index) % dailyCostFactors.length];

    return {
      day: index + 1,
      morning: `${morningPlans[slot % morningPlans.length]} ${attractions[attractionIndex]}`,
      afternoon: `${afternoonPlans[(slot + 2) % afternoonPlans.length]} ${attractions[secondAttractionIndex]}`,
      evening: `${eveningPlans[(slot + 4) % eveningPlans.length]} ${restaurants[restaurantIndex]}`,
      cost: Math.round(place.budget * factor),
    };
  });
}
