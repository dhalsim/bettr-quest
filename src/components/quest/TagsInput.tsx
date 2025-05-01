import React, { useEffect, useState } from 'react';
import TagsSelector from '@/components/TagsSelector';
import { dataFetcher } from '@/lib/fetcher';
import type { TagItem } from '@/types/quest';

interface TagsInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, setTags }) => {
  const [availableTags, setAvailableTags] = useState<Map<string, TagItem>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await dataFetcher.getTags();
        const tagsMap = new Map(tags.map(tag => [tag.name, tag]));
        setAvailableTags(tagsMap);
      } catch (error) {
        console.error('Failed to load tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTags();
  }, []);

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

  if (isLoading) {
    return <div>Loading tags...</div>;
  }

  return (
    <TagsSelector
      selectedTags={tags}
      availableTags={availableTags}
      onTagToggle={toggleTag}
      onCustomTagAdd={addCustomTag}
      maxVisibleTags={5}
      allowCustomTags={true}
      searchPlaceholder="Search by typing"
    />
  );
};

export default TagsInput;
