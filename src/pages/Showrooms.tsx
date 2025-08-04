import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin, Car, Eye, Users, Phone, Mail, Globe } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ShowroomWithStats {
  id: string;
  showroom_name: string;
  description: string;
  location: string;
  logo_url: string;
  phone: string;
  email: string;
  website: string;
  total_views: number;
  total_visits: number;
  car_count: number;
}

const Showrooms = () => {
  const { toast } = useToast();
  const [showrooms, setShowrooms] = useState<ShowroomWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShowrooms();
  }, []);

  const fetchShowrooms = async () => {
    try {
      // First get showroom profiles
      const { data: showroomsData, error } = await supabase
        .from('showroom_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get car counts for each showroom
      const showroomsWithStats = await Promise.all(
        (showroomsData || []).map(async (showroom) => {
          const { count } = await supabase
            .from('cars')
            .select('*', { count: 'exact', head: true })
            .eq('showroom_id', showroom.id)
            .eq('status', 'available');

          return {
            ...showroom,
            car_count: count || 0
          };
        })
      );

      setShowrooms(showroomsWithStats);
    } catch (error) {
      console.error('Error fetching showrooms:', error);
      toast({
        title: "Error",
        description: "Failed to load showrooms",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const trackShowroomVisit = async (showroomId: string) => {
    try {
      // Increment total visits
      const { data: currentData } = await supabase
        .from('showroom_profiles')
        .select('total_visits')
        .eq('id', showroomId)
        .single();
      
      await supabase
        .from('showroom_profiles')
        .update({ 
          total_visits: (currentData?.total_visits || 0) + 1 
        })
        .eq('id', showroomId);
    } catch (error) {
      console.error('Error tracking visit:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Navbar />
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Car Showrooms</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover trusted car dealerships across Kenya. Browse through our verified showrooms 
            to find your perfect vehicle from reputable dealers.
          </p>
        </div>

        {/* Showrooms Grid */}
        {showrooms.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No Showrooms Yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to join our platform and showcase your vehicles to thousands of potential buyers.
            </p>
            <Button asChild>
              <Link to="/auth?role=showroom">Join as Showroom</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showrooms.map((showroom) => (
              <Card key={showroom.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      {showroom.logo_url ? (
                        <img 
                          src={showroom.logo_url} 
                          alt={showroom.showroom_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {showroom.showroom_name}
                      </CardTitle>
                      {showroom.location && (
                        <div className="flex items-center gap-1 text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{showroom.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {showroom.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {showroom.description}
                    </p>
                  )}
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 py-3 border-y border-border">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Car className="h-4 w-4" />
                        <span className="text-sm font-medium">{showroom.car_count}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Cars</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm font-medium">{showroom.total_views || 0}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Views</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">{showroom.total_visits || 0}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Visits</span>
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="space-y-2">
                    {showroom.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{showroom.phone}</span>
                      </div>
                    )}
                    {showroom.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{showroom.email}</span>
                      </div>
                    )}
                    {showroom.website && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <span>{showroom.website}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    asChild
                    onClick={() => trackShowroomVisit(showroom.id)}
                  >
                    <Link to={`/showroom/${showroom.id}`}>
                      View Showroom
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Showrooms;