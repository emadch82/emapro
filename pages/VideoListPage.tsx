
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Video, Comment } from '../types';
import VideoCard from '../components/VideoCard';
import VideoListItem from '../components/VideoListItem';
import { toPersianDigits, requestNotificationPermission } from '../utils/helpers';

interface VideoListPageProps {
  videos: Video[];
  initialVideoToPlay: Video | null;
  onVideoPlayed: () => void;
  isHeaderVisible: boolean;
  onVideoSelect: (video: Video) => void;
  activeVideo: Video | null;
  isPlayerInline: boolean;
  allVideos: Video[];
  comments: Comment[];
  onAddComment: (text: string, video: Video) => void;
  onEnterStandalone: () => void;
}

const VideoListPage: React.FC<VideoListPageProps> = ({ 
  videos, 
  initialVideoToPlay, 
  onVideoPlayed, 
  isHeaderVisible, 
  onVideoSelect,
  activeVideo,
  isPlayerInline,
  allVideos,
  comments,
  onAddComment,
  onEnterStandalone,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for video player details/tabs
  const [activePlayerTab, setActivePlayerTab] = useState<'details' | 'comments' | 'upNext'>('details');
  const [newCommentText, setNewCommentText] = useState('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isDescriptionOverflowing, setIsDescriptionOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);


  useEffect(() => {
    const pageElement = pageRef.current;
    if (!pageElement) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only track touch start if we're scrolled to the top.
      if (window.scrollY === 0) {
        touchStartY.current = e.touches[0].clientY;
      } else {
        touchStartY.current = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY.current === null) return;

      const deltaY = e.touches[0].clientY - touchStartY.current;

      // If scrolling down (positive deltaY) from the top, trigger standalone.
      if (deltaY > 80) { // 80px threshold for a clear gesture
        onEnterStandalone();
        touchStartY.current = null; // Prevent re-triggering
      }
    };

    pageElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    pageElement.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
        pageElement.removeEventListener('touchstart', handleTouchStart);
        pageElement.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onEnterStandalone]);


  const [isScrolledToStart, setIsScrolledToStart] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (initialVideoToPlay) {
      onVideoSelect(initialVideoToPlay);
      onVideoPlayed();
    }
  }, [initialVideoToPlay, onVideoPlayed, onVideoSelect]);
  
  useEffect(() => {
    // Reset and check for overflow when the video changes
    setIsDescriptionExpanded(false);
    
    const timer = setTimeout(() => {
        if (descriptionRef.current) {
            const { scrollHeight, clientHeight } = descriptionRef.current;
            setIsDescriptionOverflowing(scrollHeight > clientHeight);
        } else {
            setIsDescriptionOverflowing(false);
        }
    }, 50); // Small delay to allow DOM update

    return () => clearTimeout(timer);
  }, [activeVideo]);

  const handleVideoCardSelect = (video: Video) => {
    onVideoSelect(video);
    setIsDescriptionExpanded(false);
    setActivePlayerTab('details');
  };
  
  const handleAddCommentSubmit = () => {
      if (newCommentText.trim() && activeVideo) {
          onAddComment(newCommentText, activeVideo);
          setNewCommentText('');
      }
  };
  
  const handleSelectCommentsTab = async () => {
      const initialPermission = Notification.permission;
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted && initialPermission === 'default') {
          // Show confirmation only if permission was just granted.
          new Notification('اعلان‌ها فعال شدند!', {
              body: 'از این پس از نظرات جدید در سُها باخبر خواهید شد.',
              icon: 'https://uploadkon.ir/uploads/2b2d28_25logo-soha-w.png',
              lang: 'fa',
              dir: 'rtl',
          });
      }
      setActivePlayerTab('comments');
  };


  const allCategories = ["همه", ...[...new Set(videos.flatMap(v => v.categories))]];
  const filteredVideos = videos.filter(v => {
      const matchesCategory = selectedCategory === 'همه' || v.categories.includes(selectedCategory);
      const matchesSearch = searchQuery.trim() === '' || v.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
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
        // Heuristic to detect browser behavior based on scrollLeft value
        if (currentScroll > 0) { // Firefox-style: scrollLeft is positive, decreases to 0
            atStart = currentScroll >= scrollableWidth - tolerance;
            atEnd = currentScroll <= tolerance;
        } else { // Webkit-style: scrollLeft is negative or 0, decreases to -scrollableWidth
            atStart = normalizedScroll <= tolerance;
            atEnd = normalizedScroll >= scrollableWidth - tolerance;
        }
    } else { // LTR
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
  }, [allCategories, checkScrollability]);

  const handleCategoryScroll = (direction: 'left' | 'start') => {
      const el = categoriesScrollRef.current;
      if (!el) return;
      // scrollBy with `left` property works consistently across browsers for RTL/LTR
      const amount = direction === 'left' ? 300 : -el.scrollWidth;
      el.scrollBy({ left: amount, behavior: 'smooth' });
  };
  
  const renderCategoryBar = () => (
    <div className="flex items-center gap-2 h-10">
      {isSearchActive ? (
        <>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در ویدیوها..."
            autoFocus
            className="w-full h-full bg-gray-100 border border-border-color rounded-full px-4 text-sm focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none animate-fadeIn"
          />
          <button
            onClick={() => {
              setIsSearchActive(false);
              setSearchQuery('');
            }}
            className="text-text-secondary hover:text-text-primary flex-shrink-0 px-2"
          >
            <i className="fas fa-times"></i>
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => handleCategoryScroll('left')}
            aria-label="اسکرول به چپ"
            className={`w-10 h-10 flex-shrink-0 rounded-full bg-card-bg text-text-secondary flex items-center justify-center border border-border-color transition-opacity active:scale-95 hover:bg-gray-200 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <i className="fas fa-chevron-left text-base"></i>
          </button>
          <div
            ref={categoriesScrollRef}
            className="flex-1 flex overflow-x-auto gap-2 no-scrollbar h-full items-center flex-nowrap px-1"
          >
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-4 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-secondary text-white shadow'
                    : 'bg-card-bg text-text-primary hover:bg-gray-200 border border-border-color'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-10 h-10 flex-shrink-0">
            <button
              onClick={() => setIsSearchActive(true)}
              aria-label="جستجو"
              className={`absolute inset-0 w-10 h-10 bg-card-bg text-text-secondary rounded-full flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all duration-300 border border-border-color ${
                isScrolledToStart
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-50 pointer-events-none'
              }`}
            >
              <i className="fas fa-search"></i>
            </button>
            <button
              onClick={() => handleCategoryScroll('start')}
              aria-label="برو به ابتدا"
              className={`absolute inset-0 w-10 h-10 bg-card-bg text-text-secondary rounded-full flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all duration-300 border border-border-color ${
                !isScrolledToStart
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-50 pointer-events-none'
              }`}
            >
              <i className="fas fa-chevron-right text-base"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
  
  const renderVideoGrid = () => (
     <div className={`p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8`}>
     {filteredVideos.length > 0 ? filteredVideos.map(video => (
      <VideoCard key={video.id} video={video} onSelect={() => handleVideoCardSelect(video)} />
    )) : (
       <div className="col-span-full text-center py-20 text-text-secondary">
          <i className="fas fa-video-slash text-4xl mb-4"></i>
          <p>ویدیویی مطابق با فیلتر شما یافت نشد.</p>
      </div>
    )}
  </div>
  );

  if (isPlayerInline && activeVideo) {
      const relatedVideos = allVideos.filter(v => v.id !== activeVideo.id && v.categories.some(cat => activeVideo.categories.includes(cat))).slice(0, 10);
      return (
        <div ref={pageRef}>
            {/* Player Placeholder (Sticky Part 1) */}
            <div className="w-full aspect-video" />

            {/* Details Section (Normal Scroll) */}
            <div className="bg-card-bg text-text-primary">
                <div className="p-3">
                  <h1 className="text-base font-bold leading-tight mb-2 text-text-primary">{activeVideo.title}</h1>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-text-secondary">
                      <span>{toPersianDigits(activeVideo.viewCount)} بازدید</span>
                      <span className="mx-2">•</span>
                      <span>{activeVideo.uploadDate}</span>
                    </div>
                    <div className="flex items-center gap-5 text-lg text-text-secondary">
                      <button className="transition-colors hover:text-primary active:scale-90"><i className="far fa-thumbs-up"></i></button>
                      <button className="transition-colors hover:text-primary active:scale-90"><i className="fas fa-share-alt"></i></button>
                      <button className="transition-colors hover:text-primary active:scale-90"><i className="far fa-bookmark"></i></button>
                    </div>
                  </div>
                </div>
                
                <div className="border-y border-border-color bg-background">
                    <div className="flex items-center justify-around px-2">
                        <button onClick={() => setActivePlayerTab('details')} className={`flex-1 py-3 text-sm font-semibold text-center transition-all duration-200 border-b-2 ${activePlayerTab === 'details' ? 'text-secondary border-secondary' : 'text-text-secondary border-transparent hover:text-text-primary'}`}>توضیحات</button>
                        <button onClick={handleSelectCommentsTab} className={`flex-1 py-3 text-sm font-semibold text-center transition-all duration-200 border-b-2 ${activePlayerTab === 'comments' ? 'text-secondary border-secondary' : 'text-text-secondary border-transparent hover:text-text-primary'}`}>{`نظرات (${toPersianDigits(comments.length)})`}</button>
                        <button onClick={() => setActivePlayerTab('upNext')} className={`flex-1 py-3 text-sm font-semibold text-center transition-all duration-200 border-b-2 ${activePlayerTab === 'upNext' ? 'text-secondary border-secondary' : 'text-text-secondary border-transparent hover:text-text-primary'}`}>ویدیوهای مرتبط</button>
                    </div>
                </div>

                <div className="bg-card-bg">
                    {activePlayerTab === 'details' && (
                        <div className="p-4 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap animate-fadeIn">
                            <div className="relative">
                                <p
                                    ref={descriptionRef}
                                    className={`transition-all duration-300 ease-in-out ${!isDescriptionExpanded ? 'max-h-20 overflow-hidden' : 'max-h-none'}`}
                                >
                                    {activeVideo.description || 'توضیحاتی برای این ویدیو وجود ندارد.'}
                                </p>
                                {!isDescriptionExpanded && isDescriptionOverflowing && (
                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card-bg to-transparent pointer-events-none"></div>
                                )}
                            </div>
                            {isDescriptionOverflowing && (
                                <button
                                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                    className="text-secondary font-semibold mt-2 hover:underline"
                                >
                                    {isDescriptionExpanded ? 'بستن' : 'بیشتر بخوانید'}
                                </button>
                            )}
                        </div>
                    )}
                    {activePlayerTab === 'comments' && (
                        <div className="p-4 space-y-4 animate-fadeIn">
                            <div className="flex items-center gap-2 pb-4 border-b border-border-color">
                                <input value={newCommentText} onChange={e => setNewCommentText(e.target.value)} placeholder="نظر خود را بنویسید..." className="flex-1 bg-background p-2 text-sm rounded-lg border border-border-color focus:ring-1 focus:ring-secondary focus:border-secondary outline-none text-text-primary"/>
                                <button onClick={handleAddCommentSubmit} disabled={!newCommentText.trim()} className="bg-secondary text-white font-semibold rounded-lg px-4 py-2 text-sm disabled:opacity-50 transition-transform active:scale-95 flex-shrink-0">
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                            {comments.length > 0 ? comments.map(c => (
                                <div key={c.id} className="flex items-start gap-3 text-sm">
                                    <div className="w-9 h-9 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-white font-bold mt-0.5">{c.author.charAt(0)}</div>
                                    <div className="text-text-primary flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-semibold">{c.author}</span>
                                            <span className="text-xs text-text-secondary">{c.date}</span>
                                        </div>
                                        <p className="leading-relaxed mt-1 text-text-primary/90">{c.text}</p>
                                    </div>
                                </div>
                            )) : <p className="text-sm text-center py-8 text-text-secondary">اولین نفری باشید که نظر می‌دهد.</p>}
                        </div>
                    )}
                    {activePlayerTab === 'upNext' && (
                        <div className="p-2 space-y-1 animate-fadeIn">
                            {relatedVideos.map(nextVideo => <VideoListItem key={nextVideo.id} video={nextVideo} onClick={() => onVideoSelect(nextVideo)} isActive={false} />)}
                        </div>
                    )}
                </div>
            </div>

            {/* Category Bar (Sticky Part 2) */}
            <div className={`p-4 border-b border-border-color sticky bg-background/95 backdrop-blur-sm z-30`} style={{ top: '56.25vw' }}>
              {renderCategoryBar()}
            </div>
            
            {/* Video List */}
            {renderVideoGrid()}
        </div>
    );
  }

  // Default layout when no video is playing
  const categoryBarStickyTop = isHeaderVisible ? '73px' : '0px';
  return (
    <div className={`min-h-screen bg-background`}>
      <div className={`p-4 border-b border-border-color sticky bg-background/95 backdrop-blur-sm z-30 transition-all duration-300`} style={{ top: categoryBarStickyTop }}>
        {renderCategoryBar()}
      </div>
      {renderVideoGrid()}
    </div>
  );
};

export default VideoListPage;
