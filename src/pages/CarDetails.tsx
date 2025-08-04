import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Share2, Phone, Mail, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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
  admin_id: string;
  view_count: number;
  stock_count: number;
  video_url: string;
}

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCar();
      checkIfFavorite();
      trackView();
    }
  }, [id, user]);

  const trackView = async () => {
    if (!id) return;
    
    try {
      await supabase
        .from('car_views')
        .insert({
          car_id: id,
          user_id: user?.id || null
        });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const fetchCar = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCar(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching car:', error);
      toast({
        title: "Error",
        description: "Failed to load car details",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    if (!user || !id) return;

    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_id', id)
        .eq('item_type', 'car')
        .single();

      setIsFavorite(!!data);
    } catch (error) {
      // Not a favorite
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save favorites",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', id)
          .eq('item_type', 'car');
        setIsFavorite(false);
        toast({ title: "Removed from favorites" });
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            item_id: id,
            item_type: 'car'
          });
        setIsFavorite(true);
        toast({ title: "Added to favorites" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive"
      });
      return;
    }

    try {
      await addToCart('car', id!, 1);
      toast({ title: "Added to cart" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Navbar />
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-muted rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Navbar />
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Car not found</h1>
            <Button onClick={() => navigate('/cars')}>
              Back to Cars
            </Button>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      
      <div className="container py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/cars')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cars
          </Button>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFavorite}
              className={cn(
                "flex items-center gap-2",
                isFavorite && "text-destructive"
              )}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
              {isFavorite ? "Saved" : "Save"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.share?.({
                  title: `${car.year} ${car.make} ${car.model}`,
                  url: window.location.href
                });
              }}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
              {car.images && car.images.length > 0 ? (
                <img
                  src={car.images[selectedImage]}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No images available
                </div>
              )}
            </div>
            
            {car.images && car.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2",
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent"
                    )}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {car.year} {car.make} {car.model}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">
                  R{car.price.toLocaleString()}
                </span>
                <Badge variant={car.status === 'available' ? 'default' : 'secondary'}>
                  {car.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Views: {car.view_count || 0}</span>
                <span>•</span>
                <span>Stock: {car.stock_count || 1}</span>
              </div>
            </div>

            {/* Key Details */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Mileage</span>
                  <p className="font-medium">{car.mileage?.toLocaleString() || 'N/A'} km</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Condition</span>
                  <p className="font-medium capitalize">{car.condition}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Fuel Type</span>
                  <p className="font-medium">{car.fuel_type || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Transmission</span>
                  <p className="font-medium">{car.transmission || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Engine Size</span>
                  <p className="font-medium">{car.engine_size || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Color</span>
                  <p className="font-medium">{car.color || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature, index) => (
                      <Badge key={index} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {car.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{car.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Video */}
            {car.video_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Video</CardTitle>
                </CardHeader>
                <CardContent>
                  {car.video_url.includes('youtube.com') || car.video_url.includes('youtu.be') ? (
                    <div className="aspect-video">
                      <iframe
                        src={car.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                        className="w-full h-full rounded"
                        allowFullScreen
                        title="Car video"
                        
                      />
                    </div>
                  ) : (
                    <video
                      src={car.video_url}
                      className="w-full aspect-video rounded"
                      controls
                      preload="metadata"
                      autoPlay
                      muted
                      loop
                    />
                  )}
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleAddToCart}
                className="w-full"
                disabled={car.status !== 'available'}
              >
                Add to Cart
              </Button>
              
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default CarDetails;