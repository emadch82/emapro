// Fix: Add React and hooks imports
import React, { useState, useEffect, useRef, useCallback } from 'react';
// Fix: Use regular import for types
import { Podcast, Episode, Comment, Video, Page, Post, PostComment, Book, Author } from './types';
import { getPodcasts, getVideos, getComments, getPosts, getBooks, getAuthors, savePodcastsAndVideos, saveComments, savePosts } from './services/api';
import AppHeader from './components/AppHeader';
import BottomTabs from './components/BottomTabs';
import SowtPage from './pages/SowtPage';
import MatnPage from './pages/MatnPage';
import VideoListPage from './pages/VideoListPage';
import MahfelPage from './pages/CommentsCommunityPage';
import PlaylistPage from './pages/PlaylistPage';
import PostCommentsPage from './pages/PostCommentsPage';
import MinimizedPlayer from './components/MinimizedPlayer';
import FullScreenPlayer from './components/FullScreenPlayer';
import AdminPage from './pages/AdminPage';
import PdfViewer from './components/PdfViewer';
import InlineVideoPlayer from './components/InlineVideoPlayer';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import LibraryPage from './pages/LibraryPage';
import InterestsPage from './pages/InterestsPage';
import Toast from './components/Toast';
import DebugNotification from './components/DebugNotification';
import { requestNotificationPermission } from './utils/helpers';
import LoadingPage from './pages/LoadingPage';
import AuthorPage from './pages/AuthorPage';
import BookPage from './pages/BookPage';
import SecretaryPage from './pages/SecretaryPage';

const sampleAvatars = [
    "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    "https://i.pravatar.cc/150?u=a042581f4e29026704f",
    "https://i.pravatar.cc/150?u=a042581f4e29026704a",
    "https://i.pravatar.cc/150?u=a042581f4e29026704b",
];
const getRandomAvatar = () => sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];


const App: React.FC = () => {
    // App Lifecycle State
    const [appState, setAppState] = useState<'initializing' | 'login' | 'interests' | 'ready'>('initializing');

    // Data State
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Navigation State
    const [activeTab, setActiveTab] = useState<Page>('mahfel');
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
    const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);


    // Player State
    const [currentTrack, setCurrentTrack] = useState<{ podcast: Podcast; episode: Episode; episodeIndex: number } | null>(null);
    const [isPlayerVisible, setIsPlayerVisible] = useState(false);
    const [isPlayerFullScreen, setIsPlayerFullScreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    
    // Video Player State
    const [activeVideo, setActiveVideo] = useState<Video | null>(null);
    const [videoPlayerMode, setVideoPlayerMode] = useState<'inline' | 'minimized' | 'standalone'>('inline');
    const [initialVideoToPlay, setInitialVideoToPlay] = useState<Video | null>(null);


    // UI State
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [pdfFileUrl, setPdfFileUrl] = useState<string | null>(null);
    const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
    const [debugNotification, setDebugNotification] = useState<{ id: number; title: string; options: NotificationOptions } | null>(null);
    const lastScrollY = useRef(0);
    
    // User State
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<{phoneNumber: string, interests: string[]} | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);


    // Audio element ref
    const audioRef = useRef<HTMLAudioElement>(null);

    // Hardcoded live stream data
    const liveStream = { isLive: false, title: "جلسه هفتگی هیئت کتاب", url: "#" };
    
    // --- App Initialization and Data Fetching ---
    useEffect(() => {
        const loadApp = async () => {
            try {
                // Fetch all data
                const [podcastsData, booksData, authorsData, videosData, commentsData, postsData] = await Promise.all([
                    getPodcasts(), getBooks(), getAuthors(), getVideos(), getComments(), getPosts(),
                ]);
                setPodcasts(podcastsData);
                setBooks(booksData);
                setAuthors(authorsData);
                setVideos(videosData);
                setComments(commentsData);

                // --- Consolidate all comments into posts for the Mahfel feed ---
                const postsFromComments: Post[] = commentsData.map((comment: Comment): Post => ({
                    id: comment.id + 2000, // Offset to avoid ID collision
                    author: comment.author,
                    authorAvatarUrl: getRandomAvatar(),
                    date: comment.date,
                    isoDate: comment.isoDate,
                    text: comment.text,
                    videoId: comment.videoId,
                    podcastId: comment.podcastId,
                    episodeIndex: comment.episodeIndex,
                    comments: [],
                    likes: 0,
                    timestamp: comment.timestamp, // Keep timestamp for audio comments
                }));

                const allPosts = [...postsData, ...postsFromComments];
                allPosts.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
                setPosts(allPosts);


                // Check authentication status
                const phone = localStorage.getItem('user_phone');
                const interests = localStorage.getItem('user_interests');
                if (phone) {
                    setIsAuthenticated(true);
                    const userInterests = interests ? JSON.parse(interests) : [];
                    setUser({ phoneNumber: phone, interests: userInterests });

                    if (userInterests.length === 0) {
                        setAppState('interests');
                    } else {
                        setAppState('ready');
                    }
                } else {
                    setAppState('login');
                }
            } catch (error) {
                console.error("Failed to load data:", error);
                 // Handle error state, maybe show an error page
            } finally {
                setIsLoading(false);
            }
        };
        loadApp();
    }, []);

    // --- Scroll Handling for Header ---
    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        
        // Always show header at the very top or when scrolling up
        if (currentScrollY < lastScrollY.current || currentScrollY < 80) {
            setIsHeaderVisible(true);
        } else {
            // Scrolling down and past the threshold
            setIsHeaderVisible(false);
        }
        lastScrollY.current = currentScrollY <= 0 ? 0 : currentScrollY;
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // --- Notification Logic ---
    const showNotification = async (title: string, options: NotificationOptions) => {
        try {
            const permissionGranted = await requestNotificationPermission();
            if (permissionGranted) {
                const finalOptions: NotificationOptions = {
                    lang: 'fa',
                    dir: 'rtl',
                    icon: 'https://uploadkon.ir/uploads/2b2d28_25logo-soha-w.png',
                    badge: 'https://uploadkon.ir/uploads/ce6e18_25sohamedia.png',
                    requireInteraction: true,
                    ...options
                };
    
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                        type: 'SHOW_NOTIFICATION',
                        payload: { title, options: finalOptions }
                    });
                } else {
                    new Notification(title, finalOptions);
                }
    
                if (!document.hidden) {
                    setDebugNotification({ id: Date.now(), title, options: finalOptions });
                }
            }
        } catch (error) {
            console.error("Error showing notification:", error);
        }
    };


    // --- Audio Player Logic ---
    const handleNext = useCallback(() => {
        if (!currentTrack) return;
        const { podcast, episodeIndex } = currentTrack;
        const nextEpisodeIndex = episodeIndex + 1;
        if (nextEpisodeIndex < podcast.episodes.length) {
            handlePlayEpisode(podcast, nextEpisodeIndex);
        }
    }, [currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => setDuration(audio.duration);
        const setAudioTime = () => setProgress(audio.currentTime / audio.duration);
        const handleEnded = () => handleNext();

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentTrack, handleNext]);

    const handlePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.error("Error playing audio:", e));
            setIsPlaying(true);
        }
    };
    
    const handlePlayEpisode = (podcast: Podcast, episodeIndex: number) => {
        if (activeVideo) handleCloseVideoPlayer();
        const episode = podcast.episodes[episodeIndex];
        setCurrentTrack({ podcast, episode, episodeIndex });
        setIsPlayerVisible(true);
        setIsPlayerFullScreen(true);
        if (audioRef.current) {
            audioRef.current.src = episode.audioUrl;
            audioRef.current.load();
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Error playing audio:", e));
        }
    };

    const handleSeek = (newProgress: number) => {
        if (audioRef.current && isFinite(duration)) {
            audioRef.current.currentTime = newProgress * duration;
            setProgress(newProgress);
        }
    };

    const handlePrev = () => {
        if (!currentTrack) return;
        const { podcast, episodeIndex } = currentTrack;
        const prevEpisodeIndex = episodeIndex - 1;
        if (prevEpisodeIndex >= 0) {
            handlePlayEpisode(podcast, prevEpisodeIndex);
        }
    };

    const handleClosePlayer = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        setIsPlaying(false);
        setIsPlayerVisible(false);
        setIsPlayerFullScreen(false);
        setCurrentTrack(null);
    };
    
    const handlePlaybackRateChange = (rate: number) => {
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
            setPlaybackRate(rate);
        }
    };

    // --- Video Player Logic ---
    useEffect(() => {
        if (activeVideo && activeTab !== 'videos' && videoPlayerMode === 'inline') {
          setVideoPlayerMode('minimized');
        }
    }, [activeTab, activeVideo, videoPlayerMode]);

    const handleVideoSelect = (video: Video) => {
        if(currentTrack) handleClosePlayer();
        setActiveVideo(video);
        setVideoPlayerMode('inline');
        if (activeTab !== 'videos') {
            setActiveTab('videos');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCloseVideoPlayer = () => {
        setActiveVideo(null);
    };
    
    const handlePlayVideoFromFeed = (video: Video) => {
        setInitialVideoToPlay(video);
        setActiveTab('videos');
    };


    // --- Comments & Posts Logic ---
    const handleShowPostComments = (post: Post) => {
        setSelectedPostForComments(post);
    };

    const handleAddComment = async (text: string, track: { podcast: Podcast; episode: Episode; episodeIndex: number }, timestamp?: number) => {
        try {
            const newComment: Comment = {
                id: Date.now(),
                author: user?.phoneNumber ? 'شما' : 'کاربر مهمان',
                text, date: 'همین الان', 
                isoDate: new Date().toISOString(),
                likes: 0, isFeatured: false, type: 'podcast',
                podcastId: track.podcast.id, episodeIndex: track.episodeIndex, podcastTitle: track.podcast.title, episodeTitle: track.episode.title,
                timestamp
            };
            const updatedComments = [newComment, ...comments];
            setComments(updatedComments);
            await saveComments(updatedComments);

            const newPost: Post = {
                id: newComment.id + 2000,
                author: newComment.author,
                authorAvatarUrl: getRandomAvatar(),
                date: newComment.date,
                isoDate: newComment.isoDate,
                text: newComment.text,
                podcastId: newComment.podcastId,
                episodeIndex: newComment.episodeIndex,
                comments: [],
                likes: 0,
                timestamp: newComment.timestamp,
            };
            const updatedPosts = [newPost, ...posts];
            setPosts(updatedPosts);
            await savePosts(updatedPosts);
            
            await showNotification('نظر جدیدی در محفل ثبت شد!', { body: `"${text}"` });
            setToast({ id: Date.now(), message: 'نظر شما در محفل ثبت شد!' });
        } catch(e) {
            console.error("Failed to add podcast comment and post:", e);
        }
    };

    const handleAddVideoComment = async (text: string, video: Video) => {
        try {
            const newComment: Comment = {
                id: Date.now(),
                author: user?.phoneNumber ? 'شما' : 'کاربر مهمان',
                text, date: 'همین الان', 
                isoDate: new Date().toISOString(),
                likes: 0, isFeatured: false, type: 'video',
                videoId: video.id, videoTitle: video.title,
            };
            const updatedComments = [newComment, ...comments];
            setComments(updatedComments);
            await saveComments(updatedComments);
            
            const newPost: Post = {
                id: newComment.id + 2000,
                author: newComment.author,
                authorAvatarUrl: getRandomAvatar(),
                date: newComment.date,
                isoDate: newComment.isoDate,
                text: newComment.text,
                videoId: newComment.videoId,
                comments: [],
                likes: 0,
            };
            const updatedPosts = [newPost, ...posts];
            setPosts(updatedPosts);
            await savePosts(updatedPosts);
            
            await showNotification('نظر جدیدی در محفل ثبت شد!', { body: `"${text}"` });
            setToast({ id: Date.now(), message: 'نظر شما در محفل ثبت شد!' });
        } catch(e) {
            console.error("Failed to add video comment and post:", e);
        }
    };
    
    const handleAddPostComment = async (postId: number, text: string, replyTo?: number) => {
        try {
            const newPostComment: PostComment = {
                id: Date.now(),
                author: user?.phoneNumber ? 'شما' : 'کاربر مهمان',
                authorAvatarUrl: getRandomAvatar(),
                text,
                date: 'همین الان',
                isoDate: new Date().toISOString(),
                replyTo,
            };
            const updatedPosts = posts.map(p => {
                if (p.id === postId) {
                    return { ...p, comments: [...p.comments, newPostComment] };
                }
                return p;
            });
            setPosts(updatedPosts);
            await savePosts(updatedPosts);

            if (selectedPostForComments && selectedPostForComments.id === postId) {
              const updatedPost = updatedPosts.find(p => p.id === postId);
              if (updatedPost) {
                setSelectedPostForComments(updatedPost);
              }
            }
            
            await showNotification(`پاسخ جدید به ${posts.find(p=>p.id === postId)?.author || 'پست'}`, { body: `"${text}"` });
            setToast({ id: Date.now(), message: 'پاسخ شما با موفقیت ثبت شد!' });
        } catch(e) {
            console.error("Failed to add post comment:", e);
        }
    };
    
    const handlePinPost = async (postId: number) => {
      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          return { ...p, isPinned: !p.isPinned }; // Toggle pin status
        }
        // Unpin any other post that might be pinned
        if (p.isPinned) {
            return { ...p, isPinned: false };
        }
        return p;
      });
      setPosts(updatedPosts);
      await savePosts(updatedPosts);
      setToast({ id: Date.now(), message: updatedPosts.find(p=>p.id===postId)?.isPinned ? 'پست با موفقیت سنجاق شد' : 'پست از حالت سنجاق خارج شد' });
    }

    const handleDeletePost = async (postIdToDelete: number) => {
        try {
            const updatedPosts = posts.filter(p => p.id !== postIdToDelete);
            setPosts(updatedPosts);
            await savePosts(updatedPosts);
            setToast({ id: Date.now(), message: 'پست با موفقیت حذف شد.' });
        } catch(e) {
            console.error("Failed to delete post:", e);
            setToast({ id: Date.now(), message: 'خطا در حذف پست.' });
        }
    };


    // --- Admin Logic ---
    const handleAdminSave = async (data: { podcasts: Podcast[]; videos: Video[] }) => {
        setPodcasts(data.podcasts);
        setVideos(data.videos);
        await savePodcastsAndVideos(data.podcasts, data.videos);
    };
    
    // --- User Logic ---
    const handleLoginSuccess = (phoneNumber: string) => {
        localStorage.setItem('user_phone', phoneNumber);
        setIsAuthenticated(true);
        setUser({ phoneNumber, interests: [] });
        setAppState('interests');
    };

    const handleLogout = () => {
        localStorage.removeItem('user_phone');
        localStorage.removeItem('user_interests');
        setIsAuthenticated(false);
        setUser(null);
        setIsProfileOpen(false);
        setAppState('login');
    };
    
    const handleInterestsSelected = (interests: string[]) => {
        localStorage.setItem('user_interests', JSON.stringify(interests));
        if (user) {
            setUser({ ...user, interests });
        }
        setAppState('ready');
    };

    const handleOpenProfile = () => {
        if(isAuthenticated) {
            setIsProfileOpen(true);
        } else {
            setAppState('login');
        }
    };
    
    // --- New Navigation Handlers ---
    const handleAuthorSelect = useCallback((author: Author) => {
        setSelectedAuthor(author);
    }, []);

    const handleBookSelect = useCallback((book: Book) => {
        setSelectedBook(book);
    }, []);

    const handleBackFromDetailPage = () => {
        setSelectedAuthor(null);
        setSelectedBook(null);
    }


    // --- Rendering Logic ---
    const renderPage = () => {
        switch (activeTab) {
            case 'mahfel':
                return <MahfelPage
                    posts={posts}
                    videos={videos}
                    podcasts={podcasts}
                    onPlayVideoFromFeed={handlePlayVideoFromFeed}
                    onPlayPodcastFromFeed={handlePlayEpisode}
                    onShowComments={handleShowPostComments}
                    onPinPost={handlePinPost}
                    onDeletePost={handleDeletePost}
                />;
            case 'sowt':
                return <SowtPage
                    podcasts={podcasts}
                    authors={authors}
                    liveStream={liveStream}
                    onPodcastSelect={setSelectedPodcast}
                    onPlay={handlePlayEpisode}
                    userInterests={user?.interests || []}
                    isHeaderVisible={isHeaderVisible}
                    onAuthorSelect={handleAuthorSelect}
                />;
            case 'matn':
                return <MatnPage
                    authors={authors}
                    books={books}
                    onBookSelect={handleBookSelect}
                    onAuthorSelect={handleAuthorSelect}
                />;
            case 'videos':
                return <VideoListPage 
                    videos={videos} 
                    initialVideoToPlay={initialVideoToPlay}
                    onVideoPlayed={() => setInitialVideoToPlay(null)}
                    isHeaderVisible={isHeaderVisible}
                    onVideoSelect={handleVideoSelect}
                    activeVideo={activeVideo}
                    isPlayerInline={!!activeVideo && videoPlayerMode === 'inline'}
                    allVideos={videos}
                    comments={comments.filter(c => c.videoId === activeVideo?.id)}
                    onAddComment={handleAddVideoComment}
                    onEnterStandalone={() => setVideoPlayerMode('standalone')}
                />;
            default:
                return null;
        }
    };

    if (appState === 'initializing' || isLoading) {
        return <LoadingPage />;
    }
    if (appState === 'login') {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
    if (appState === 'interests') {
        return <InterestsPage onInterestsSelected={handleInterestsSelected} />;
    }
    
    if (selectedAuthor) {
        if(selectedAuthor.role === 'master') {
            return <AuthorPage 
                        author={selectedAuthor}
                        allBooks={books}
                        allPodcasts={podcasts}
                        onBack={handleBackFromDetailPage}
                        onBookSelect={(book) => { handleBackFromDetailPage(); handleBookSelect(book); }}
                        onPlayEpisode={handlePlayEpisode}
                    />;
        } else {
            return <SecretaryPage
                        secretary={selectedAuthor}
                        allPodcasts={podcasts}
                        onBack={handleBackFromDetailPage}
                        onPodcastSelect={setSelectedPodcast}
                    />;
        }
    }

    if (selectedBook) {
        return <BookPage 
                    book={selectedBook}
                    allPodcasts={podcasts}
                    authors={authors}
                    onBack={handleBackFromDetailPage}
                    onPlayEpisode={handlePlayEpisode}
                    onAuthorSelect={(author) => { handleBackFromDetailPage(); handleAuthorSelect(author); }}
                />;
    }

    if (selectedPodcast) {
        const author = authors.find(a => a.id === selectedPodcast.speakerId);
        return <PlaylistPage
                    podcast={selectedPodcast}
                    author={author}
                    onBack={() => setSelectedPodcast(null)}
                    onPlayEpisode={handlePlayEpisode}
                    onAuthorSelect={(author) => { setSelectedPodcast(null); handleAuthorSelect(author);}}
                />;
    }

    const podcastComments = currentTrack ? comments.filter(c => c.podcastId === currentTrack.podcast.id && c.episodeIndex === currentTrack.episodeIndex) : [];

    return (
        <div className="bg-background text-text-primary font-sans">
            <audio ref={audioRef} />
            {toast && <Toast key={toast.id} message={toast.message} onClose={() => setToast(null)} />}
            {debugNotification && (
                <DebugNotification
                    key={debugNotification.id}
                    title={debugNotification.title}
                    options={debugNotification.options}
                    onClose={() => setDebugNotification(null)}
                />
            )}

            <AppHeader 
                onOpenAdmin={() => setIsAdminOpen(true)}
                onOpenProfile={handleOpenProfile}
                isVisible={isHeaderVisible && !isPlayerFullScreen && !(activeVideo && videoPlayerMode === 'inline')} 
                liveStream={liveStream}
                theme="light"
                isAuthenticated={isAuthenticated}
            />
            
            <div className={`transition-all duration-300 ${isPlayerVisible ? 'pb-20' : 'pb-16'}`}>
              {renderPage()}
            </div>
            
            <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {selectedPostForComments && (
                <PostCommentsPage
                    post={selectedPostForComments}
                    video={selectedPostForComments.videoId ? videos.find(v => v.id === selectedPostForComments.videoId) : undefined}
                    podcast={selectedPostForComments.podcastId ? podcasts.find(p => p.id === selectedPostForComments.podcastId) : undefined}
                    onBack={() => setSelectedPostForComments(null)}
                    onAddComment={handleAddPostComment}
                />
            )}
            
            {currentTrack && isPlayerVisible && !isPlayerFullScreen && (
                <MinimizedPlayer
                    track={currentTrack}
                    isPlaying={isPlaying}
                    progress={progress}
                    onPlayPause={handlePlayPause}
                    onExpand={() => setIsPlayerFullScreen(true)}
                    onClose={handleClosePlayer}
                    onSelectPodcast={() => setSelectedPodcast(currentTrack.podcast)}
                    isVisible={isPlayerVisible && !isPlayerFullScreen}
                />
            )}

            {currentTrack && isPlayerFullScreen && (
                <FullScreenPlayer
                    track={currentTrack}
                    isPlaying={isPlaying}
                    progress={progress}
                    duration={duration}
                    onPlayPause={handlePlayPause}
                    onSeek={handleSeek}
                    onMinimize={() => setIsPlayerFullScreen(false)}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    comments={podcastComments}
                    onAddComment={handleAddComment}
                    playbackRate={playbackRate}
                    onPlaybackRateChange={handlePlaybackRateChange}
                    onOpenFile={setPdfFileUrl}
                />
            )}
            
            {activeVideo && (
                <InlineVideoPlayer
                    video={activeVideo}
                    mode={videoPlayerMode}
                    activeTab={activeTab}
                    isHeaderVisible={isHeaderVisible && !isPlayerFullScreen && !(activeVideo && videoPlayerMode === 'inline')}
                    onMinimize={() => setVideoPlayerMode('minimized')}
                    onExpand={() => { setVideoPlayerMode('inline'); if(activeTab !== 'videos') setActiveTab('videos'); }}
                    onClose={handleCloseVideoPlayer}
                    onExitStandalone={() => setVideoPlayerMode('inline')}
                />
            )}

            {isAdminOpen && (
                <AdminPage
                    onClose={() => setIsAdminOpen(false)}
                    currentPodcasts={podcasts}
                    currentVideos={videos}
                    onSave={handleAdminSave}
                />
            )}

            {pdfFileUrl && (
                <PdfViewer fileUrl={pdfFileUrl} onClose={() => setPdfFileUrl(null)} />
            )}
            
            {isProfileOpen && user && (
                <UserProfilePage 
                    user={user} 
                    onClose={() => setIsProfileOpen(false)} 
                    onLogout={handleLogout}
                    onNavigateToFavorites={() => { setIsProfileOpen(false); setIsFavoritesOpen(true); }}
                    onNavigateToLibrary={() => { setIsProfileOpen(false); setIsLibraryOpen(true); }}
                />
            )}
            
            {isFavoritesOpen && <FavoritesPage onClose={() => setIsFavoritesOpen(false)} />}
            {isLibraryOpen && <LibraryPage onClose={() => setIsLibraryOpen(false)} />}

        </div>
    );
};

export default App;