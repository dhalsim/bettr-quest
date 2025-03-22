
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, XCircle, PlusCircle, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";

// All available specialization tags
const availableTags = [
  "Fitness", "Nutrition", "Wellness", "Meditation", "Productivity", 
  "Coding", "Technology", "Education", "Finance", "Art", 
  "Music", "Writing", "Language", "Travel", "Photography",
  "Cooking", "Business", "Marketing", "Design", "Reading"
];

// Form validation schema
const formSchema = z.object({
  bio: z
    .string()
    .min(20, { message: "Bio must be at least 20 characters." })
    .max(500, { message: "Bio cannot exceed 500 characters." }),
  pricingOption: z.enum(["hourly", "one-time"]),
  rateAmount: z
    .number()
    .min(1000, { message: "Rate must be at least 1,000 sats." })
    .max(1000000, { message: "Rate cannot exceed 1,000,000 sats." }),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterCoach = () => {
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Mock user profile data (from Nostr)
  const userProfile = {
    name: "Jane Smith",
    username: "jane_smith",
    profileImage: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
  };
  
  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('nostr_logged_in') === 'true';
    if (!isLoggedIn) {
      navigate('/connect', { replace: true });
      toast({
        title: "Login Required",
        description: "You need to connect with Nostr to register as a coach.",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: "",
      pricingOption: "hourly",
      rateAmount: 25000,
    },
  });
  
  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // Validate specializations
    if (specializations.length === 0) {
      toast({
        title: "Missing Specializations",
        description: "Please add at least one specialization tag.",
        variant: "destructive",
      });
      return;
    }
    
    // Combine form values and specializations
    const coachData = {
      ...values,
      specializations,
      user: userProfile,
    };
    
    console.log("Coach registration data:", coachData);
    
    // Show success message
    toast({
      title: "Registration Successful",
      description: "Your coach profile has been created.",
    });
    
    // Redirect to coach directory
    navigate('/coach-directory');
  };
  
  // Add a specialization tag
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    // Normalize input
    const normalizedInput = tagInput.trim();
    
    // Check if tag already exists
    if (specializations.includes(normalizedInput)) {
      toast({
        title: "Tag already added",
        description: `'${normalizedInput}' is already in your specializations.`,
        variant: "destructive",
      });
      return;
    }
    
    setSpecializations([...specializations, normalizedInput]);
    setTagInput('');
  };
  
  // Remove a specialization tag
  const removeTag = (tagToRemove: string) => {
    setSpecializations(specializations.filter(tag => tag !== tagToRemove));
  };
  
  // Handle predefined tag selection
  const addPredefinedTag = (tag: string) => {
    if (specializations.includes(tag)) {
      removeTag(tag);
    } else {
      setSpecializations([...specializations, tag]);
    }
  };
  
  // Filter available tags that aren't already selected
  const filteredAvailableTags = availableTags.filter(
    tag => !specializations.includes(tag)
  );
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/coach-directory" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Back to Coach Directory
        </Link>
        
        <div className="glass rounded-2xl overflow-hidden mb-10">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Register as a Coach</h1>
            
            <div className="flex items-center gap-4 mb-8 p-4 bg-background/50 rounded-lg">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={userProfile.profileImage} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                <p className="text-muted-foreground">@{userProfile.username}</p>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell potential clients about your coaching experience, qualifications, and approach..."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be displayed on your coach profile.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Specializations */}
                <div>
                  <FormLabel>Specializations</FormLabel>
                  <FormDescription className="mb-2">
                    Add tags representing your areas of expertise.
                  </FormDescription>
                  
                  {/* Selected tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {specializations.map(tag => (
                      <Badge 
                        key={tag} 
                        className="px-3 py-1 text-sm flex items-center gap-1"
                      >
                        {tag}
                        <XCircle 
                          size={14} 
                          className="cursor-pointer ml-1" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                    
                    {specializations.length === 0 && (
                      <p className="text-sm text-muted-foreground">No specializations added yet</p>
                    )}
                  </div>
                  
                  {/* Custom tag input */}
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Add a custom specialization..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      onClick={addTag}
                      variant="outline"
                      size="icon"
                    >
                      <PlusCircle size={18} />
                    </Button>
                  </div>
                  
                  {/* Predefined tags */}
                  <div>
                    <p className="text-sm font-medium mb-2">Popular specializations:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <Badge 
                          key={tag}
                          variant={specializations.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => addPredefinedTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Pricing Options */}
                <FormField
                  control={form.control}
                  name="pricingOption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing Option</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hourly" id="pricing-hourly" />
                            <Label htmlFor="pricing-hourly">Hourly Rate</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="one-time" id="pricing-one-time" />
                            <Label htmlFor="pricing-one-time">One-time Rate</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Choose how you want to charge for your coaching services.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Rate Amount */}
                <FormField
                  control={form.control}
                  name="rateAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate Amount (in sats)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1000}
                          max={1000000}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Set your rate in satoshis ({form.watch("pricingOption") === "hourly" ? "per hour" : "one-time fee"}).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  <Save size={18} className="mr-2" />
                  Register as Coach
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCoach;
