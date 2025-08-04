import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const Cars = () => {
  const { addToCart } = useCart();

  const { data: cars = [] } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">All Cars</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="card-hover">
              <CardHeader>
                <CardTitle>{car.year} {car.make} {car.model}</CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${car.price.toLocaleString()}
                  </span>
                  <Badge variant={car.condition === 'new' ? 'default' : 'secondary'}>
                    {car.condition}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{car.description}</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link to={`/cars/${car.id}`}>View Details</Link>
                </Button>
                <Button onClick={() => addToCart('car', car.id)} className="flex-1">
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default Cars;