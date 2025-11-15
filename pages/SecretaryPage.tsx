import React from 'react';
import type { Author, Podcast } from '../types';
import { toPersianDigits } from '../utils/helpers';

interface SecretaryPageProps {
  secretary: Author;
  allPodcasts: Podcast[];
  onBack: () => void;
  onPodcastSelect: (podcast: Podcast) => void;
}

const SecretaryPage: React.FC<SecretaryPageProps> = ({ secretary, allPodcasts, onBack, onPodcastSelect }) => {
  const relatedPodcasts = allPodcasts.filter(podcast => podcast.speakerId === secretary.id);

  return (
    <div className="fixed inset-0 bg-background z-[200] overflow-y-auto animate-slideInFromRight">
      <header className="p-4 bg-card-bg border-b border-border-color relative">
        <button onClick={onBack} className="bg-gray-100 border-none w-10 h-10 rounded-full text-base text-text-secondary cursor-pointer transition-all duration-300 flex items-center justify-center absolute right-4 top-4 active:bg-gray-200 active:scale-95 z-10">
          <i className="fas fa-arrow-right"></i>
        </button>
        <div className="flex items-center gap-4 pt-8">
          <img src={secretary.avatar} alt={secretary.name} className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white" />
          <div>
            <h1 className="text-xl font-bold text-text-primary">{secretary.name}</h1>
            <p className="text-sm text-text-secondary mt-1">دبیر جلسات</p>
          </div>
        </div>
      </header>

      <div className="p-4">
        {relatedPodcasts.length > 0 ? (
          <section>
            <h2 className="text-base font-bold mb-3 text-text-primary pr-2.5 border-r-4 border-primary">
              جلسات ({toPersianDigits(relatedPodcasts.length)})
            </h2>
            <div className="space-y-3">
              {relatedPodcasts.map(podcast => (
                <div 
                  key={podcast.id} 
                  onClick={() => onPodcastSelect(podcast)}
                  className="group flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-200 hover:shadow-md bg-card-bg shadow-sm border border-border-color/60"
                >
                  <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img src={podcast.cover} alt={podcast.title} className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-text-primary line-clamp-2 group-hover:text-primary-dark">{podcast.title}</h4>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-text-secondary/80">
                        <span>{toPersianDigits(podcast.year)}</span>
                        <span>•</span>
                        <span>{toPersianDigits(podcast.episodes.length)} قسمت</span>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-20 text-text-secondary">
            <i className="fas fa-box-open text-4xl mb-4"></i>
            <p>جلسه‌ای برای این دبیر ثبت نشده است.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecretaryPage;