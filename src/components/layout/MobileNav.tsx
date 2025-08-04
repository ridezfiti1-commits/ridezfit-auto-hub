import { Link, useLocation } from "react-router-dom";
import { Home, Store, User, ShoppingCart, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

export const MobileNav = () => {
  const location = useLocation();
  const { user, profile } = useAuth();
  const { items } = useCart();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    {
      label: "Buy",
      href: "/",
      icon: Home,
      active: location.pathname === "/",
    },
    {
      label: "Showrooms",
      href: "/showrooms",
      icon: Building2,
      active: location.pathname === "/showrooms" || location.pathname.startsWith("/showroom/"),
    },
    {
      label: "Sell",
      href: profile?.role === 'showroom' ? "/dashboard" : "/auth?role=showroom",
      icon: Store,
      active: location.pathname.startsWith("/dashboard"),
    },
    {
      label: "Profile",
      href: user ? "/profile" : "/auth",
      icon: User,
      active: location.pathname === "/profile",
    },
    {
      label: "Cart",
      href: "/cart",
      icon: ShoppingCart,
      active: location.pathname === "/cart",
      badge: cartItemCount > 0 ? cartItemCount : undefined,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 text-xs transition-colors",
                item.active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};