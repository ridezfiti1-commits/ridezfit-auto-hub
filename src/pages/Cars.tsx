import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Search, Filter, Car, Heart, Eye } from "lucide-react";

const Cars = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [makeFilter, setMakeFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { addToCart } = useCart();

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ['cars', searchTerm, makeFilter, conditionFilter, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('cars')
        .select('*')
        .eq('status', 'available');

      if (searchTerm) {
        query = query.or(`make.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);
      }

      if (makeFilter && makeFilter !== "all") {
        query = query.eq('make', makeFilter);
      }

      if (conditionFilter && conditionFilter !== "all") {
        query = query.eq('condition', conditionFilter);
      }

      switch (sortBy) {
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'year_new':
          query = query.order('year', { ascending: false });
          break;
        case 'year_old':
          query = query.order('year', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleAddToCart = async (carId: string) => {
    try {
      await addToCart('car', carId, 1);
    } catch (error) {
      console.error('Error adding car to cart:', error);
    }
  };

  // Get unique makes for filter
  const { data: makes = [] } = useQuery({
    queryKey: ['car-makes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('make')
        .eq('status', 'available');
      
      if (error) throw error;
      return [...new Set(data.map(car => car.make))];
    },
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Browse Cars</h1>
          <p className="text-lg text-muted-foreground">
            Find your perfect vehicle from our extensive collection
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 p-6 bg-muted rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={makeFilter} onValueChange={setMakeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Makes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Makes</SelectItem>
                {makes.map(make => (
                  <SelectItem key={make} value={make}>{make}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="certified">Certified</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="year_new">Year: Newest</SelectItem>
                <SelectItem value="year_old">Year: Oldest</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {isLoading ? 'Loading...' : `${cars.length} cars found`}
          </p>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="card-hover overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {car.images && car.images[0] ? (
                  <img
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <Car className="h-16 w-16 text-primary/40" />
                  </div>
                )}
                
                <Badge 
                  className={`absolute top-3 right-3 ${
                    car.condition === 'new' ? 'bg-success' : 
                    car.condition === 'certified' ? 'bg-primary' : 'bg-warning'
                  }`}
                >
                  {car.condition}
                </Badge>
                
                <div className="absolute top-3 left-3 flex gap-2">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0 opacity-90">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0 opacity-90">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">
                  {car.year} {car.make} {car.model}
                </CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${car.price?.toLocaleString() || 'N/A'}
                  </span>
                  {car.mileage && (
                    <span className="text-sm text-muted-foreground">
                      {car.mileage.toLocaleString()} miles
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  {car.description?.substring(0, 100)}...
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">Fuel:</span> {car.fuel_type || 'N/A'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trans:</span> {car.transmission || 'N/A'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Engine:</span> {car.engine_size || 'N/A'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Color:</span> {car.color || 'N/A'}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {car.features?.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {car.features && car.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{car.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link to={`/cars/${car.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button 
                  onClick={() => handleAddToCart(car.id)}
                  className="flex-1"
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {cars.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No cars found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all cars.
            </p>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
};

export default Cars;