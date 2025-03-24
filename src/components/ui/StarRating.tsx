
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5,
  size = 16
}) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: maxRating }).map((_, i) => {
        // For filled stars
        if (i < Math.floor(rating)) {
          return <Star key={i} size={size} fill="#FFD700" color="#FFD700" />;
        }
        // For half stars (0.5 and above)
        else if (i === Math.floor(rating) && rating % 1 >= 0.5) {
          return (
            <div key={i} className="relative">
              <Star size={size} color="#E5E7EB" />
              <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                <Star size={size} fill="#FFD700" color="#FFD700" />
              </div>
            </div>
          );
        }
        // For empty stars
        else {
          return <Star key={i} size={size} color="#E5E7EB" />;
        }
      })}
    </div>
  );
};

export default StarRating;
