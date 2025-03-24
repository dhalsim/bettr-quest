
import React from 'react';
import TagsSelector, { TagItem } from '@/components/TagsSelector';

interface TagsInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

// Popular tags for quests
const popularTags: TagItem[] = [
  { name: "Fitness", popularity: 100 },
  { name: "Learning", popularity: 95 },
  { name: "Productivity", popularity: 90 },
  { name: "Wellness", popularity: 85 },
  { name: "Meditation", popularity: 80 },
  { name: "Reading", popularity: 75 },
  { name: "Coding", popularity: 70 },
  { name: "Writing", popularity: 65 },
  { name: "Finance", popularity: 60 },
  { name: "Health", popularity: 55 },
  { name: "Creative", popularity: 50 },
  { name: "Skills", popularity: 45 },
  { name: "Personal", popularity: 40 },
  { name: "Professional", popularity: 35 },
  { name: "Social", popularity: 30 },
];

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
      availableTags={popularTags}
      onTagToggle={toggleTag}
      onCustomTagAdd={addCustomTag}
      maxVisibleTags={5}
      allowCustomTags={true}
    />
  );
};

export default TagsInput;
