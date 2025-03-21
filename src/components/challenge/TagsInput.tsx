
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag, X, Plus } from 'lucide-react';

interface TagsInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, setTags }) => {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor="tags" className="block text-sm font-medium mb-2">
        Tags
      </label>
      <div className="mb-2 flex flex-wrap gap-2">
        {tags.map(tag => (
          <div 
            key={tag} 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary"
          >
            <Tag size={14} />
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-primary/70 hover:text-primary"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex">
        <Input
          id="new-tag"
          placeholder="Add a tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleTagKeyDown}
          className="w-full"
        />
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={addTag}
          className="ml-2"
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};

export default TagsInput;
