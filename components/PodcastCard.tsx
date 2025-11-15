import React from 'react';
import type { Podcast, Author } from '../types';

interface PodcastCardProps {
  podcast: Podcast;
  author?: Author;
  isSquare?: boolean;
  onClick: () => void;
  onAuthorSelect?: (author: Author) => void;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ podcast, author, isSquare = false, onClick, onAuthorSelect }) => {
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's onClick from firing

    if (navigator.share) {
      const shareUrl = (window.location.origin && window.location.origin !== 'null') 
        ? window.location.origin 
        : 'https://soha.app';

      try {
        await navigator.share({
          title: podcast.title,
          text: podcast.description,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing podcast:', error);
      }
    } else {
      alert('اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود.');
    }
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAuthorSelect && author) {
      onAuthorSelect(author);
    }
  };
  
  const isMaster = author?.role === 'master';

  return (
    <div
      className="bg-card-bg rounded-xl overflow-hidden shadow-custom hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer border border-border-color/80 group active:scale-95 active:shadow-lg flex flex-col"
      onClick={onClick}
    >
      <div className={`w-full relative overflow-hidden ${isSquare ? 'aspect-square' : 'aspect-[2/3]'}`}>
        <img src={podcast.cover} alt={podcast.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

        {isMaster && author && (
             <div 
                className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-sm shadow-lg cursor-pointer hover:bg-black/80"
                onClick={handleAuthorClick}
            >
                {author.name}
             </div>
        )}
        
        <button
          onClick={handleShare}
          aria-label={`اشتراک‌گذاری ${podcast.title}`}
          className="absolute top-2 left-2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out shadow-md backdrop-blur-sm active:bg-black/60"
        >
          <i className="fas fa-share-alt"></i>
        </button>
      </div>
      <div className="p-2.5 flex-grow flex flex-col">
        <h3 className="text-sm font-bold leading-tight line-clamp-2 text-text-primary flex-grow">{podcast.title}</h3>
        {!isMaster && author && (
            <p 
              className={`text-xs text-text-secondary mt-1 whitespace-nowrap overflow-hidden text-ellipsis ${onAuthorSelect ? 'hover:text-primary hover:underline' : ''}`}
              onClick={onAuthorSelect ? handleAuthorClick : undefined}
            >
                با دبیری: {author.name}
            </p>
        )}
        <div className="flex flex-wrap gap-1 mt-2">
          {podcast.categories.slice(0, 2).map(cat => (
             <span key={cat} className="bg-primary-light-op text-primary py-0.5 px-2 rounded-full text-[9px] font-bold">{cat}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;