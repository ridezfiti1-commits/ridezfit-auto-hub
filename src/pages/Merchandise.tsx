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
import { useCart } from "@/contexts/CartContext";
import { Search, Filter, Wrench, ShoppingCart } from "lucide-react";

const Merchandise = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { addToCart } = useCart();

  const { data: merchandise = [], isLoading } = useQuery({
    queryKey: ['merchandise', searchTerm, categoryFilter, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('merchandise')
        .select('*');

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      switch (sortBy) {
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'name':
          query = query.order('title', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleAddToCart = async (itemId: string) => {
    try {
      await addToCart('merchandise', itemId, 1);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // Get unique categories for filter
  const { data: categories = [] } = useQuery({
    queryKey: ['merchandise-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('merchandise')
        .select('category');
      
      if (error) throw error;
      return [...new Set(data.map(item => item.category))];
    },
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Car Accessories & Merchandise</h1>
          <p className="text-lg text-muted-foreground">
            Enhance your vehicle with premium accessories and parts
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 p-6 bg-muted rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search accessories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
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
                <SelectItem value="name">Name A-Z</SelectItem>
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
            {isLoading ? 'Loading...' : `${merchandise.length} products found`}
          </p>
        </div>

        {/* Merchandise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {merchandise.map((item) => (
            <Card key={item.id} className="card-hover overflow-hidden">
              <div className="aspect-square bg-muted relative">
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
                
                <Badge className="absolute top-3 right-3 bg-primary">
                  {item.category}
                </Badge>

                {item.stock_quantity !== undefined && item.stock_quantity < 10 && (
                  <Badge variant="destructive" className="absolute top-3 left-3">
                    {item.stock_quantity === 0 ? 'Out of Stock' : `Only ${item.stock_quantity} left`}
                  </Badge>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    ${item.price?.toLocaleString() || 'N/A'}
                  </span>
                  {item.stock_quantity !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      Stock: {item.stock_quantity}
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  {item.description?.substring(0, 100)}...
                </p>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={() => handleAddToCart(item.id)}
                  className="w-full"
                  disabled={item.stock_quantity === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {item.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {merchandise.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Wrench className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all categories.
            </p>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
};

export default Merchandise;