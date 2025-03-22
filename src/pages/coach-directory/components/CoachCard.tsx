import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Coach, formatSats } from '../utils';

interface CoachCardProps {
  coach: Coach;
}

const CoachCard: React.FC<CoachCardProps> = ({ coach }) => {
  return (
    <div>
      <Link to={`/profile/${coach.username}`}>
        <div className="glass rounded-xl overflow-hidden transition-all hover:shadow-md hover:bg-card/70 border-2 border-gray-300">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={coach.profileImage} alt={coach.name} />
                <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-xl font-semibold">{coach.name}</h3>
                    <p className="text-muted-foreground">@{coach.username}</p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <p className="font-semibold text-primary">
                      {formatSats(coach.rateAmount)}
                      <span className="text-muted-foreground text-sm ml-1">
                        {coach.pricingOption === 'hourly' ? '/hour' : ' one-time'}
                      </span>
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="text-yellow-500">★</div>
                      <span className="font-medium">{coach.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({coach.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="mb-3 line-clamp-2">{coach.bio}</p>
                
                <div className="flex flex-wrap gap-2">
                  {coach.specializations.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CoachCard;
