import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Save } from 'lucide-react';
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
import { useToast } from "@/hooks/use-toast";
import { useNostrAuth } from '@/hooks/useNostrAuth';
import TagsSelector, { TagItem } from '@/components/TagsSelector';

// All available specialization tags with popularity scores
const availableTags: TagItem[] = [
  { name: "Fitness", popularity: 95 },
  { name: "Nutrition", popularity: 90 },
  { name: "Wellness", popularity: 85 },
  { name: "Meditation", popularity: 78 },
  { name: "Productivity", popularity: 75 },
  { name: "Coding", popularity: 70 },
  { name: "Technology", popularity: 65 },
  { name: "Education", popularity: 60 },
  { name: "Finance", popularity: 58 },
  { name: "Art", popularity: 55 },
  { name: "Music", popularity: 53 },
  { name: "Writing", popularity: 50 },
  { name: "Language", popularity: 48 },
  { name: "Travel", popularity: 45 },
  { name: "Photography", popularity: 42 },
  { name: "Cooking", popularity: 40 },
  { name: "Business", popularity: 38 },
  { name: "Marketing", popularity: 35 },
  { name: "Design", popularity: 33 },
  { name: "Reading", popularity: 30 }
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoggedIn, profile } = useNostrAuth();
  
  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/connect', { replace: true });
      toast({
        title: "Login Required",
        description: "You need to connect with Nostr to register as a coach.",
        variant: "destructive",
      });
    }
  }, [isLoggedIn, navigate, toast]);

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
      user: profile,
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
  
  // Toggle a specialization tag
  const toggleSpecialization = (tag: string) => {
    if (specializations.includes(tag)) {
      setSpecializations(specializations.filter(t => t !== tag));
    } else {
      setSpecializations([...specializations, tag]);
    }
  };
  
  // Add a custom specialization tag
  const addCustomSpecialization = (tag: string) => {
    if (!specializations.includes(tag)) {
      setSpecializations([...specializations, tag]);
    }
  };
  
  // If not logged in or no profile, don't render the form
  if (!isLoggedIn || !profile) {
    return null;
  }
  
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
                <AvatarImage src={profile.profileImage} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-muted-foreground">@{profile.username}</p>
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
                  <label className="block text-sm font-medium mb-1">Specializations</label>
                  <p className="text-sm text-muted-foreground mb-3">Add tags representing your areas of expertise.</p>
                  <TagsSelector
                    selectedTags={specializations}
                    availableTags={availableTags}
                    onTagToggle={toggleSpecialization}
                    onCustomTagAdd={addCustomSpecialization}
                    maxVisibleTags={5}
                    allowCustomTags={true}
                    searchPlaceholder="Search by typing"
                  />
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
