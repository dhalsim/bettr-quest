
import React, { useState } from 'react';
import { Search, XCircle, Plus, TagIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export interface TagItem {
  name: string;
  popularity?: number;
}

interface TagsSelectorProps {
  title?: string;
  description?: string;
  selectedTags: string[];
  availableTags: TagItem[];
  onTagToggle: (tag: string) => void;
  onCustomTagAdd?: (tag: string) => void;
  maxVisibleTags?: number;
  allowCustomTags?: boolean;
}

const TagsSelector: React.FC<TagsSelectorProps> = ({
  title = "Tags",
  description = "Select tags that best represent this item.",
  selectedTags,
  availableTags,
  onTagToggle,
  onCustomTagAdd,
  maxVisibleTags = 5,
  allowCustomTags = true,
}) => {
  const [tagInput, setTagInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Sort tags by popularity (if provided) or alphabetically
  const sortedAvailableTags = [...availableTags].sort((a, b) => {
    if (a.popularity !== undefined && b.popularity !== undefined) {
      return b.popularity - a.popularity;
    }
    return a.name.localeCompare(b.name);
  });
  
  // Filter tags based on search query
  const filteredTags = sortedAvailableTags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get the limited tags to display in the main view - now shows filtered tags when searching
  const visibleTags = filteredTags.slice(0, maxVisibleTags);
  
  const handleAddCustomTag = () => {
    if (!tagInput.trim() || !onCustomTagAdd) return;
    
    const normalizedInput = tagInput.trim();
    
    // Check if tag already exists
    if (selectedTags.includes(normalizedInput)) {
      return;
    }
    
    onCustomTagAdd(normalizedInput);
    setTagInput('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSearchQuery('');
  };
  
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">{title}</label>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      </div>
      
      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedTags.map(tag => (
          <Badge 
            key={tag} 
            className="px-3 py-1 text-sm flex items-center gap-1"
          >
            {tag}
            <XCircle 
              size={14} 
              className="cursor-pointer ml-1" 
              onClick={() => onTagToggle(tag)}
            />
          </Badge>
        ))}
        
        {selectedTags.length === 0 && (
          <p className="text-sm text-muted-foreground">No tags selected yet</p>
        )}
      </div>
      
      {/* Search and add custom tag */}
      {allowCustomTags && (
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a custom tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            type="button" 
            onClick={handleAddCustomTag}
            variant="outline"
            size="icon"
          >
            <Plus size={18} />
          </Button>
        </div>
      )}
      
      {/* Quick-select tags - now with a search box for popular tags */}
      <div>
        <div className="flex justify-between mb-2">
          <p className="text-sm font-medium">Popular tags:</p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="link" size="sm" className="h-auto p-0">
                View all
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>All Available Tags</DialogTitle>
              </DialogHeader>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tags..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchQuery('')}
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {filteredTags.map(tag => (
                    <Badge 
                      key={tag.name}
                      variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                      className="cursor-pointer px-2 py-1"
                      onClick={() => {
                        onTagToggle(tag.name);
                        if (selectedTags.includes(tag.name)) {
                          // If we're deselecting, keep the dialog open
                        } else {
                          // If selecting a new tag, close the dialog
                          closeDialog();
                        }
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                  
                  {filteredTags.length === 0 && (
                    <p className="text-sm text-muted-foreground py-4 w-full text-center">
                      No matching tags found
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Add search input for the main tag view */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tags..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery('')}
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {visibleTags.map(tag => (
            <Badge 
              key={tag.name}
              variant={selectedTags.includes(tag.name) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onTagToggle(tag.name)}
            >
              {tag.name}
            </Badge>
          ))}
          
          {visibleTags.length === 0 && (
            <p className="text-sm text-muted-foreground">No matching tags found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagsSelector;
