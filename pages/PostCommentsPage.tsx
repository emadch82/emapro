import React, { useState, useRef, useEffect } from 'react';
import type { Post, Video, Podcast, PostComment } from '../types';
import { toPersianDigits, formatTimeFromISO } from '../utils/helpers';
import VideoCard from '../components/VideoCard';

// Renders the original post at the top of the comments page for context.
const PostHeader: React.FC<{
    post: Post;
    video?: Video;
    podcast?: Podcast;
}> = ({ post, video, podcast }) => {
    const episode = podcast && post.episodeIndex !== undefined ? podcast.episodes[post.episodeIndex] : null;
    const isAdminPost = post.author === 'سُها';
    const bubbleColor = isAdminPost ? '#D4F3EC' : '#ffffff';

    return (
        <div className="p-3 bg-card-bg border-b border-border-color">
            <div className="flex items-start gap-2.5">
                <img src={post.authorAvatarUrl} alt={post.author} className="w-9 h-9 rounded-full object-cover shadow-sm mt-1" />
                <div className="flex-1 min-w-0">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: bubbleColor }}>
                        <span className={`font-bold text-sm mb-1 px-1.5 block ${isAdminPost ? 'text-teal-700' : 'text-primary'}`}>{post.author}</span>
                        {video && (
                           <div className="my-1 mx-0.5 rounded-lg overflow-hidden">
                              <VideoCard video={video} onSelect={() => {}} />
                           </div>
                        )}
                        {podcast && episode && (
                            <div className="flex items-center gap-2 p-1.5 my-1 bg-black/5 border border-black/5 rounded-lg">
                              <img src={episode.cover || podcast.cover} alt={episode.title} className="w-12 h-12 rounded-md object-cover flex-shrink-0 shadow" />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-text-primary truncate text-sm leading-tight">{episode.title}</p>
                                <p className="text-text-secondary truncate text-xs leading-tight mt-1">{podcast.speaker}</p>
                              </div>
                            </div>
                        )}
                        {post.text && <div className="text-sm leading-relaxed text-text-primary/95 whitespace-pre-wrap px-1.5 pt-1 pb-4 break-words">{post.text}</div>}
                        <div className="text-right text-xs text-text-secondary/80 px-1.5">{formatTimeFromISO(post.isoDate)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RepliedMessagePreview: React.FC<{ comment: PostComment }> = ({ comment }) => (
    <div className="bg-black/5 p-2 rounded-md mb-2 border-l-2 border-primary/70">
        <p className="font-bold text-xs text-primary">{comment.author}</p>
        <p className="text-xs text-text-secondary truncate mt-0.5">{comment.text}</p>
    </div>
);

// Renders a single user comment bubble with a white background.
const CommentBubble: React.FC<{ comment: PostComment; allComments: PostComment[]; onReply: (comment: PostComment) => void; }> = ({ comment, allComments, onReply }) => {
    const repliedToComment = comment.replyTo ? allComments.find(c => c.id === comment.replyTo) : null;
    return (
        <div className="flex items-start gap-2.5 my-1.5">
            <img src={comment.authorAvatarUrl || "https://uploadkon.ir/uploads/d35628_25user-avatar.png"} alt={comment.author} className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1" />
            <div className="flex-1 bg-white rounded-lg p-2 max-w-[85%] shadow-sm">
                <div className="flex justify-between items-baseline">
                    <span className="font-bold text-sm text-primary">{comment.author}</span>
                </div>
                {repliedToComment && <RepliedMessagePreview comment={repliedToComment} />}
                <p className="mt-1 text-text-primary/90 whitespace-pre-wrap break-words">{comment.text}</p>
                <div className="flex justify-end items-center mt-2 gap-4">
                    <button onClick={() => onReply(comment)} className="text-xs font-semibold text-text-secondary/80 hover:text-primary">پاسخ</button>
                    <p className="text-xs text-text-secondary/70">{formatTimeFromISO(comment.isoDate)}</p>
                </div>
            </div>
        </div>
    );
};

interface PostCommentsPageProps {
  post: Post;
  video?: Video;
  podcast?: Podcast;
  onBack: () => void;
  onAddComment: (postId: number, text: string, replyTo?: number) => void;
}

const PostCommentsPage: React.FC<PostCommentsPageProps> = ({ post, video, podcast, onBack, onAddComment }) => {
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState<PostComment | null>(null);
    const commentsEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [post.comments]);
    
    useEffect(() => {
        if (replyingTo) {
            inputRef.current?.focus();
        }
    }, [replyingTo]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onAddComment(post.id, commentText, replyingTo?.id);
            setCommentText('');
            setReplyingTo(null);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-background z-[300] flex flex-col animate-slideInFromRight">
            <header className="flex-shrink-0 flex items-center p-2 border-b border-border-color bg-card-bg shadow-sm sticky top-0">
                <button onClick={onBack} className="text-text-secondary text-lg w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200">
                    <i className="fas fa-arrow-right"></i>
                </button>
                <div className="text-center flex-1">
                    <h2 className="font-bold text-base">گفتگو</h2>
                </div>
                <div className="w-10"></div> {/* Spacer */}
            </header>
            
            <main className="flex-grow overflow-y-auto bg-chat-background">
                <PostHeader post={post} video={video} podcast={podcast} />
                <div className="p-2">
                    {post.comments.map(comment => <CommentBubble key={comment.id} comment={comment} allComments={post.comments} onReply={setReplyingTo} />)}
                    <div ref={commentsEndRef} />
                </div>
            </main>

            <footer className="flex-shrink-0 bg-card-bg border-t border-border-color">
                {replyingTo && (
                    <div className="flex items-center justify-between p-2.5 text-sm bg-gray-100 border-b border-border-color">
                        <div className="flex-1 min-w-0 border-l-2 border-primary pl-2">
                            <p className="font-semibold text-primary">پاسخ به {replyingTo.author}</p>
                            <p className="text-xs text-text-secondary truncate">{replyingTo.text}</p>
                        </div>
                        <button onClick={() => setReplyingTo(null)} className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-text-secondary hover:bg-gray-200">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2">
                    <input
                      ref={inputRef}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="گفتگوی خود را بنویسید..."
                      className="flex-1 bg-gray-100 px-4 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 h-10"
                    />
                    <button type="submit" disabled={!commentText.trim()} className="w-10 h-10 flex-shrink-0 rounded-full bg-primary text-white transition-transform active:scale-90 disabled:opacity-50">
                      <i className="fas fa-paper-plane text-base"></i>
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default PostCommentsPage;
