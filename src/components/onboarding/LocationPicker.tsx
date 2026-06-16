import { useState, useEffect } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { resolveIanaZone } from '@/lib/timezone';

// Comprehensive city database with coordinates and timezone offsets
const CITY_DATABASE: Array<{
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number;
}> = [
  // India - Major cities
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
  { name: 'Surat', country: 'India', lat: 21.1702, lng: 72.8311, timezone: 5.5 },
  { name: 'Kanpur', country: 'India', lat: 26.4499, lng: 80.3319, timezone: 5.5 },
  { name: 'Nagpur', country: 'India', lat: 21.1458, lng: 79.0882, timezone: 5.5 },
  { name: 'Indore', country: 'India', lat: 22.7196, lng: 75.8577, timezone: 5.5 },
  { name: 'Bhopal', country: 'India', lat: 23.2599, lng: 77.4126, timezone: 5.5 },
  { name: 'Patna', country: 'India', lat: 25.5941, lng: 85.1376, timezone: 5.5 },
  { name: 'Vadodara', country: 'India', lat: 22.3072, lng: 73.1812, timezone: 5.5 },
  { name: 'Coimbatore', country: 'India', lat: 11.0168, lng: 76.9558, timezone: 5.5 },
  { name: 'Kochi', country: 'India', lat: 9.9312, lng: 76.2673, timezone: 5.5 },
  { name: 'Thiruvananthapuram', country: 'India', lat: 8.5241, lng: 76.9366, timezone: 5.5 },
  { name: 'Chandigarh', country: 'India', lat: 30.7333, lng: 76.7794, timezone: 5.5 },
  { name: 'Amritsar', country: 'India', lat: 31.6340, lng: 74.8723, timezone: 5.5 },
  { name: 'Visakhapatnam', country: 'India', lat: 17.6868, lng: 83.2185, timezone: 5.5 },
  { name: 'Goa', country: 'India', lat: 15.2993, lng: 74.1240, timezone: 5.5 },
  
  // Pakistan
  { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011, timezone: 5 },
  { name: 'Lahore', country: 'Pakistan', lat: 31.5204, lng: 74.3587, timezone: 5 },
  { name: 'Islamabad', country: 'Pakistan', lat: 33.6844, lng: 73.0479, timezone: 5 },
  { name: 'Faisalabad', country: 'Pakistan', lat: 31.4504, lng: 73.1350, timezone: 5 },
  { name: 'Rawalpindi', country: 'Pakistan', lat: 33.5651, lng: 73.0169, timezone: 5 },
  
  // Bangladesh
  { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125, timezone: 6 },
  { name: 'Chittagong', country: 'Bangladesh', lat: 22.3569, lng: 91.7832, timezone: 6 },
  
  // Sri Lanka
  { name: 'Colombo', country: 'Sri Lanka', lat: 6.9271, lng: 79.8612, timezone: 5.5 },
  { name: 'Kandy', country: 'Sri Lanka', lat: 7.2906, lng: 80.6337, timezone: 5.5 },
  
  // Nepal
  { name: 'Kathmandu', country: 'Nepal', lat: 27.7172, lng: 85.3240, timezone: 5.75 },
  { name: 'Pokhara', country: 'Nepal', lat: 28.2096, lng: 83.9856, timezone: 5.75 },
  
  // UK
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, timezone: 0 },
  { name: 'Birmingham', country: 'UK', lat: 52.4862, lng: -1.8904, timezone: 0 },
  { name: 'Manchester', country: 'UK', lat: 53.4808, lng: -2.2426, timezone: 0 },
  { name: 'Leeds', country: 'UK', lat: 53.8008, lng: -1.5491, timezone: 0 },
  { name: 'Glasgow', country: 'UK', lat: 55.8642, lng: -4.2518, timezone: 0 },
  { name: 'Liverpool', country: 'UK', lat: 53.4084, lng: -2.9916, timezone: 0 },
  { name: 'Edinburgh', country: 'UK', lat: 55.9533, lng: -3.1883, timezone: 0 },
  { name: 'Bristol', country: 'UK', lat: 51.4545, lng: -2.5879, timezone: 0 },
  { name: 'Cardiff', country: 'UK', lat: 51.4816, lng: -3.1791, timezone: 0 },
  { name: 'Leicester', country: 'UK', lat: 52.6369, lng: -1.1398, timezone: 0 },
  
  // USA - Major cities
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, timezone: -5 },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, timezone: -8 },
  { name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, timezone: -6 },
  { name: 'Houston', country: 'USA', lat: 29.7604, lng: -95.3698, timezone: -6 },
  { name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, timezone: -8 },
  { name: 'Phoenix', country: 'USA', lat: 33.4484, lng: -112.0740, timezone: -7 },
  { name: 'Philadelphia', country: 'USA', lat: 39.9526, lng: -75.1652, timezone: -5 },
  { name: 'San Antonio', country: 'USA', lat: 29.4241, lng: -98.4936, timezone: -6 },
  { name: 'San Diego', country: 'USA', lat: 32.7157, lng: -117.1611, timezone: -8 },
  { name: 'Dallas', country: 'USA', lat: 32.7767, lng: -96.7970, timezone: -6 },
  { name: 'San Jose', country: 'USA', lat: 37.3382, lng: -121.8863, timezone: -8 },
  { name: 'Austin', country: 'USA', lat: 30.2672, lng: -97.7431, timezone: -6 },
  { name: 'Jacksonville', country: 'USA', lat: 30.3322, lng: -81.6557, timezone: -5 },
  { name: 'Fort Worth', country: 'USA', lat: 32.7555, lng: -97.3308, timezone: -6 },
  { name: 'Columbus', country: 'USA', lat: 39.9612, lng: -82.9988, timezone: -5 },
  { name: 'Charlotte', country: 'USA', lat: 35.2271, lng: -80.8431, timezone: -5 },
  { name: 'Seattle', country: 'USA', lat: 47.6062, lng: -122.3321, timezone: -8 },
  { name: 'Denver', country: 'USA', lat: 39.7392, lng: -104.9903, timezone: -7 },
  { name: 'Boston', country: 'USA', lat: 42.3601, lng: -71.0589, timezone: -5 },
  { name: 'Detroit', country: 'USA', lat: 42.3314, lng: -83.0458, timezone: -5 },
  { name: 'Nashville', country: 'USA', lat: 36.1627, lng: -86.7816, timezone: -6 },
  { name: 'Portland', country: 'USA', lat: 45.5051, lng: -122.6750, timezone: -8 },
  { name: 'Las Vegas', country: 'USA', lat: 36.1699, lng: -115.1398, timezone: -8 },
  { name: 'Atlanta', country: 'USA', lat: 33.7490, lng: -84.3880, timezone: -5 },
  { name: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918, timezone: -5 },
  { name: 'Minneapolis', country: 'USA', lat: 44.9778, lng: -93.2650, timezone: -6 },
  { name: 'Orlando', country: 'USA', lat: 28.5383, lng: -81.3792, timezone: -5 },
  
  // Canada
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, timezone: -5 },
  { name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207, timezone: -8 },
  { name: 'Montreal', country: 'Canada', lat: 45.5017, lng: -73.5673, timezone: -5 },
  { name: 'Calgary', country: 'Canada', lat: 51.0447, lng: -114.0719, timezone: -7 },
  { name: 'Ottawa', country: 'Canada', lat: 45.4215, lng: -75.6972, timezone: -5 },
  { name: 'Edmonton', country: 'Canada', lat: 53.5461, lng: -113.4938, timezone: -7 },
  { name: 'Winnipeg', country: 'Canada', lat: 49.8951, lng: -97.1384, timezone: -6 },
  { name: 'Quebec City', country: 'Canada', lat: 46.8139, lng: -71.2080, timezone: -5 },
  
  // UAE
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, timezone: 4 },
  { name: 'Abu Dhabi', country: 'UAE', lat: 24.4539, lng: 54.3773, timezone: 4 },
  { name: 'Sharjah', country: 'UAE', lat: 25.3463, lng: 55.4209, timezone: 4 },
  
  // Saudi Arabia
  { name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753, timezone: 3 },
  { name: 'Jeddah', country: 'Saudi Arabia', lat: 21.4858, lng: 39.1925, timezone: 3 },
  { name: 'Mecca', country: 'Saudi Arabia', lat: 21.3891, lng: 39.8579, timezone: 3 },
  
  // Singapore
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, timezone: 8 },
  
  // Malaysia
  { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869, timezone: 8 },
  { name: 'George Town', country: 'Malaysia', lat: 5.4141, lng: 100.3288, timezone: 8 },
  
  // Australia
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, timezone: 10 },
  { name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, timezone: 10 },
  { name: 'Brisbane', country: 'Australia', lat: -27.4698, lng: 153.0251, timezone: 10 },
  { name: 'Perth', country: 'Australia', lat: -31.9505, lng: 115.8605, timezone: 8 },
  { name: 'Adelaide', country: 'Australia', lat: -34.9285, lng: 138.6007, timezone: 9.5 },
  { name: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633, timezone: 12 },
  
  // Europe
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, timezone: 1 },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, timezone: 1 },
  { name: 'Munich', country: 'Germany', lat: 48.1351, lng: 11.5820, timezone: 1 },
  { name: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821, timezone: 1 },
  { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, timezone: 1 },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, timezone: 1 },
  { name: 'Milan', country: 'Italy', lat: 45.4642, lng: 9.1900, timezone: 1 },
  { name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, timezone: 1 },
  { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734, timezone: 1 },
  { name: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738, timezone: 1 },
  { name: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417, timezone: 1 },
  { name: 'Geneva', country: 'Switzerland', lat: 46.2044, lng: 6.1432, timezone: 1 },
  { name: 'Brussels', country: 'Belgium', lat: 50.8503, lng: 4.3517, timezone: 1 },
  { name: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, timezone: 0 },
  { name: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, timezone: 1 },
  { name: 'Copenhagen', country: 'Denmark', lat: 55.6761, lng: 12.5683, timezone: 1 },
  { name: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522, timezone: 1 },
  { name: 'Helsinki', country: 'Finland', lat: 60.1699, lng: 24.9384, timezone: 2 },
  { name: 'Warsaw', country: 'Poland', lat: 52.2297, lng: 21.0122, timezone: 1 },
  { name: 'Prague', country: 'Czech Republic', lat: 50.0755, lng: 14.4378, timezone: 1 },
  { name: 'Budapest', country: 'Hungary', lat: 47.4979, lng: 19.0402, timezone: 1 },
  { name: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275, timezone: 2 },
  { name: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, timezone: 0 },
  { name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173, timezone: 3 },
  { name: 'St. Petersburg', country: 'Russia', lat: 59.9343, lng: 30.3351, timezone: 3 },
  
  // China
  { name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, timezone: 8 },
  { name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737, timezone: 8 },
  { name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694, timezone: 8 },
  { name: 'Shenzhen', country: 'China', lat: 22.5431, lng: 114.0579, timezone: 8 },
  { name: 'Guangzhou', country: 'China', lat: 23.1291, lng: 113.2644, timezone: 8 },
  
  // Japan
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, timezone: 9 },
  { name: 'Osaka', country: 'Japan', lat: 34.6937, lng: 135.5023, timezone: 9 },
  { name: 'Kyoto', country: 'Japan', lat: 35.0116, lng: 135.7681, timezone: 9 },
  { name: 'Yokohama', country: 'Japan', lat: 35.4437, lng: 139.6380, timezone: 9 },
  
  // South Korea
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, timezone: 9 },
  { name: 'Busan', country: 'South Korea', lat: 35.1796, lng: 129.0756, timezone: 9 },
  
  // Taiwan
  { name: 'Taipei', country: 'Taiwan', lat: 25.0330, lng: 121.5654, timezone: 8 },
  
  // Thailand
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, timezone: 7 },
  { name: 'Phuket', country: 'Thailand', lat: 7.8804, lng: 98.3923, timezone: 7 },
  
  // Vietnam
  { name: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lng: 106.6297, timezone: 7 },
  { name: 'Hanoi', country: 'Vietnam', lat: 21.0278, lng: 105.8342, timezone: 7 },
  
  // Philippines
  { name: 'Manila', country: 'Philippines', lat: 14.5995, lng: 120.9842, timezone: 8 },
  { name: 'Cebu City', country: 'Philippines', lat: 10.3157, lng: 123.8854, timezone: 8 },
  
  // Indonesia
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, timezone: 7 },
  { name: 'Bali', country: 'Indonesia', lat: -8.4095, lng: 115.1889, timezone: 8 },
  
  // South America
  { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, timezone: -3 },
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729, timezone: -3 },
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, timezone: -3 },
  { name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428, timezone: -5 },
  { name: 'Bogotá', country: 'Colombia', lat: 4.7110, lng: -74.0721, timezone: -5 },
  { name: 'Santiago', country: 'Chile', lat: -33.4489, lng: -70.6693, timezone: -4 },
  
  // Mexico
  { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, timezone: -6 },
  { name: 'Guadalajara', country: 'Mexico', lat: 20.6597, lng: -103.3496, timezone: -6 },
  { name: 'Monterrey', country: 'Mexico', lat: 25.6866, lng: -100.3161, timezone: -6 },
  
  // Africa
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, timezone: 2 },
  { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, timezone: 1 },
  { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, timezone: 2 },
  { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, timezone: 2 },
  { name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, timezone: 3 },
  { name: 'Casablanca', country: 'Morocco', lat: 33.5731, lng: -7.5898, timezone: 1 },
  
  // Israel
  { name: 'Tel Aviv', country: 'Israel', lat: 32.0853, lng: 34.7818, timezone: 2 },
  { name: 'Jerusalem', country: 'Israel', lat: 31.7683, lng: 35.2137, timezone: 2 },
  
  // Turkey
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, timezone: 3 },
  { name: 'Ankara', country: 'Turkey', lat: 39.9334, lng: 32.8597, timezone: 3 },
];

export interface LocationData {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  /** Static standard-time UTC offset (hours). Display + non-DST fallback only. */
  timezone: number;
  /** IANA zone for DST-correct offset resolution; null when the static offset is reliable. */
  ianaZone: string | null;
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
      timezone: city.timezone,
      ianaZone: resolveIanaZone(city.name, city.country),
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
