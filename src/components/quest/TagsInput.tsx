import React from 'react';
import TagsSelector from '@/components/TagsSelector';
import { mockTags } from '@/mock/data';

interface TagsInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, setTags }) => {
  // Handle toggling a tag
  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };
  
  // Handle adding a custom tag
  const addCustomTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  return (
    <TagsSelector
      selectedTags={tags}
      availableTags={mockTags}
      onTagToggle={toggleTag}
      onCustomTagAdd={addCustomTag}
      maxVisibleTags={5}
      allowCustomTags={true}
      searchPlaceholder="Search by typing"
    />
  );
};

export default TagsInput;
