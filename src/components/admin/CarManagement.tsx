import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CarForm } from "./CarForm";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  fuel_type: string;
  transmission: string;
  engine_size: string;
  condition: string;
  description: string;
  images: string[];
  features: string[];
  status: string;
  stock_count: number;
  video_url: string;
  created_at: string;
}

interface CarManagementProps {
  onUpdate: () => void;
}

export const CarManagement = ({ onUpdate }: CarManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  useEffect(() => {
    fetchCars();
  }, [user]);

  const fetchCars = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('admin_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast({
        title: "Error",
        description: "Failed to load cars",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId)
        .eq('admin_id', user?.id);

      if (error) throw error;

      setCars(cars.filter(car => car.id !== carId));
      toast({ title: "Car deleted successfully" });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete car",
        variant: "destructive"
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCar(null);
    fetchCars();
    onUpdate();
  };

  if (showForm) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {editingCar ? 'Edit Car' : 'Add New Car'}
          </h2>
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false);
              setEditingCar(null);
            }}
          >
            Cancel
          </Button>
        </div>
        <CarForm 
          car={editingCar} 
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingCar(null);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Manage Cars</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Car
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : cars.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="h-12 w-12 text-muted-foreground mx-auto mb-4 text-2xl">🚗</div>
            <h3 className="text-lg font-medium mb-2">No cars listed yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first car to the inventory
            </p>
            <Button onClick={() => setShowForm(true)}>
              Add Your First Car
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cars.map((car) => (
            <Card key={car.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={car.images[0]}
                        alt={`${car.make} ${car.model}`}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                        <div className="h-8 w-8 text-muted-foreground flex items-center justify-center bg-muted rounded">🚗</div>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold">
                        {car.year} {car.make} {car.model}
                      </h3>
                      <p className="text-lg font-bold text-primary">
                        R{car.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant={car.status === 'available' ? 'default' : 'secondary'}>
                          {car.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {car.mileage ? `${car.mileage.toLocaleString()} km` : 'Mileage N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/car/${car.id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCar(car);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(car.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};