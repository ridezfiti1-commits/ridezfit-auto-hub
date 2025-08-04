import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Car, Wrench, Shield, CreditCard, Star, ArrowRight, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [searchMake, setSearchMake] = useState("");
  const [searchModel, setSearchModel] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const { addToCart } = useCart();

  // Fetch featured cars
  const { data: featuredCars = [] } = useQuery({
    queryKey: ['featured-cars'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available')
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch featured merchandise
  const { data: featuredMerchandise = [] } = useQuery({
    queryKey: ['featured-merchandise'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('merchandise')
        .select('*')
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch featured services
  const { data: featuredServices = [] } = useQuery({
    queryKey: ['featured-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddToCart = async (itemType: 'car' | 'merchandise' | 'service', itemId: string) => {
    try {
      await addToCart(itemType, itemId, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const services = [
    {
      icon: CreditCard,
      title: "Car Financing",
      description: "Flexible payment options including hire purchase through NCBA bank"
    },
    {
      icon: Shield,
      title: "Insurance Support",
      description: "Comprehensive insurance packages for your peace of mind"
    },
    {
      icon: Car,
      title: "Trade-in Options",
      description: "Get the best value for your current vehicle"
    },
    {
      icon: Wrench,
      title: "Service & Maintenance",
      description: "Professional detailing, repair, and upgrade services"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Find Your Perfect Ride
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/90">
              The ultimate car marketplace with vehicles, accessories, and services all in one place
            </p>
            
            {/* Search Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 glass-effect">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={searchMake} onValueChange={setSearchMake}>
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="Select Make" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toyota">Toyota</SelectItem>
                    <SelectItem value="honda">Honda</SelectItem>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="ford">Ford</SelectItem>
                    <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={searchModel} onValueChange={setSearchModel}>
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="camry">Camry</SelectItem>
                    <SelectItem value="civic">Civic</SelectItem>
                    <SelectItem value="x5">X5</SelectItem>
                    <SelectItem value="mustang">Mustang</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="bg-white rounded-md p-3">
                  <label className="text-sm text-gray-600 mb-2 block">
                    Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                </div>
                
                <Button size="lg" asChild className="bg-primary hover:bg-primary-dark text-white">
                  <Link to="/cars">
                    <Search className="h-5 w-5 mr-2" />
                    Search Cars
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Cars</h2>
            <p className="text-lg text-muted-foreground">
              Discover our handpicked selection of premium vehicles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
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
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
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
                  <div className="flex flex-wrap gap-1">
                    {car.features?.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={`/cars/${car.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button 
                    onClick={() => handleAddToCart('car', car.id)}
                    className="flex-1"
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/cars">
                View All Cars
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Merchandise */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Car Accessories</h2>
            <p className="text-lg text-muted-foreground">
              Enhance your ride with premium accessories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMerchandise.map((item) => (
              <Card key={item.id} className="card-hover">
                <div className="aspect-square bg-background relative overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <Wrench className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2 bg-primary">
                    {item.category}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <div className="text-xl font-bold text-primary">
                    ${item.price?.toLocaleString() || 'N/A'}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    {item.description?.substring(0, 80)}...
                  </p>
                  {item.stock_quantity !== undefined && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Stock: {item.stock_quantity}
                    </p>
                  )}
                </CardContent>
                
                <CardFooter>
                  <Button 
                    onClick={() => handleAddToCart('merchandise', item.id)}
                    className="w-full"
                    size="sm"
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link to="/merchandise">
                View All Accessories
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Professional Services</h2>
            <p className="text-lg text-muted-foreground">
              Expert automotive services for your vehicle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <Card key={service.id} className="card-hover">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <Wrench className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2 bg-primary">
                    {service.category}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                      ${service.price?.toLocaleString() || 'N/A'}
                    </span>
                    {service.duration && (
                      <span className="text-sm text-muted-foreground">
                        {service.duration}
                      </span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {service.description?.substring(0, 100)}...
                  </p>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    onClick={() => handleAddToCart('service', service.id)}
                    className="w-full"
                    size="sm"
                  >
                    Book Service
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link to="/services">
                View All Services
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose RidezFiti?</h2>
            <p className="text-lg text-muted-foreground">
              Complete automotive solutions for all your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="text-center card-hover">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <Card className="bg-gradient-primary text-white">
            <CardContent className="p-8 lg:p-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Explore our full catalog of cars, accessories, and services
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/cars">Browse Cars</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <Link to="/merchandise">Shop Accessories</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <Link to="/services">Book Services</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <MobileNav />
    </div>
  );
};

export default Index;
