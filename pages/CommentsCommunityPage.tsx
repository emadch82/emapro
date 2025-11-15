import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Post, Video, Podcast, Reaction, Episode } from '../types';
import { toPersianDigits, isSameDay, formatDateSeparator, formatTimeFromISO, formatTime } from '../utils/helpers';
import PostInteractionMenu from '../components/PostInteractionMenu';
import VideoCard from '../components/VideoCard';

const EMOJIS = ['👍', '❤️', '😂', '😯', '😢', '🙏'];

const EmbeddedVideoPlayer: React.FC<{ video: Video }> = React.memo(({ video }) => (
    <div className="rounded-lg overflow-hidden aspect-video border border-black/10 shadow-inner">
        <iframe
            key={video.id}
            src={`https://www.aparat.com/video/video/embed/videohash/${video.embedId}/vt/frame?autoplay=false&titleShow=true`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={true}
            className="w-full h-full border-0"
        />
    </div>
));

const EmbeddedAudioPlayer: React.FC<{
    podcast: Podcast;
    episode: Episode;
    onPlay: () => void;
}> = React.memo(({ podcast, episode, onPlay }) => (
    <div onClick={onPlay} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-black/5">
        <div className="relative w-14 h-14 flex-shrink-0">
            <img src={episode.cover || podcast.cover} alt={episode.title} className="w-full h-full rounded-full object-cover shadow" />
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center text-white text-xl">
                <i className="fas fa-play"></i>
            </div>
        </div>
        <div className="flex-1 min-w-0">
            <p className="font-bold text-primary text-sm leading-tight line-clamp-2">{episode.title}</p>
            <p className="text-text-primary text-xs leading-tight mt-1">{podcast.speaker}</p>
        </div>
    </div>
));


const ReactionPalette: React.FC<{ onSelect: (emoji: string) => void }> = ({ onSelect }) => (
  <div className="absolute bottom-full mb-2 bg-white rounded-full shadow-lg flex items-center p-1 gap-1 animate-fadeIn z-20">
    {EMOJIS.map(emoji => (
      <button key={emoji} onClick={() => onSelect(emoji)} className="text-2xl rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-200 transition-transform active:scale-125">
        {emoji}
      </button>
    ))}
  </div>
);

const DateSeparator: React.FC<{ date: string }> = ({ date }) => (
  <div className="text-center my-2 date-separator">
    <span className="bg-black/20 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
      {formatDateSeparator(date)}
    </span>
  </div>
);

const MediaCard: React.FC<{
    video?: Video;
    podcast?: Podcast;
    episode?: Episode | null;
    onPlayVideo: (video: Video) => void;
    onPlayPodcast: (podcast: Podcast, episodeIndex: number) => void;
}> = React.memo(({ video, podcast, episode, onPlayVideo, onPlayPodcast }) => {
    if (!video && !episode) return null;

    const isVideo = !!video;
    const data = isVideo ? 
        { 
            cover: video.thumbnailUrl, 
            title: "عنوان ویدیو",
            subtitle: "عنوان قسمت",
            onClick: (e: React.MouseEvent) => { e.stopPropagation(); onPlayVideo(video); }
        } : 
        { 
            cover: episode!.cover || podcast!.cover, 
            title: "عنوان جلسه", 
            subtitle: "عنوان اپیزود",
            onClick: (e: React.MouseEvent) => { e.stopPropagation(); onPlayPodcast(podcast!, podcast!.episodes.findIndex(e => e.title === episode!.title)); }
        };

    return (
        <div onClick={data.onClick} className="flex items-center gap-3 p-2 my-1.5 bg-black/5 hover:bg-black/10 transition-colors border border-black/5 rounded-full cursor-pointer">
            <img src={data.cover} alt={data.title} className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow" />
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary truncate text-sm leading-tight">{data.title}</p>
                <p className="text-text-secondary truncate text-xs leading-tight mt-1">{data.subtitle}</p>
            </div>
             <div className={`w-9 h-9 rounded-full text-white flex items-center justify-center text-sm flex-shrink-0 ${isVideo ? 'bg-secondary' : 'bg-primary/80'}`}>
                <i className="fas fa-play"></i>
            </div>
        </div>
    );
});


const PostBubble = React.memo<{
  post: Post;
  video?: Video;
  podcast?: Podcast;
  onShowComments: (post: Post) => void;
  onPlayVideo: (video: Video) => void;
  onPlayPodcast: (podcast: Podcast, episodeIndex: number) => void;
  onReact: (postId: number, emoji: string) => void;
  onPin: (postId: number) => void;
  onOpenInteractionMenu: (post: Post) => void;
  activeReactionMenu: number | null;
  setActiveReactionMenu: (id: number | null) => void;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}>(({ post, video, podcast, onShowComments, onPlayVideo, onPlayPodcast, onReact, onPin, onOpenInteractionMenu, activeReactionMenu, setActiveReactionMenu, isFirstInGroup, isLastInGroup }) => {
  const episode = podcast && post.episodeIndex !== undefined ? podcast.episodes[post.episodeIndex] : null;
  const isAdminPost = post.author === 'سُها';

  const longPressTimer = useRef<number | null>(null);
  const touchMoveThreshold = 60;
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  // --- Robust Long-Press Logic ---
  const cancelAndCleanup = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    // The listener is added with { once: true }, so it removes itself after firing.
    // This is just a safeguard in case it's cancelled by other means.
    window.removeEventListener('scroll', cancelAndCleanup);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartPos.current = { x: e.clientX, y: e.clientY };
    window.addEventListener('scroll', cancelAndCleanup, { once: true });

    longPressTimer.current = window.setTimeout(() => {
      onOpenInteractionMenu(post);
      longPressTimer.current = null;
      window.removeEventListener('scroll', cancelAndCleanup);
    }, 500);
  };

  const handlePointerUp = () => {
    cancelAndCleanup();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (longPressTimer.current && touchStartPos.current) {
      const deltaX = Math.abs(e.clientX - touchStartPos.current.x);
      const deltaY = Math.abs(e.clientY - touchStartPos.current.y);
      if (deltaX > touchMoveThreshold || deltaY > touchMoveThreshold) {
        cancelAndCleanup();
      }
    }
  };


  const handleToggleReactionMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveReactionMenu(activeReactionMenu === post.id ? null : post.id);
  };
  
  const handleAddReaction = (emoji: string) => {
      onReact(post.id, emoji);
      setActiveReactionMenu(null);
  }

  const bubbleColor = isAdminPost ? '#D4F3EC' : '#ffffff';
  const conversationButtonClasses = isAdminPost
    ? 'bg-primary/10 text-primary hover:bg-primary/20'
    : 'bg-card-bg/70 text-text-secondary/90 hover:bg-card-bg';

  return (
    <div className={`flex items-end gap-2.5 max-w-xl mx-auto ${isAdminPost ? 'flex-row-reverse' : ''} ${isFirstInGroup ? 'mt-4' : 'mt-0.5'}`}>
       <div className="w-9 flex-shrink-0 self-end">
         {isLastInGroup && (
           <img src={post.authorAvatarUrl} alt={post.author} className="w-9 h-9 rounded-full object-cover shadow-sm" />
         )}
       </div>
       
       <div className={`flex flex-col flex-1 min-w-0 ${isAdminPost ? 'items-end' : 'items-start'}`}>
         <div 
          className={`relative max-w-[85%] w-auto rounded-xl shadow-md bubble ${isLastInGroup ? (isAdminPost ? 'bubble-left bubble-tail' : 'bubble-right bubble-tail') : ''}`}
          style={{ '--bubble-color': bubbleColor } as React.CSSProperties}
         >
          <div 
            className={`relative rounded-xl p-1.5 user-select-none`} 
            style={{ backgroundColor: bubbleColor }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onContextMenu={(e) => e.preventDefault()}
          >
              <div className="pt-1 pb-5">
                {isFirstInGroup && (
                    <div className="flex justify-between items-center mb-1 px-1.5">
                        {isAdminPost ? (
                            <span className="font-bold text-sm text-teal-700">{post.author}</span>
                        ) : (
                            <span></span>
                        )}
                        <div className="relative inline-block">
                             <button onClick={handleToggleReactionMenu} className="text-gray-400 hover:text-gray-700 transition px-1 opacity-50 hover:opacity-100">
                                <i className="far fa-smile"></i>
                            </button>
                            {activeReactionMenu === post.id && <ReactionPalette onSelect={handleAddReaction} />}
                        </div>
                    </div>
                )}
                
                {isAdminPost ? (
                    <>
                        {video && <EmbeddedVideoPlayer video={video} />}
                        {podcast && episode && (
                            <EmbeddedAudioPlayer 
                                podcast={podcast} 
                                episode={episode} 
                                onPlay={() => onPlayPodcast(podcast, podcast.episodes.findIndex(e => e.title === episode.title))} 
                            />
                        )}
                        {post.text && <div className="text-sm leading-relaxed text-text-primary/95 whitespace-pre-wrap break-words pt-1.5 px-1.5">{post.text}</div>}
                    </>
                ) : (
                    <div className="px-1.5">
                        {post.timestamp && episode && (
                            <div className="text-xs italic text-text-secondary/80 bg-black/5 px-2 py-1 rounded-md mb-1.5">
                                در لحظه {formatTime(post.timestamp)} صوت:
                            </div>
                        )}
                        {post.text && <div className={`text-sm leading-relaxed text-text-primary/95 whitespace-pre-wrap break-words ${isFirstInGroup ? 'pt-1' : ''}`}>{post.text}</div>}
                        {(video || (podcast && episode)) && (
                            <MediaCard 
                                video={video} 
                                podcast={podcast} 
                                episode={episode}
                                onPlayVideo={onPlayVideo}
                                onPlayPodcast={onPlayPodcast}
                            />
                        )}
                    </div>
                )}
              </div>
              
              <div className={`absolute bottom-1.5 ${isAdminPost ? 'left-2.5' : 'right-2.5'} flex justify-end items-center text-xs text-text-secondary/80`}>
                  <div className="flex items-center gap-1.5">
                      <span>{formatTimeFromISO(post.isoDate)}</span>
                  </div>
              </div>
          </div>
        </div>

        <div className={`flex items-center gap-2 mt-1.5 ${isAdminPost ? 'flex-row-reverse' : 'flex-row'}`}>
          {isAdminPost && (
            <button onClick={() => onPin(post.id)} className={`text-xs font-semibold backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 shadow-md border border-white/50 active:scale-95 transition-all hover:bg-card-bg ${post.isPinned ? 'text-primary bg-primary/20' : 'text-text-secondary/90 bg-card-bg/70'}`}>
              <i className={`fas fa-thumbtack ${post.isPinned ? '' : '-rotate-45'}`}></i>
            </button>
          )}
          {post.reactions && Object.entries(post.reactions).map(([emoji, count]) => (
            <div key={emoji} className="bg-card-bg/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs flex items-center gap-1 shadow-md border border-white/50">
              <span>{emoji}</span>
              <span className="font-semibold text-text-secondary text-[11px]">{toPersianDigits(String(count))}</span>
            </div>
          ))}
          <button onClick={() => onShowComments(post)} className={`text-xs font-semibold backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 shadow-md border border-white/50 active:scale-95 transition-all ${conversationButtonClasses}`}>
              <i className="far fa-comment-dots text-sm"></i>
              <span className="whitespace-nowrap">{post.comments.length > 0 ? `${toPersianDigits(post.comments.length)} گفتگو` : 'گفتگو'}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

const PinnedPost: React.FC<{ post: Post; video?: Video; podcast?: Podcast; episode?: Episode | null; onPin: (postId: number) => void; onShowComments: (post: Post) => void }> = ({ post, video, podcast, episode, onPin, onShowComments }) => {
    const coverImage = video?.thumbnailUrl || episode?.cover || podcast?.cover || post.authorAvatarUrl;
    return (
        <div className="sticky top-2 z-20 p-2 mb-2 bg-card-bg rounded-lg border border-primary/30 shadow-lg animate-fadeIn flex items-center gap-3">
            <div 
                className="w-12 h-12 rounded-md bg-gray-200 flex-shrink-0 flex items-center justify-center cursor-pointer"
                onClick={() => onShowComments(post)}
            >
                <img src={coverImage} className="w-full h-full object-cover rounded-md" alt="pinned post image"/>
            </div>

            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onShowComments(post)}>
                <p className="font-bold text-sm text-primary">پیام سنجاق شده</p>
                <p className="text-sm text-text-primary/80 line-clamp-1 mt-0.5">{post.text}</p>
            </div>
            
            <button 
                onClick={(e) => { e.stopPropagation(); onPin(post.id); }} 
                className="w-8 h-8 flex-shrink-0 text-lg rounded-full flex items-center justify-center text-text-secondary/70 hover:bg-gray-200 transition-colors active:scale-90"
            >
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
};

interface MahfelPageProps {
  posts: Post[];
  videos: Video[];
  podcasts: Podcast[];
  onPlayVideoFromFeed: (video: Video) => void;
  onPlayPodcastFromFeed: (podcast: Podcast, episodeIndex: number) => void;
  onShowComments: (post: Post) => void;
  onPinPost: (postId: number) => void;
  onDeletePost: (postId: number) => void;
}

const MahfelPage: React.FC<MahfelPageProps> = ({ posts, videos, podcasts, onPlayVideoFromFeed, onPlayPodcastFromFeed, onShowComments, onPinPost, onDeletePost }) => {
  const [localPosts, setLocalPosts] = useState<Post[]>(posts);
  const [activeReactionMenu, setActiveReactionMenu] = useState<number | null>(null);
  const [interactionMenu, setInteractionMenu] = useState<{ post: Post | null; isVisible: boolean }>({ post: null, isVisible: false });


  useEffect(() => {
      setLocalPosts(posts);
  }, [posts]);

  const findVideoForPost = (postId: string | undefined) => videos.find(v => v.id === postId);
  const findPodcastForPost = (podcastId: number | undefined) => podcasts.find(p => p.id === podcastId);
  
  const handleAddReaction = (postId: number, emoji: string) => {
    setLocalPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          const newReactions = { ...(p.reactions || {}) };
          newReactions[emoji] = (newReactions[emoji] || 0) + 1;
          return { ...p, reactions: newReactions };
        }
        return p;
      })
    );
  };
  
  const handleOpenInteractionMenu = (post: Post) => {
    setInteractionMenu({ post, isVisible: true });
  };
  
  const handleCloseInteractionMenu = () => {
    setInteractionMenu({ post: null, isVisible: false });
  };


  const pinnedPostData = useMemo(() => {
    const p = localPosts.find(p => p.isPinned);
    if (!p) return null;
    const video = p.videoId ? findVideoForPost(p.videoId) : undefined;
    const podcast = p.podcastId ? findPodcastForPost(p.podcastId) : undefined;
    const episode = podcast && p.episodeIndex !== undefined ? podcast.episodes[p.episodeIndex] : null;
    return { post: p, video, podcast, episode };
  }, [localPosts, videos, podcasts]);

  const feedItems = useMemo(() => {
    const sorted = localPosts.filter(p => !p.isPinned).sort((a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime());
    const items: ( (Post & {itemType: 'post', isFirst: boolean, isLast: boolean}) | {itemType: 'date', date: string} )[] = [];
    
    let lastDate: Date | null = null;
    for (let i = 0; i < sorted.length; i++) {
        const current = sorted[i];
        const prev = sorted[i - 1];
        const next = sorted[i + 1];
        const currentDate = new Date(current.isoDate);

        if (!lastDate || !isSameDay(currentDate, lastDate)) {
            items.push({ itemType: 'date', date: current.isoDate });
        }
        
        const isFirstInGroup = !prev || prev.author !== current.author || !isSameDay(new Date(prev.isoDate), currentDate);
        const isLastInGroup = !next || next.author !== current.author || !isSameDay(new Date(next.isoDate), currentDate);

        items.push({ ...current, itemType: 'post', isFirst: isFirstInGroup, isLast: isLastInGroup });
        lastDate = currentDate;
    }
    return items;
  }, [localPosts]);


  return (
    <div className="flex flex-col" onClick={() => activeReactionMenu && setActiveReactionMenu(null)}>
        <main className="pb-20 pt-2 px-2 bg-chat-background min-h-screen">
          {pinnedPostData && <PinnedPost {...pinnedPostData} onPin={onPinPost} onShowComments={onShowComments} />}
          {feedItems.map((item, index) => {
            if (item.itemType === 'date') {
              return <DateSeparator key={`${item.date}-${index}`} date={item.date} />;
            }
            
            const post = item;
            const video = post.videoId ? findVideoForPost(post.videoId) : undefined;
            const podcast = post.podcastId ? findPodcastForPost(post.podcastId) : undefined;

            return (
                <PostBubble 
                  key={post.id}
                  post={post}
                  video={video}
                  podcast={podcast}
                  onShowComments={onShowComments}
                  onPlayVideo={onPlayVideoFromFeed}
                  onPlayPodcast={onPlayPodcastFromFeed}
                  onReact={handleAddReaction}
                  onPin={onPinPost}
                  onOpenInteractionMenu={handleOpenInteractionMenu}
                  activeReactionMenu={activeReactionMenu}
                  setActiveReactionMenu={setActiveReactionMenu}
                  isFirstInGroup={post.isFirst}
                  isLastInGroup={post.isLast}
                />
            );
          })}

          {posts.length === 0 && (
             <div className="text-center py-20 text-black/50">
              <i className="fas fa-comments text-4xl mb-4"></i>
              <p>به محفل سُها خوش آمدید!</p>
              <p className="text-sm">هنوز پستی برای نمایش وجود ندارد.</p>
            </div>
          )}
        </main>
        <PostInteractionMenu 
            post={interactionMenu.post}
            isVisible={interactionMenu.isVisible}
            onClose={handleCloseInteractionMenu}
            onDelete={onDeletePost}
            onReply={onShowComments}
        />
    </div>
  );
};

export default MahfelPage;