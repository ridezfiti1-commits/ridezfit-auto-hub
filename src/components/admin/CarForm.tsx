import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, Link as LinkIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
}

interface CarFormProps {
  car?: Car | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CarForm = ({ car, onSuccess, onCancel }: CarFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Predefined car features list
  const predefinedFeatures = [
    "Air Conditioning", "Power Steering", "ABS Brakes", "Airbags", "Electric Windows",
    "Central Locking", "Cruise Control", "GPS Navigation", "Bluetooth", "USB Ports",
    "Backup Camera", "Parking Sensors", "Sunroof", "Heated Seats", "Leather Seats",
    "Alloy Wheels", "Fog Lights", "Xenon Headlights", "Keyless Entry", "Push Start",
    "Auto Transmission", "Manual Transmission", "4WD/AWD", "Sport Mode", "Eco Mode"
  ];
  
  const [formData, setFormData] = useState({
    make: car?.make || '',
    model: car?.model || '',
    year: car?.year || new Date().getFullYear(),
    price: car?.price || 0,
    mileage: car?.mileage || 0,
    color: car?.color || '',
    fuel_type: car?.fuel_type || '',
    transmission: car?.transmission || '',
    engine_size: car?.engine_size || '',
    condition: car?.condition || 'used',
    description: car?.description || '',
    status: car?.status || 'available'
  });

  const [images, setImages] = useState<string[]>(car?.images || ['']);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(car?.features || []);
  const [newCustomFeature, setNewCustomFeature] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addImage = () => {
    setImages([...images, '']);
  };

  const updateImage = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const addCustomFeature = () => {
    if (newCustomFeature.trim() && !selectedFeatures.includes(newCustomFeature.trim())) {
      setSelectedFeatures([...selectedFeatures, newCustomFeature.trim()]);
      setNewCustomFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const carData = {
        ...formData,
        images: images.filter(img => img.trim()),
        features: selectedFeatures,
        admin_id: user.id
      };

      if (car) {
        // Update existing car
        const { error } = await supabase
          .from('cars')
          .update(carData)
          .eq('id', car.id)
          .eq('admin_id', user.id);

        if (error) throw error;
        toast({ title: "Car updated successfully" });
      } else {
        // Create new car
        const { error } = await supabase
          .from('cars')
          .insert([carData]);

        if (error) throw error;
        toast({ title: "Car added successfully" });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving car:', error);
      toast({
        title: "Error",
        description: "Failed to save car",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                placeholder="e.g., Toyota"
                required
              />
            </div>
            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g., Camry"
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                min="1950"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price (R) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mileage">Mileage (km)</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="e.g., Red"
              />
            </div>
            <div>
              <Label htmlFor="fuel_type">Fuel Type</Label>
              <Select value={formData.fuel_type} onValueChange={(value) => handleInputChange('fuel_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="transmission">Transmission</Label>
              <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="cvt">CVT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="engine_size">Engine Size</Label>
              <Input
                id="engine_size"
                value={formData.engine_size}
                onChange={(e) => handleInputChange('engine_size', e.target.value)}
                placeholder="e.g., 2.0L"
              />
            </div>
            <div>
              <Label htmlFor="condition">Condition *</Label>
              <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="certified">Certified Pre-owned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the vehicle's condition, history, and any special features..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-3">
              Add images via URL links. First image will be used as the main display image.
            </div>
            
            {images.map((image, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <LinkIcon className="h-4 w-4 mt-3 text-muted-foreground" />
                      <Input
                        value={image}
                        onChange={(e) => updateImage(index, e.target.value)}
                        placeholder="https://example.com/car-image.jpg"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeImage(index)}
                        disabled={images.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Image Preview */}
                {image && (
                  <div className="ml-6">
                    <img 
                      src={image} 
                      alt={`Preview ${index + 1}`}
                      className="w-32 h-24 object-cover rounded border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={addImage} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Image
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Predefined Features Grid */}
            <div>
              <Label className="text-base font-medium mb-3 block">Select Features</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {predefinedFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={selectedFeatures.includes(feature)}
                      onCheckedChange={() => toggleFeature(feature)}
                    />
                    <Label
                      htmlFor={feature}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Feature Input */}
            <div>
              <Label className="text-base font-medium mb-3 block">Add Custom Feature</Label>
              <div className="flex gap-2">
                <Input
                  value={newCustomFeature}
                  onChange={(e) => setNewCustomFeature(e.target.value)}
                  placeholder="Enter custom feature..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())}
                />
                <Button type="button" onClick={addCustomFeature} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Selected Features Display */}
            {selectedFeatures.length > 0 && (
              <div>
                <Label className="text-base font-medium mb-3 block">Selected Features</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedFeatures.map((feature) => (
                    <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="status">Availability Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : car ? 'Update Car' : 'Add Car'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};