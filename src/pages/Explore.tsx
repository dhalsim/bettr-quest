import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestCard from '@/components/quest-card/QuestCard';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TagsSelector from '@/components/TagsSelector';
import { mockQuests, mockTags, mockProofs } from '@/mock/data';
import { useTranslation } from 'react-i18next';
import { isLockedQuest, LockedQuest } from '@/types/quest';
import { useNostrAuth } from '@/hooks/useNostrAuth';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation(null, { keyPrefix: "explore" });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { profile } = useNostrAuth();
  
  // Convert mockQuests object to array for explore page
  const exploreQuests = Object.values(mockQuests)
    .filter((quest): quest is LockedQuest => { 
      return isLockedQuest(quest) && quest.userId !== profile?.pubkey;
    });

  const [filteredQuests, setFilteredQuests] = useState(exploreQuests);
  
  // Sync selectedTags with URL params
  useEffect(() => {
    const specialization = searchParams.get('specialization');
    
    if (specialization && specialization !== 'All') {
      setSelectedTags([specialization]);
    } else {
      setSelectedTags([]);
    }
  }, [searchParams]);
  
  useEffect(() => {
    const filtered = exploreQuests.filter(quest => {
      const matchesQuery = quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => quest.specializations.some(s => s.name === tag));
      
      return matchesQuery && matchesTags;
    });
    
    setFilteredQuests(filtered);
  }, [selectedTags, searchQuery]);
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSpecializationClick = (e: React.MouseEvent, specialization: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/explore?specialization=${specialization}`);
  };

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement follow toggle functionality
  };

  const handleLockSats = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement lock sats functionality
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">{t('Explore Quests')}</h1>
          <p className="text-muted-foreground">
            {t('Discover quests created by users and follow their journeys')}
          </p>
        </div>
        
        <div className="glass rounded-2xl p-6 mb-10">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                className="pl-10 px-4 py-3 w-full bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder={t('Search quests...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <TagsSelector
              selectedTags={selectedTags}
              availableTags={mockTags}
              onTagToggle={toggleTag}
              allowCustomTags={false}
              maxVisibleTags={5}
              searchPlaceholder={t('Search by typing')}
            />
            
            <Button type="submit" className="w-full md:w-auto">
              {t('Search')}
            </Button>
          </form>
        </div>
        
        {filteredQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredQuests.map((quest) => (
              <QuestCard 
                key={quest.id} 
                quest={quest}
                proof={isLockedQuest(quest) ? mockProofs[quest.id]?.[0] : undefined}
                isOwnedByCurrentUser={quest.userId === profile?.pubkey}
                isFollowing={false}
                onSpecializationClick={handleSpecializationClick}
                onFollowToggle={handleFollowToggle}
                onLockSats={handleLockSats}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-2xl">
            <h3 className="text-xl font-medium mb-2">{t('No quests found')}</h3>
            <p className="text-muted-foreground">
              {t('Try adjusting your search or category filters')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
