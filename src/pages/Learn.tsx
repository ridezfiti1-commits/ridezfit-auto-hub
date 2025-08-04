import { useState, useEffect } from "react";
import { ExternalLink, Calendar, User, Heart, MessageCircle, Share2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: number;
  likes: number;
  comments: number;
}

const Learn = () => {
  const [posts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "Complete Guide to Buying Your First Car in Kenya",
      excerpt: "Everything you need to know about purchasing a vehicle in Kenya, from budgeting to paperwork and insurance requirements.",
      content: "Detailed guide content...",
      author: "Sarah Mwangi",
      date: "2024-08-01",
      category: "Buying Guide",
      image: "/api/placeholder/400/250",
      readTime: 8,
      likes: 124,
      comments: 23
    },
    {
      id: "2", 
      title: "Electric Vehicles in Kenya: The Future is Here",
      excerpt: "Exploring the growing electric vehicle market in Kenya, charging infrastructure, and what it means for consumers.",
      content: "Electric vehicle content...",
      author: "James Ochieng",
      date: "2024-07-28",
      category: "Technology",
      image: "/api/placeholder/400/250",
      readTime: 6,
      likes: 89,
      comments: 17
    },
    {
      id: "3",
      title: "Car Maintenance Tips for Kenyan Roads",
      excerpt: "Essential maintenance practices to keep your vehicle running smoothly on Kenya's diverse road conditions.",
      content: "Maintenance tips content...",
      author: "Grace Wanjiku",
      date: "2024-07-25",
      category: "Maintenance",
      image: "/api/placeholder/400/250",
      readTime: 5,
      likes: 156,
      comments: 34
    },
    {
      id: "4",
      title: "Understanding Car Insurance in Kenya",
      excerpt: "A comprehensive breakdown of car insurance options, requirements, and how to choose the right coverage.",
      content: "Insurance guide content...",
      author: "David Kiprotich",
      date: "2024-07-20",
      category: "Insurance",
      image: "/api/placeholder/400/250",
      readTime: 7,
      likes: 78,
      comments: 12
    },
    {
      id: "5",
      title: "Best Family Cars for Kenyan Families",
      excerpt: "Top recommendations for family vehicles that offer safety, comfort, and value for money in the Kenyan market.",
      content: "Family car guide content...",
      author: "Mary Nyambura",
      date: "2024-07-15",
      category: "Reviews",
      image: "/api/placeholder/400/250",
      readTime: 10,
      likes: 203,
      comments: 45
    },
    {
      id: "6",
      title: "Financing Your Car Purchase: Options and Tips",
      excerpt: "Explore different financing options available in Kenya and smart strategies for securing the best car loan.",
      content: "Financing guide content...",
      author: "Peter Mbugua",
      date: "2024-07-10",
      category: "Finance",
      image: "/api/placeholder/400/250",
      readTime: 9,
      likes: 67,
      comments: 19
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);

  const categories = ["All", "Buying Guide", "Technology", "Maintenance", "Insurance", "Reviews", "Finance"];

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === selectedCategory));
    }
  }, [selectedCategory, posts]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Buying Guide": "bg-blue-100 text-blue-800",
      "Technology": "bg-green-100 text-green-800", 
      "Maintenance": "bg-orange-100 text-orange-800",
      "Insurance": "bg-purple-100 text-purple-800",
      "Reviews": "bg-pink-100 text-pink-800",
      "Finance": "bg-yellow-100 text-yellow-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Learn About Cars</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay informed with the latest automotive insights, buying guides, maintenance tips, 
            and industry news tailored for the Kenyan market.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <Card className="mb-12 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={filteredPosts[0].image} 
                  alt={filteredPosts[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className={`mb-4 ${getCategoryColor(filteredPosts[0].category)}`}>
                  Featured • {filteredPosts[0].category}
                </Badge>
                <h2 className="text-3xl font-bold mb-4 leading-tight">
                  {filteredPosts[0].title}
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  {filteredPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{filteredPosts[0].author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(filteredPosts[0].date)}</span>
                  </div>
                  <span>{filteredPosts[0].readTime} min read</span>
                </div>
                <Button className="w-full md:w-auto">
                  Read Full Article
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.slice(1).map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-all duration-200">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={getCategoryColor(post.category)} variant="secondary">
                    {post.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.readTime} min read
                  </span>
                </div>
                
                <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Separator />
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button className="w-full" variant="outline">
                  Read Article
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Media Integration Placeholder */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">Follow Us on Social Media</h3>
          <p className="text-muted-foreground mb-8">
            Stay updated with our latest posts and automotive news on social platforms.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg">
              Facebook
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              Instagram  
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              X (Twitter)
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Learn;