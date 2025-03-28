import React, { useState } from 'react';
import { Search, XCircle, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';
import { TagItem } from '@/types/quest';

interface TagsSelectorProps {
  title?: string;
  description?: string;
  selectedTags: string[];
  availableTags: Map<string, TagItem>;
  onTagToggle: (tag: string) => void;
  onCustomTagAdd?: (tag: string) => void;
  maxVisibleTags?: number;
  allowCustomTags?: boolean;
  searchPlaceholder?: string;
}

const TagsSelector: React.FC<TagsSelectorProps> = ({
  title,
  description,
  selectedTags,
  availableTags,
  onTagToggle,
  onCustomTagAdd,
  maxVisibleTags = 5,
  allowCustomTags = true,
  searchPlaceholder = "Search or add custom tags..."
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { t } = useTranslation(null, { keyPrefix: "tags" });
  
  // Sort tags by popularity (if provided) or alphabetically
  const sortedAvailableTags = Array.from(availableTags.values())
    .sort((a, b) => {
      if (a.popularity !== undefined && b.popularity !== undefined) {
        return b.popularity - a.popularity;
      }
      return a.name.localeCompare(b.name);
    });
  
  // Filter tags based on search query
  const filteredTags = sortedAvailableTags.filter(tag => 
    t(tag.name).toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get the limited tags to display in the main view - now shows filtered tags when searching
  const visibleTags = filteredTags.slice(0, maxVisibleTags);
  
  // Check if current search query exactly matches any existing tag
  const tagExists = searchQuery.trim() !== '' && 
    sortedAvailableTags.some(tag => 
      tag.name.toLowerCase() === searchQuery.trim().toLowerCase()
    );
  
  // Check if current search query is in selected tags
  const tagAlreadySelected = searchQuery.trim() !== '' && 
    selectedTags.some(tag => 
      tag.toLowerCase() === searchQuery.trim().toLowerCase()
    );
  
  // Determine if we should show the add custom tag button
  const showAddCustomTag = allowCustomTags && 
    searchQuery.trim() !== '' && 
    !tagExists && 
    !tagAlreadySelected;
  
  const handleAddCustomTag = () => {
    if (!searchQuery.trim() || !onCustomTagAdd) return;
    
    const normalizedInput = searchQuery.trim();
    
    // Check if tag already exists
    if (selectedTags.includes(normalizedInput)) {
      return;
    }
    
    onCustomTagAdd(normalizedInput);
    setSearchQuery('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // If tag doesn't exist and allowCustomTags is enabled, add it as custom tag
      if (showAddCustomTag) {
        handleAddCustomTag();
      }
      // Otherwise, if there's a tag in filteredTags that's not already selected, select it
      else if (filteredTags.length > 0 && !tagAlreadySelected) {
        const firstTag = filteredTags[0].name;
        if (!selectedTags.includes(firstTag)) {
          onTagToggle(firstTag);
        }
      }
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSearchQuery('');
  };
  
  return (
    <div className="space-y-3">
      {/* Only show title and description if they are provided */}
      {(title || description) && (
        <div>
          {title && <label className="block text-sm font-medium mb-1">{title}</label>}
          {description && <p className="text-sm text-muted-foreground mb-3">{description}</p>}
        </div>
      )}
      
      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedTags.map(tag => (
          <Badge 
            key={tag} 
            className="px-3 py-1 text-sm flex items-center gap-1"
          >
            {t(tag)}
            <XCircle 
              size={14} 
              className="cursor-pointer ml-1" 
              onClick={() => onTagToggle(tag)}
            />
          </Badge>
        ))}
      </div>
      
      {/* Quick-select tags with search */}
      <div>
        <div className="flex justify-between mb-2">
          <p className="text-sm font-medium">Tags:</p>
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
                      {t(tag.name)}
                    </Badge>
                  ))}
                  
                  {filteredTags.length === 0 && showAddCustomTag && (
                    <p className="text-sm text-muted-foreground py-4 w-full text-center">
                      No matching tags found
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Single search input with conditional add custom tag button */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9 pr-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery('')}
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
          
          {/* Custom tag add button with tooltip */}
          {showAddCustomTag && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      onClick={handleAddCustomTag}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Plus size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a custom tag</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
              {t(tag.name)}
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
