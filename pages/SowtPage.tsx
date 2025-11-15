import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Podcast, Author } from '../types';
import PodcastCard from '../components/PodcastCard';
import NewEpisodeCard from '../components/NewEpisodeCard';
import LiveBanner from '../components/LiveBanner';

interface SowtPageProps {
  podcasts: Podcast[];
  authors: Author[];
  liveStream: { isLive: boolean; title: string; url: string; };
  onPodcastSelect: (podcast: Podcast) => void;
  onPlay: (podcast: Podcast, episodeIndex: number) => void;
  userInterests: string[];
  isHeaderVisible: boolean;
  onAuthorSelect: (author: Author) => void;
}

const SowtPage: React.FC<SowtPageProps> = ({ podcasts, authors, liveStream, onPodcastSelect, onPlay, userInterests, isHeaderVisible, onAuthorSelect }) => {
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isScrolledToStart, setIsScrolledToStart] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  
  const regularPodcasts = podcasts.filter(p => !p.isSquare);
  const squarePodcasts = podcasts.filter(p => p.isSquare);

  const allCategories = ["همه", ...[...new Set(regularPodcasts.flatMap(p => p.categories))]];
  const categories = userInterests.length > 0
    ? ["همه", ...allCategories.slice(1).filter(cat => userInterests.includes(cat))]
    : allCategories;
  
  const newEpisodes = regularPodcasts
    .flatMap(podcast => podcast.episodes.map((episode, index) => ({ podcast, episode, episodeIndex: index })))
    .filter(item => item.episode.isNew)
    .filter(item => userInterests.length === 0 || item.podcast.categories.some(cat => userInterests.includes(cat)))
    .sort((a, b) => new Date(b.episode.date).getTime() - new Date(a.episode.date).getTime())
    .slice(0, 3);
  
  const getAuthorById = useCallback((id: number) => authors.find(a => a.id === id), [authors]);

  const filteredPodcasts = regularPodcasts.filter(p => {
    const author = getAuthorById(p.speakerId);
    const matchesCategory = selectedCategory === 'همه' || p.categories.includes(selectedCategory);
    const matchesSearch = searchQuery.trim() === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (author?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesInterests = userInterests.length === 0 || p.categories.some(cat => userInterests.includes(cat));
    return matchesCategory && matchesSearch && matchesInterests;
  });

  const checkScrollability = useCallback(() => {
    const el = categoriesScrollRef.current;
    if (!el) return;

    const { scrollWidth, clientWidth } = el;
    const tolerance = 5;
    const scrollableWidth = scrollWidth - clientWidth;

    if (scrollableWidth < tolerance) {
        setIsScrolledToStart(true);
        setCanScrollLeft(false);
        return;
    }

    const isRTL = getComputedStyle(el).direction === 'rtl';
    const currentScroll = el.scrollLeft;

    let atStart, atEnd;

    if (isRTL) {
        const normalizedScroll = Math.abs(currentScroll);
        if (currentScroll > 0) { 
            atStart = currentScroll >= scrollableWidth - tolerance;
            atEnd = currentScroll <= tolerance;
        } else { 
            atStart = normalizedScroll <= tolerance;
            atEnd = normalizedScroll >= scrollableWidth - tolerance;
        }
    } else { 
        atStart = currentScroll <= tolerance;
        atEnd = currentScroll >= scrollableWidth - tolerance;
    }

    setIsScrolledToStart(atStart);
    setCanScrollLeft(!atEnd);
  }, []);

  useEffect(() => {
      const el = categoriesScrollRef.current;
      if (!el) return;

      checkScrollability();
      el.addEventListener('scroll', checkScrollability, { passive: true });
      window.addEventListener('resize', checkScrollability);
      const resizeObserver = new ResizeObserver(checkScrollability);
      resizeObserver.observe(el);
      return () => {
          el.removeEventListener('scroll', checkScrollability);
          window.removeEventListener('resize', checkScrollability);
          resizeObserver.unobserve(el);
      }
  }, [categories, checkScrollability]);

  const handleCategoryScroll = (direction: 'left' | 'start') => {
      const el = categoriesScrollRef.current;
      if (!el) return;
      const amount = direction === 'left' ? 300 : -el.scrollWidth;
      el.scrollBy({ left: amount, behavior: 'smooth' });
  };
  
  const stickyTopClass = isHeaderVisible ? 'top-[73px]' : 'top-0';

  return (
    <main className="pb-10">
      {liveStream.isLive && !isBannerDismissed && (
        <div className="px-4 pt-4">
          <LiveBanner 
            title={liveStream.title} 
            url={liveStream.url}
            onDismiss={() => setIsBannerDismissed(true)} 
          />
        </div>
      )}

      <div className={`p-4 border-b border-border-color sticky bg-background/95 backdrop-blur-sm z-30 transition-all duration-300 ${stickyTopClass}`}>
        <div className="flex items-center gap-2 h-10">
          {isSearchActive ? (
            <>
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="جستجو در صوت‌ها..."
                autoFocus
                className="w-full h-full bg-gray-100 border border-border-color rounded-full px-4 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none animate-fadeIn" 
              />
              <button onClick={() => { setIsSearchActive(false); setSearchQuery(''); }} className="text-text-secondary hover:text-text-primary flex-shrink-0 px-2">
                <i className="fas fa-times"></i>
              </button>
            </>
          ) : (
            <>
                <button 
                    onClick={() => handleCategoryScroll('left')} 
                    aria-label="اسکرول به چپ"
                    className={`w-10 h-10 flex-shrink-0 rounded-full bg-card-bg text-text-secondary flex items-center justify-center border border-border-color transition-opacity active:scale-95 hover:bg-gray-200 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <i className="fas fa-chevron-left text-base"></i>
                </button>
                <div ref={categoriesScrollRef} className="flex-1 flex overflow-x-auto gap-2 no-scrollbar h-full items-center flex-nowrap px-1">
                    {categories.map((cat) => (
                    <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`py-1.5 px-4 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 active:scale-95 ${selectedCategory === cat ? 'bg-primary text-white shadow' : 'bg-card-bg text-text-primary hover:bg-gray-200 border border-border-color'}`}
                    >
                        {cat}
                    </button>
                    ))}
                </div>
                 <div className="relative w-10 h-10 flex-shrink-0">
                  <button 
                      onClick={() => setIsSearchActive(true)}
                      aria-label="جستجو"
                      className={`absolute inset-0 w-10 h-10 bg-card-bg text-text-secondary rounded-full flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all duration-300 border border-border-color ${isScrolledToStart ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}
                  >
                      <i className="fas fa-search"></i>
                  </button>
                  <button
                      onClick={() => handleCategoryScroll('start')}
                      aria-label="برو به ابتدا"
                      className={`absolute inset-0 w-10 h-10 bg-card-bg text-text-secondary rounded-full flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all duration-300 border border-border-color ${!isScrolledToStart ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}
                  >
                      <i className="fas fa-chevron-right text-base"></i>
                  </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="p-[15px]">
        {selectedCategory === 'همه' && searchQuery === '' && (
          <>
            <section className="p-2.5 mb-4">
              <h2 className="text-base font-bold mb-3 text-text-primary pr-2.5 border-r-4 border-primary flex items-center gap-2">
                <i className="fas fa-headphones"></i>
                آخرین صوت‌ها
              </h2>
              <div className="flex flex-col gap-2">
                {newEpisodes.length > 0 ? (
                  newEpisodes.map(item => (
                    <NewEpisodeCard
                      key={`${item.podcast.id}-${item.episodeIndex}`}
                      podcast={item.podcast}
                      episode={item.episode}
                      episodeIndex={item.episodeIndex}
                      onSelect={onPodcastSelect}
                      onPlay={onPlay}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-text-secondary w-full">
                    <i className="fas fa-clock text-2xl mb-2.5"></i>
                    <p>هنوز محتوای جدیدی وجود ندارد</p>
                  </div>
                )}
              </div>
            </section>
            
            <section className="mb-6">
              <h2 className="text-base font-bold mb-3 text-text-primary pr-2.5 border-r-4 border-primary">پادکست‌ها</h2>
              <div className="flex overflow-x-auto gap-2.5 pb-2 no-scrollbar snap-x snap-mandatory">
                {squarePodcasts
                  .filter(p => userInterests.length === 0 || p.categories.some(cat => userInterests.includes(cat)))
                  .map(p => {
                    const author = getAuthorById(p.speakerId);
                    return (
                      <div key={p.id} className="w-[31%] sm:w-[23%] flex-shrink-0 snap-start">
                        <PodcastCard podcast={p} author={author} isSquare onClick={() => onPodcastSelect(p)} onAuthorSelect={onAuthorSelect} />
                      </div>
                    );
                  })}
              </div>
            </section>
          </>
        )}

        <div id="categoriesContainer">
          <section className="mb-6">
            <h2 className="text-base font-bold mb-3 text-text-primary pr-2.5 border-r-4 border-primary">{isSearchActive && searchQuery ? `نتایج جستجو برای: "${searchQuery}"` : selectedCategory}</h2>
            <div className="grid grid-cols-3 gap-2.5">
              {filteredPodcasts.length > 0 ? filteredPodcasts.map(p => {
                const author = getAuthorById(p.speakerId);
                return (
                  <PodcastCard key={p.id} podcast={p} author={author} onClick={() => onPodcastSelect(p)} onAuthorSelect={onAuthorSelect} />
                );
              }) : (
                <div className="col-span-3 text-center py-20 text-text-secondary">
                  <i className="fas fa-box-open text-4xl mb-4"></i>
                  <p>صوتی مطابق با فیلتر شما یافت نشد.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <footer className="text-center py-[30px] px-[15px] bg-card-bg border-t border-border-color mt-5">
        <div className="flex items-center justify-center gap-2.5 mb-2.5">
          <img src="https://uploadkon.ir/uploads/ce6e18_25sohamedia.png" alt="لوگو سُها" className="w-10 h-10 rounded-lg"/>
          <h2 className="text-lg text-primary font-bold">سُها</h2>
        </div>
        <p className="text-xs text-text-secondary leading-normal">اپلیکیشن پادکست‌های تفکر و اندیشه</p>
      </footer>
    </main>
  );
};

export default SowtPage;