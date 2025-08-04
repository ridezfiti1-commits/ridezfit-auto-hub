import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  user_id: string;
  item_type: 'car' | 'merchandise' | 'service';
  item_id: string;
  quantity: number;
  created_at: string;
  item_details?: any; // Will be populated with actual item data
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (itemType: CartItem['item_type'], itemId: string, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Fetch item details for each cart item
      const itemsWithDetails = await Promise.all(
        data.map(async (item) => {
          let itemDetails = null;
          
          try {
            const { data: details } = await supabase
              .from(item.item_type === 'car' ? 'cars' : item.item_type === 'merchandise' ? 'merchandise' : 'services')
              .select('*')
              .eq('id', item.item_id)
              .single();
            
            itemDetails = details;
          } catch (error) {
            console.error('Error fetching item details:', error);
          }

          return {
            ...item,
            quantity: item.quantity || 1,
            item_details: itemDetails,
          } as CartItem;
        })
      );

      setItems(itemsWithDetails);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cart items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemType: CartItem['item_type'], itemId: string, quantity: number = 1) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if item already exists in cart
      const existingItem = items.find(item => item.item_id === itemId && item.item_type === itemType);
      
      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          item_type: itemType,
          item_id: itemId,
          quantity,
        });

      if (error) throw error;

      await fetchCartItems();
      
      toast({
        title: "Success",
        description: "Item added to cart!",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      setItems(items.filter(item => item.id !== cartItemId));
      
      toast({
        title: "Success",
        description: "Item removed from cart!",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) throw error;

      setItems(items.map(item => 
        item.id === cartItemId ? { ...item, quantity } : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    }
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      const price = item.item_details?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const value = {
    items,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};