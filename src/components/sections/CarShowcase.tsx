import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Import car category images
import safariVehicle from "@/assets/safari-vehicle.jpg";
import sportsCar from "@/assets/sports-car.jpg";
import familyCar from "@/assets/family-car.jpg";
import luxuryCar from "@/assets/luxury-car.jpg";
import electricCar from "@/assets/electric-car.jpg";

const CarShowcase = () => {
  const carCategories = [
    {
      title: "Safari Vehicles",
      description: "Adventure-ready 4WDs for Kenya's terrain",
      image: safariVehicle,
      link: "/cars?category=safari"
    },
    {
      title: "Sports Cars",
      description: "High-performance vehicles for the enthusiast",
      image: sportsCar,
      link: "/cars?category=sports"
    },
    {
      title: "Family Cars",
      description: "Safe and spacious for your loved ones",
      image: familyCar,
      link: "/cars?category=family"
    },
    {
      title: "Luxury Vehicles",
      description: "Premium comfort and executive styling",
      image: luxuryCar,
      link: "/cars?category=luxury"
    },
    {
      title: "Electric Vehicles",
      description: "Sustainable transportation for the future",
      image: electricCar,
      link: "/cars?category=electric"
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-gradient">
            Find Your Perfect Match
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our diverse collection of vehicles, from rugged safari cars to luxury sedans
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {carCategories.map((category, index) => (
            <Card key={index} className="card-hover overflow-hidden group">
              <div className="relative aspect-[4/3]">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg mb-1">
                    {category.title}
                  </h3>
                  <p className="text-white/90 text-sm mb-3">
                    {category.description}
                  </p>
                  <Button 
                    asChild 
                    size="sm" 
                    className="w-fit opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Link to={category.link}>
                      Explore
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link to="/cars">
              View All Cars
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CarShowcase;