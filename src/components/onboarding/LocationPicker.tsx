import { useState, useEffect } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Common cities with their coordinates and timezone offsets
const CITY_DATABASE: Array<{
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number;
}> = [
  // India
  { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, timezone: 5.5 },
  { name: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090, timezone: 5.5 },
  { name: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946, timezone: 5.5 },
  { name: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707, timezone: 5.5 },
  { name: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639, timezone: 5.5 },
  { name: 'Hyderabad', country: 'India', lat: 17.3850, lng: 78.4867, timezone: 5.5 },
  { name: 'Pune', country: 'India', lat: 18.5204, lng: 73.8567, timezone: 5.5 },
  { name: 'Ahmedabad', country: 'India', lat: 23.0225, lng: 72.5714, timezone: 5.5 },
  { name: 'Jaipur', country: 'India', lat: 26.9124, lng: 75.7873, timezone: 5.5 },
  { name: 'Lucknow', country: 'India', lat: 26.8467, lng: 80.9462, timezone: 5.5 },
  // Pakistan
  { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011, timezone: 5 },
  { name: 'Lahore', country: 'Pakistan', lat: 31.5204, lng: 74.3587, timezone: 5 },
  { name: 'Islamabad', country: 'Pakistan', lat: 33.6844, lng: 73.0479, timezone: 5 },
  // Bangladesh
  { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125, timezone: 6 },
  // Sri Lanka
  { name: 'Colombo', country: 'Sri Lanka', lat: 6.9271, lng: 79.8612, timezone: 5.5 },
  // Nepal
  { name: 'Kathmandu', country: 'Nepal', lat: 27.7172, lng: 85.3240, timezone: 5.75 },
  // UK
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, timezone: 0 },
  { name: 'Birmingham', country: 'UK', lat: 52.4862, lng: -1.8904, timezone: 0 },
  { name: 'Manchester', country: 'UK', lat: 53.4808, lng: -2.2426, timezone: 0 },
  // USA
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, timezone: -5 },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, timezone: -8 },
  { name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, timezone: -6 },
  { name: 'Houston', country: 'USA', lat: 29.7604, lng: -95.3698, timezone: -6 },
  { name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, timezone: -8 },
  // Canada
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, timezone: -5 },
  { name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207, timezone: -8 },
  // UAE
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, timezone: 4 },
  { name: 'Abu Dhabi', country: 'UAE', lat: 24.4539, lng: 54.3773, timezone: 4 },
  // Singapore
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 8 },
  // Australia
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, timezone: 10 },
  { name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, timezone: 10 },
];

export interface LocationData {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: number;
}

interface LocationPickerProps {
  value: LocationData | null;
  onChange: (location: LocationData | null) => void;
  placeholder?: string;
}

export function LocationPicker({ value, onChange, placeholder = "Search for your birth city..." }: LocationPickerProps) {
  const [query, setQuery] = useState(value ? `${value.name}, ${value.country}` : '');
  const [results, setResults] = useState<typeof CITY_DATABASE>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    const timer = setTimeout(() => {
      const filtered = CITY_DATABASE.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.country.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);
      
      setResults(filtered);
      setIsSearching(false);
      setIsOpen(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (city: typeof CITY_DATABASE[0]) => {
    onChange({
      name: city.name,
      country: city.country,
      latitude: city.lat,
      longitude: city.lng,
      timezone: city.timezone
    });
    setQuery(`${city.name}, ${city.country}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value) onChange(null);
          }}
          placeholder={placeholder}
          className="pl-10 pr-10"
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {results.map((city, index) => (
            <button
              key={`${city.name}-${city.country}`}
              type="button"
              onClick={() => handleSelect(city)}
              className={cn(
                "w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-muted/50 transition-colors",
                index !== results.length - 1 && "border-b border-border/50"
              )}
            >
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <div>
                <div className="font-medium text-foreground">{city.name}</div>
                <div className="text-xs text-muted-foreground">{city.country}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isSearching && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg p-4 text-center text-muted-foreground text-sm">
          No cities found. Try a different search.
        </div>
      )}
    </div>
  );
}
