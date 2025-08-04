import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin, Phone, Mail, Globe, Heart, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const ShowroomProfile = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  // Fetch showroom profile
  const { data: showroom, isLoading: showroomLoading } = useQuery({
    queryKey: ['showroom-profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('showroom_profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch showroom cars
  const { data: cars = [], isLoading: carsLoading } = useQuery({
    queryKey: ['showroom-cars', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('showroom_id', id)
        .eq('status', 'available');
      
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

  if (showroomLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="text-center">Loading showroom profile...</div>
        </div>
      </div>
    );
  }

  if (!showroom) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Showroom Not Found</h1>
            <Button asChild>
              <Link to="/cars">Browse All Cars</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      
      <div className="container py-8">
        {/* Showroom Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center shadow-md">
                {showroom.logo_url ? (
                  <img
                    src={showroom.logo_url}
                    alt={`${showroom.showroom_name} logo`}
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                ) : (
                  <Car className="h-12 w-12 text-primary" />
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  {showroom.showroom_name}
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {showroom.description || 'Premium automotive dealership'}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  {showroom.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{showroom.location}</span>
                    </div>
                  )}
                  {showroom.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{showroom.phone}</span>
                    </div>
                  )}
                  {showroom.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{showroom.email}</span>
                    </div>
                  )}
                  {showroom.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <a 
                        href={showroom.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {cars.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Cars Available
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cars Listing */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Available Cars</h2>
          
          {carsLoading ? (
            <div className="text-center py-8">Loading cars...</div>
          ) : cars.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No cars available</h3>
              <p className="text-muted-foreground">
                This showroom doesn't have any cars listed at the moment.
              </p>
            </div>
          ) : (
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
                        KSh {car.price?.toLocaleString() || 'N/A'}
                      </span>
                      {car.mileage && (
                        <span className="text-sm text-muted-foreground">
                          {car.mileage.toLocaleString()} km
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
          )}
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default ShowroomProfile;