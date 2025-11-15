
import React, { useState } from 'react';
import type { Podcast, Episode, Comment } from '../types';
import { formatTime, toPersianDigits, requestNotificationPermission } from '../utils/helpers';

interface FullScreenPlayerProps {
  track: { podcast: Podcast; episode: Episode; episodeIndex: number };
  isPlaying: boolean;
  progress: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (progress: number) => void;
  onMinimize: () => void;
  onNext: () => void;
  onPrev: () => void;
  comments: Comment[];
  onAddComment: (text: string, track: { podcast: Podcast; episode: Episode; episodeIndex: number }, timestamp?: number) => void;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  onOpenFile: (url: string) => void;
}

const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({
  track,
  isPlaying,
  progress,
  duration,
  onPlayPause,
  onSeek,
  onMinimize,
  onNext,
  onPrev,
  comments,
  onAddComment,
  playbackRate,
  onPlaybackRateChange,
  onOpenFile,
}) => {
  const currentTime = duration * progress;
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchDeltaY, setTouchDeltaY] = useState(0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentTimestamp, setCommentTimestamp] = useState<number | null>(null);
  const [highlightedCommentId, setHighlightedCommentId] = useState<number | null>(null);


  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('textarea') || target.closest('.timeline-container')) {
      return;
    }
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const deltaY = e.targetTouches[0].clientY - touchStartY;
    if (deltaY > 0) {
      setTouchDeltaY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (touchDeltaY > 100) {
      onMinimize();
    }
    setTouchStartY(null);
    setTouchDeltaY(0);
  };

  const handleAddCommentSubmit = () => {
      if (newCommentText.trim()) {
          onAddComment(newCommentText, track, commentTimestamp ?? undefined);
          setNewCommentText('');
          setCommentTimestamp(null);
      }
  };
  
  const handleTimelineClickForComment = (e: React.MouseEvent<HTMLDivElement>) => {
      if (duration > 0) {
        const timeline = e.currentTarget;
        const rect = timeline.getBoundingClientRect();
        
        const isMarkerClick = (e.target as HTMLElement).closest('.comment-marker');
        const isThumb = (e.target as HTMLElement).closest('.timeline-slider');
        if(isMarkerClick || isThumb) return;
        
        const clickPosition = (e.clientX - rect.left) / rect.width;
        const time = clickPosition * duration;

        onSeek(clickPosition);
        setCommentTimestamp(time);
        setIsCommentsOpen(true);
        setNewCommentText('');
      }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = track.episode.audioUrl;
    const safeFilename = `${track.podcast.title} - ${track.episode.title}`.replace(/[/\\?%*:|"<>]/g, '_');
    link.download = `${safeFilename}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const speeds = [1, 1.25, 1.5, 2, 0.75];
  const handleChangeSpeed = () => {
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    onPlaybackRateChange(speeds[nextIndex]);
  };
  
  const handleOpenComments = async () => {
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
    setIsCommentsOpen(true);
  };


  return (
    <div
      className="fixed inset-0 bg-gray-900 z-[1000] flex flex-col text-white animate-[slideInUp_0.3s_ease-out] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${touchDeltaY}px)`,
        transition: touchStartY === null ? 'transform 0.3s ease-out' : 'none',
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${track.podcast.cover})`, filter: 'blur(30px) brightness(0.5)', transform: 'scale(1.2)' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80"></div>

      <div className="relative z-10 flex flex-col h-full p-5">
        <div className="flex justify-between items-center mb-5 flex-shrink-0">
          <button onClick={onMinimize} className="text-xl p-2 rounded-full active:bg-white/10"><i className="fas fa-chevron-down"></i></button>
          <div className="text-center">
            <p className="text-sm opacity-80">درحال پخش از</p>
            <p className="font-semibold line-clamp-1">{track.podcast.title}</p>
          </div>
          <button className="text-xl p-2 rounded-full active:bg-white/10"><i className="fas fa-ellipsis-h"></i></button>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center min-h-0 pt-4">
          <div className="w-64 h-96 rounded-2xl shadow-2xl mb-8 overflow-hidden flex-shrink-0 aspect-[2/3] transform transition-transform duration-300 hover:scale-105">
            <img src={track.podcast.cover} alt={track.episode.title} className="w-full h-full object-cover" />
          </div>
          <div className="text-center w-full px-4">
            <h2 className="text-2xl font-bold mb-2 line-clamp-2">{track.episode.title}</h2>
            <p className="text-lg opacity-80">{track.podcast.speaker}</p>
          </div>
        </div>
        
        <div className="w-full flex flex-col gap-4 flex-shrink-0 mt-auto">
           <div className="flex items-center justify-around text-xl px-2 text-white/70">
                <button className="p-2 active:text-white transition-colors"><i className="fas fa-share-alt"></i></button>
                <button
                    onClick={handleDownload}
                    className="p-2 active:text-white transition-colors"
                    title="دانلود صوت"
                >
                    <i className="fas fa-download"></i>
                </button>
                {track.episode.relatedFileUrl && (
                    <button
                        onClick={() => onOpenFile(track.episode.relatedFileUrl!)}
                        className="p-2 active:text-white transition-colors"
                        title="مشاهده فایل ضمیمه"
                    >
                        <i className="fas fa-book-open"></i>
                    </button>
                )}
                <button onClick={handleOpenComments} className="relative p-2 active:text-white transition-colors">
                  <i className="fas fa-comments"></i>
                  {comments.length > 0 && (
                      <span className="absolute top-1 right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-gray-900">
                          {comments.length}
                      </span>
                  )}
                </button>
                <button className="p-2 active:text-white transition-colors"><i className="far fa-heart"></i></button>
           </div>
          <div dir="ltr" className="timeline-container relative -mb-2">
            <div className="w-full h-5 flex items-center relative group" onClick={handleTimelineClickForComment}>
                <div className="absolute w-full h-1.5 bg-white/30 rounded-full top-1/2 -translate-y-1/2 cursor-pointer"></div>
                <div 
                    className="absolute h-1.5 bg-primary rounded-full top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ width: `${(progress || 0) * 100}%` }}
                ></div>
                
                {duration > 0 && comments.filter(c => c.timestamp).map(comment => (
                    <div
                        key={comment.id}
                        onMouseEnter={() => setHighlightedCommentId(comment.id)}
                        onMouseLeave={() => setHighlightedCommentId(null)}
                        className={`comment-marker absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-primary rounded-full border-2 border-gray-900 shadow-md cursor-pointer transition-transform z-10 flex items-center justify-center text-white text-[10px] font-bold
                        ${highlightedCommentId === comment.id ? 'scale-150' : ''}
                        `}
                        style={{ left: `${(comment.timestamp! / duration) * 100}%` }}
                        title={`"${comment.text}" - ${comment.author}`}
                        onClick={(e) => { e.stopPropagation(); onSeek(comment.timestamp! / duration); }}
                    >
                      {comment.author.charAt(0)}
                    </div>
                ))}
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.001"
                    value={progress || 0}
                    onChange={(e) => onSeek(parseFloat(e.target.value))}
                    className="timeline-slider"
                    aria-label="Seek"
                />
            </div>
            <div className="flex justify-between text-xs opacity-80 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
          </div>
          <div className="flex items-center justify-around w-full max-w-sm mx-auto">
            <button onClick={handleChangeSpeed} className="font-semibold text-white/70 active:text-white transition-colors text-base p-3 w-20 text-center">
              {toPersianDigits(parseFloat(playbackRate.toFixed(2)))}x
            </button>
            <button onClick={onPrev} className="text-white/90 active:text-white transition-colors text-3xl p-3"><i className="fas fa-step-backward"></i></button>
            <button onClick={onPlayPause} className="w-20 h-20 bg-white text-primary rounded-full flex items-center justify-center text-3xl active:scale-95 transition-transform shadow-lg">
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>
            <button onClick={onNext} className="text-white/90 active:text-white transition-colors text-3xl p-3"><i className="fas fa-step-forward"></i></button>
            <button className="text-white/70 active:text-white transition-colors text-xl p-3 w-20"><i className="fas fa-redo"></i></button>
          </div>
        </div>
      </div>
      
      {isCommentsOpen && (
        <div className="absolute inset-0 bg-black/60 z-20" onClick={() => setIsCommentsOpen(false)}>
            <div 
                className="absolute bottom-0 left-0 right-0 h-[70vh] bg-gray-900/80 backdrop-blur-md rounded-t-2xl p-4 flex flex-col animate-[slideInUp_0.3s_ease-out]"
                onClick={e => e.stopPropagation()}
            >
                <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-3 flex-shrink-0"></div>
                <h3 className="text-lg font-bold text-center mb-4 flex-shrink-0">نظرات این قسمت</h3>
                <div className="flex-grow overflow-y-auto space-y-3 pr-2 no-scrollbar">
                    {comments.length > 0 ? comments.map(comment => (
                        <div 
                            key={comment.id}
                            onMouseEnter={() => comment.timestamp && setHighlightedCommentId(comment.id)}
                            onMouseLeave={() => comment.timestamp && setHighlightedCommentId(null)}
                            className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${highlightedCommentId === comment.id ? 'bg-white/10' : ''}`}
                        >
                            <div className="w-9 h-9 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white font-bold mt-1">{comment.author.charAt(0)}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-semibold">{comment.author}</span>
                                    <div className="flex items-center gap-3">
                                        {comment.timestamp && (
                                          <button 
                                            onClick={() => onSeek(comment.timestamp! / duration)}
                                            className="text-xs text-primary font-mono bg-white/10 px-2 py-1 rounded-md transition-colors hover:bg-white/20"
                                          >
                                            {formatTime(comment.timestamp)}
                                          </button>
                                        )}
                                        <span className="text-xs opacity-70">{comment.date}</span>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed">{comment.text}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-10 text-white/60">
                            <i className="fas fa-comment-slash text-3xl mb-3"></i>
                            <p>هنوز نظری برای این قسمت ثبت نشده.</p>
                            <p className="text-sm">شما اولین نفر باشید!</p>
                        </div>
                    )}
                </div>
                <div className="mt-4 pt-4 border-t border-white/20 flex-shrink-0">
                    {commentTimestamp !== null && (
                        <div className="flex justify-between items-center bg-primary/20 text-primary-light text-xs px-3 py-1.5 rounded-t-lg">
                            <span><i className="fas fa-clock mr-2"></i>نظر شما به زمان <span className="font-bold">{formatTime(commentTimestamp)}</span> ضمیمه می‌شود.</span>
                            <button onClick={() => setCommentTimestamp(null)}><i className="fas fa-times"></i></button>
                        </div>
                    )}
                    <div className="flex items-end gap-2">
                        <input
                            value={newCommentText}
                            onChange={e => setNewCommentText(e.target.value)}
                            placeholder="یک نکته کلیدی از این جلسه بنویسید..." 
                            className={`flex-1 bg-white/10 p-3 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-primary/50 transition-all h-12 ${commentTimestamp !== null ? 'rounded-b-lg' : 'rounded-lg'}`}
                        />
                         <button 
                            onClick={() => setCommentTimestamp(currentTime)}
                            className="w-12 h-12 bg-white/10 text-white/80 rounded-lg active:scale-95 transition-transform flex-shrink-0 flex items-center justify-center"
                            title="ضمیمه کردن زمان فعلی"
                        >
                            <i className="fas fa-stopwatch"></i>
                        </button>
                         <button 
                            onClick={handleAddCommentSubmit}
                            className="w-12 h-12 bg-primary text-white font-semibold rounded-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-primary/50 flex-shrink-0 flex items-center justify-center"
                            disabled={!newCommentText.trim()}
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default FullScreenPlayer;
