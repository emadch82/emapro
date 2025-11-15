import React from 'react';
import type { Video } from '../types';

interface InlineVideoPlayerProps {
  video: Video;
  mode: 'inline' | 'minimized' | 'standalone';
  activeTab: 'videos' | string; // To know if we are on the video page
  isHeaderVisible: boolean;
  onMinimize: () => void;
  onExpand: () => void;
  onClose: () => void;
  onExitStandalone: () => void;
}

const InlineVideoPlayer: React.FC<InlineVideoPlayerProps> = ({
  video,
  mode,
  activeTab,
  isHeaderVisible,
  onMinimize,
  onExpand,
  onClose,
  onExitStandalone,
}) => {
  const embedUrl = `https://www.aparat.com/video/video/embed/videohash/${video.embedId}/vt/frame?autoplay=true&powerset=1`;
  const isForVideoPage = activeTab === 'videos';
  const topPosition = isHeaderVisible ? '73px' : '0px';

  const baseClasses = "z-[950] transition-all duration-300 ease-in-out shadow-2xl";

  if (mode === 'standalone') {
    return (
        <div 
            className="fixed inset-0 bg-black/90 z-[950] flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm"
            onClick={onExitStandalone}
        >
            <div 
                className="w-full max-w-5xl aspect-video relative shadow-2xl rounded-lg overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <iframe key={video.id} src={embedUrl} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen={true} className="w-full h-full" frameBorder="0" />
                 <button onClick={onExitStandalone} aria-label="خروج از حالت تمام صفحه" className="absolute top-3 left-3 z-30 bg-black/50 border-none w-9 h-9 rounded-full text-lg text-white cursor-pointer backdrop-blur-md transition-all duration-300 flex items-center justify-center hover:bg-black/70 active:scale-95">
                    <i className="fas fa-chevron-down"></i>
                </button>
            </div>
        </div>
    );
  }
  
  let containerClasses = '';
  let containerStyles: React.CSSProperties = {};
  let iframeWrapperClasses = 'w-full h-full';

  if (mode === 'minimized') {
    containerClasses = `${baseClasses} fixed bottom-20 left-2.5 right-2.5 bg-secondary rounded-lg border border-white/20 backdrop-blur-sm animate-slideInUp flex items-center p-2 gap-3`;
    iframeWrapperClasses = 'w-24 h-14 flex-shrink-0 relative';
  } else { // inline mode
    if (isForVideoPage) {
      containerClasses = `${baseClasses} fixed top-0 left-0 right-0 bg-black aspect-video`;
    } else {
      containerClasses = `${baseClasses} fixed left-0 right-0 bg-black aspect-video border-b border-border-color`;
      containerStyles = { top: topPosition };
    }
  }

  return (
    <div className={containerClasses} style={containerStyles}>
      {mode === 'minimized' ? (
        <>
          <div className={iframeWrapperClasses}>
            <iframe key={video.id} src={embedUrl} title={video.title} allow="autoplay; picture-in-picture" className="w-full h-full rounded-md object-cover" frameBorder="0" />
            <div className="absolute inset-0 bg-transparent cursor-pointer" onClick={onExpand}></div>
          </div>
          <div className="flex-1 min-w-0 cursor-pointer" onClick={onExpand}>
            <p className="text-sm font-semibold text-white truncate">{video.title}</p>
             <p className="text-xs text-white/80 truncate">{video.uploadDate}</p> 
          </div>
          <div className="flex items-center flex-shrink-0 text-white">
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-9 h-9 text-lg flex items-center justify-center hover:bg-white/20 rounded-full transition-colors" aria-label="بستن">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </>
      ) : (
        <div className="w-full h-full relative group">
           <button onClick={onMinimize} aria-label="کوچک کردن پلیر" className="absolute top-2.5 left-2.5 z-30 bg-black/40 border-none w-8 h-8 rounded-full text-lg text-white cursor-pointer backdrop-blur-sm transition-all duration-300 flex items-center justify-center active:bg-black/60">
                <i className="fas fa-chevron-down"></i>
            </button>
            <iframe key={video.id} src={embedUrl} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen={true} className="w-full h-full absolute inset-0 z-10" frameBorder="0" />
            {!isForVideoPage && (
                <div className="absolute bottom-0 left-0 right-0 bg-card-bg p-3 text-center text-sm text-text-secondary cursor-pointer" onClick={onExpand}>
                    برای مشاهده جزئیات کامل، به صفحه ویدیوها بروید.
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default InlineVideoPlayer;