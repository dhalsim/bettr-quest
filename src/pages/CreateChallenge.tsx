
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Calendar, Tag, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Mock categories
const categories = [
  'Fitness', 'Wellness', 'Learning', 'Environment', 
  'Creativity', 'Lifestyle', 'Reading', 'Productivity'
];

const CreateChallenge = () => {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Calculate minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!title.trim()) {
      toast.error("Please enter a challenge title");
      return;
    }
    
    if (!description.trim()) {
      toast.error("Please enter a challenge description");
      return;
    }
    
    if (!category && !customCategory.trim()) {
      toast.error("Please select or enter a category");
      return;
    }
    
    if (!dueDate) {
      toast.error("Please set a due date for your challenge");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Challenge created successfully!");
      navigate('/explore');
    }, 1500);
  };
  
  // Handle category removal
  const handleRemoveCategory = () => {
    setCategory('');
    setCustomCategory('');
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/explore" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Explore
        </Link>
        
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Create New Challenge</h1>
            
            <form onSubmit={handleSubmit}>
              {/* Challenge Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Challenge Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="What is your challenge?"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              {/* Challenge Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={5}
                  placeholder="Describe your challenge in detail. What are the rules? How can people complete it?"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              
              {/* Category Selection */}
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Category
                </label>
                {category || customCategory ? (
                  <div className="flex items-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
                      <Tag size={14} />
                      {category || customCategory}
                      <button
                        type="button"
                        onClick={handleRemoveCategory}
                        className="ml-1 text-primary/70 hover:text-primary"
                      >
                        <XCircle size={14} />
                      </button>
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                      id="category"
                      className="px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setCustomCategory('');
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="custom">Custom Category</option>
                    </select>
                    
                    {category === 'custom' && (
                      <input
                        type="text"
                        placeholder="Enter custom category"
                        className="px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                      />
                    )}
                  </div>
                )}
              </div>
              
              {/* Due Date */}
              <div className="mb-6">
                <label htmlFor="dueDate" className="block text-sm font-medium mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Calendar size={16} />
                  </div>
                  <input
                    type="date"
                    id="dueDate"
                    min={getMinDate()}
                    className="w-full pl-10 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* Challenge Image */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">
                  Challenge Image (Optional)
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                    imagePreview ? 'border-primary/50' : 'border-border hover:bg-secondary/50'
                  } cursor-pointer`}
                  onClick={() => document.getElementById('challenge-image')?.click()}
                >
                  <input
                    type="file"
                    id="challenge-image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Challenge Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload an image for your challenge
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8"
                  leftIcon={isSubmitting ? <Loader2 className="animate-spin" size={18} /> : undefined}
                >
                  {isSubmitting ? 'Creating Challenge...' : 'Create Challenge'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChallenge;
