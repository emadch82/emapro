import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Podcast, Episode, Video } from '../types';
import { formatPersianDateForInput, parsePersianDateInput, toPersianDigits } from '../utils/helpers';
import { fetchAparatVideoDetails, extractAparatId } from '../utils/aparatApi';

interface AdminPageProps {
  onClose: () => void;
  currentPodcasts: Podcast[];
  currentVideos: Video[];
  onSave: (data: { podcasts: Podcast[], videos: Video[] }) => void;
}

const contentCategories = [
    "گفتمان پیشرفت",
    "مدرسه سیاست",
    "قصه مقاومت",
    "دیدار آوینی",
    "فلسفه و تفکر",
    "تعلیم و تربیت",
    "روضه سها",
    "هیئت کتاب",
    "پادکست"
];


const AdminPage: React.FC<AdminPageProps> = ({ onClose, currentPodcasts, currentVideos, onSave }) => {
    const [activeTab, setActiveTab] = useState<'podcasts' | 'videos'>('podcasts');
    const modalRef = useRef<HTMLDivElement>(null);
    
    // --- State for tracking changes ---
    const [initialPodcastsJSON] = useState(() => JSON.stringify(currentPodcasts));
    const [initialVideosJSON] = useState(() => JSON.stringify(currentVideos));

    // --- Session State for UI Re-renders ---
    const [localPodcasts, setLocalPodcasts] = useState(() => JSON.parse(initialPodcastsJSON));
    const [localVideos, setLocalVideos] = useState(() => JSON.parse(initialVideosJSON));
    
    // --- UI Control State ---
    const [editingPodcastId, setEditingPodcastId] = useState<number | null>(null);
    const [editingEpisodeIndex, setEditingEpisodeIndex] = useState<number | 'new' | null>(null);
    const [persianDateInput, setPersianDateInput] = useState('');
    const [editingVideoId, setEditingVideoId] = useState<string | 'new' | null>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [exportedData, setExportedData] = useState<string>('');


    // --- Eitaa Integration State ---
    const [eitaaToken, setEitaaToken] = useState(() => localStorage.getItem('eitaaToken') || '');
    const [eitaaPin, setEitaaPin] = useState(() => localStorage.getItem('eitaaPin') || '');
    const [eitaaChannelId, setEitaaChannelId] = useState(() => localStorage.getItem('eitaaChannelId') || '');
    
    // --- Effect for saving Eitaa settings ---
    useEffect(() => { localStorage.setItem('eitaaToken', eitaaToken); }, [eitaaToken]);
    useEffect(() => { localStorage.setItem('eitaaPin', eitaaPin); }, [eitaaPin]);
    useEffect(() => { localStorage.setItem('eitaaChannelId', eitaaChannelId); }, [eitaaChannelId]);

    const hasChanges = useCallback(() => {
        return JSON.stringify(localPodcasts) !== initialPodcastsJSON ||
               JSON.stringify(localVideos) !== initialVideosJSON;
    }, [localPodcasts, localVideos, initialPodcastsJSON, initialVideosJSON]);

    const handleSaveChangesAndClose = () => {
        onSave({ podcasts: localPodcasts, videos: localVideos });
        onClose();
    };

    const handleDiscardAndClose = useCallback(() => {
        if (hasChanges()) {
            if (window.confirm('شما تغییرات ذخیره‌نشده‌ای دارید. آیا مطمئن هستید که می‌خواهید بدون ذخیره کردن خارج شوید؟')) {
                onClose();
            }
        } else {
            onClose();
        }
    }, [hasChanges, onClose]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                handleDiscardAndClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleDiscardAndClose]);


    // --- Generic Change Handlers that modify local state directly ---
    const handlePodcastFieldChange = (podcastId: number, field: keyof Podcast, value: any) => {
        setLocalPodcasts(prev => prev.map(p => p.id === podcastId ? { ...p, [field]: value } : p));
    };

    const handleEpisodeFieldChange = (podcastId: number, episodeIndex: number, field: keyof Episode, value: any) => {
        setLocalPodcasts(prev => prev.map(p => {
            if (p.id === podcastId) {
                const updatedEpisodes = p.episodes.map((ep, idx) => 
                    idx === episodeIndex ? { ...ep, [field]: value } : ep
                );
                return { ...p, episodes: updatedEpisodes };
            }
            return p;
        }));
    };
    
    const handleVideoFieldChange = (videoId: string, field: keyof Video, value: any) => {
        setLocalVideos(prev => prev.map(v => v.id === videoId ? { ...v, [field]: value } : v));
    }


    // --- Podcast Functions ---
    const handleAddNewPodcast = () => {
        const newPodcast: Podcast = {
            // Fix: Changed speaker property to speakerId and set a default value.
            id: Date.now(), title: 'پادکست جدید', description: '', cover: '', speakerId: 1, year: new Date().getFullYear() - 621,
            categories: [], episodes: [], duration: '00:00:00', isSquare: false
        };
        setLocalPodcasts(prev => [newPodcast, ...prev]);
        setEditingPodcastId(newPodcast.id);
    };

    const handleDeletePodcast = (podcastId: number) => {
        if (window.confirm('آیا از حذف این پادکست و تمام اپیزودهای آن اطمینان دارید؟')) {
            setLocalPodcasts(prev => prev.filter(p => p.id !== podcastId));
        }
    };
    
    // -- Episode Functions --
    const handleAddNewEpisode = () => {
        // Fix: Add missing 'viewCount' property to satisfy the Episode interface.
        const newEpisode: Episode = {
            title: '', description: '', duration: '00:00:00', audioUrl: '',
            date: new Date().toISOString().split('T')[0], isNew: true, viewCount: 0
        };
        setLocalPodcasts(prev => prev.map(p => {
            if (p.id === editingPodcastId) {
                return { ...p, episodes: [...p.episodes, newEpisode] };
            }
            return p;
        }));
        const newIndex = localPodcasts.find(p => p.id === editingPodcastId)?.episodes.length || 0;
        setEditingEpisodeIndex(newIndex);
        setPersianDateInput(formatPersianDateForInput(newEpisode.date));
    };
    
    const handleEditEpisode = (index: number) => {
        const podcast = localPodcasts.find(p => p.id === editingPodcastId);
        if(podcast) {
            setPersianDateInput(formatPersianDateForInput(podcast.episodes[index].date));
            setEditingEpisodeIndex(index);
        }
    };

    const handleDeleteEpisode = (index: number) => {
        if (window.confirm('آیا از حذف این اپیزود اطمینان دارید؟')) {
             setLocalPodcasts(prev => prev.map(p => {
                if (p.id === editingPodcastId) {
                    return { ...p, episodes: p.episodes.filter((_, i) => i !== index) };
                }
                return p;
            }));
        }
    };
    
    const handleEpisodeDateChange = (podcastId: number, episodeIndex: number, persianDate: string) => {
        setPersianDateInput(persianDate);
        const gregorianDate = parsePersianDateInput(persianDate);
        if (gregorianDate) {
            handleEpisodeFieldChange(podcastId, episodeIndex, 'date', gregorianDate);
        }
    };
    
    // --- Video Functions ---
    const handleAddNewVideo = () => {
        const newVideo: Video = {
            id: 'new', embedId: '', title: '', description: '', thumbnailUrl: '',
            viewCount: 0, uploadDate: '', duration: 0, categories: []
        };
        setLocalVideos(prev => [newVideo, ...prev]);
        setEditingVideoId('new');
        setVideoUrl('');
        setFetchError(null);
    };

    const handleEditVideo = (video: Video) => {
        setEditingVideoId(video.id);
        setVideoUrl(`https://www.aparat.com/v/${video.id}`);
        setFetchError(null);
    };
    
    const handleDeleteVideo = (videoIdToDelete: string) => {
        if (window.confirm('آیا از حذف این ویدیو اطمینان دارید؟')) {
            setLocalVideos(prev => prev.filter(v => v.id !== videoIdToDelete));
        }
    };

    const handleFetchVideoDetails = async () => {
        const videoIdToUpdate = editingVideoId;
        if (!videoIdToUpdate) return;

        setFetchError(null);
        const extractedId = extractAparatId(videoUrl);
        if (!extractedId) {
            setFetchError("لینک یا شناسه ویدیو نامعتبر است.");
            return;
        }

        setIsFetching(true);
        try {
            const { details } = await fetchAparatVideoDetails(extractedId);
            setLocalVideos(prev => prev.map(v => {
                if (v.id === videoIdToUpdate) {
                    return {
                        ...v,
                        id: details.uid,
                        embedId: details.uid,
                        title: details.title,
                        description: details.description,
                        thumbnailUrl: details.big_poster,
                        viewCount: details.visit_cnt,
                        uploadDate: details.sdate,
                        duration: details.duration,
                    };
                }
                return v;
            }));
            if (videoIdToUpdate === 'new') {
                setEditingVideoId(details.uid);
            }
        } catch (error) {
            setFetchError(error instanceof Error ? error.message : "خطای ناشناخته در دریافت اطلاعات.");
        } finally {
            setIsFetching(false);
        }
    };
    
     const handleVideoCategoryChange = (videoId: string, category: string) => {
        const video = localVideos.find(v => v.id === videoId);
        if (!video) return;

        const currentCategories = video.categories || [];
        const newCategories = currentCategories.includes(category)
            ? currentCategories.filter(c => c !== category)
            : [...currentCategories, category];
        handleVideoFieldChange(videoId, 'categories', newCategories);
    };
    
    const handleCloseVideoForm = () => {
        setLocalVideos(prev => prev.filter(v => v.id !== 'new'));
        setEditingVideoId(null);
    };

    // --- Common Components ---
    const TabButton: React.FC<{ tab: 'podcasts' | 'videos'; label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-sm font-semibold transition-colors ${activeTab === tab ? (tab === 'videos' ? 'text-secondary border-b-2 border-secondary' : 'text-primary border-b-2 border-primary') : 'text-text-secondary hover:text-text-primary'}`}
        >
            {label}
        </button>
    );

    const FormField: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
      </div>
    );
    
    const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
      <input {...props} className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm" />
    );
    const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
      <textarea {...props} className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm" />
    );

    // --- Render Functions ---

    const renderEpisodeForm = (podcast: Podcast) => {
        if (editingEpisodeIndex === null) return null;

        const episode = editingEpisodeIndex === 'new' 
            ? { title: '', description: '', duration: '00:00:00', audioUrl: '', date: new Date().toISOString().split('T')[0], isNew: true }
            : podcast.episodes[editingEpisodeIndex];
        
        const episodeIndex = editingEpisodeIndex === 'new' ? podcast.episodes.length - 1 : editingEpisodeIndex;
        if (!episode) return null;

        return (
            <div className="bg-gray-100 p-3 rounded-lg border space-y-3 mb-4 animate-fadeIn">
                <h4 className="font-bold text-sm">{editingEpisodeIndex === 'new' || podcast.episodes[episodeIndex].title === '' ? 'اپیزود جدید' : `ویرایش: ${podcast.episodes[episodeIndex].title}`}</h4>
                <FormField label="عنوان اپیزود"><TextInput value={episode.title || ''} onChange={e => handleEpisodeFieldChange(podcast.id, episodeIndex, 'title', e.target.value)} /></FormField>
                <FormField label="توضیحات اپیزود"><TextArea value={episode.description || ''} onChange={e => handleEpisodeFieldChange(podcast.id, episodeIndex, 'description', e.target.value)} rows={2} /></FormField>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <FormField label="تاریخ انتشار (شمسی)">
                        <TextInput id="episodeDate" placeholder="مثال: 1403/05/22" value={persianDateInput} onChange={e => handleEpisodeDateChange(podcast.id, episodeIndex, e.target.value)}/>
                    </FormField>
                    <FormField label="مدت زمان"><TextInput value={episode.duration || ''} onChange={e => handleEpisodeFieldChange(podcast.id, episodeIndex, 'duration', e.target.value)} /></FormField>
                </div>
                <FormField label="لینک فایل صوتی"><TextInput value={episode.audioUrl || ''} onChange={e => handleEpisodeFieldChange(podcast.id, episodeIndex, 'audioUrl', e.target.value)} /></FormField>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="isNew" checked={episode.isNew || false} onChange={e => handleEpisodeFieldChange(podcast.id, episodeIndex, 'isNew', e.target.checked)} className="rounded text-primary focus:ring-primary/50" />
                    <label htmlFor="isNew" className="text-sm font-medium text-gray-700">علامت‌گذاری به عنوان جدید</label>
                </div>
                <div className="flex gap-2 justify-end items-center mt-4">
                    <button onClick={() => setEditingEpisodeIndex(null)} className="bg-gray-200 text-gray-700 text-xs font-semibold py-1.5 px-4 rounded-full hover:bg-gray-300 transition-colors">لغو</button>
                    <button onClick={() => setEditingEpisodeIndex(null)} className="bg-primary text-white font-bold py-2 px-5 rounded-lg shadow-md hover:bg-primary-dark transition-colors text-sm">تایید</button>
                </div>
            </div>
        );
    };

    const renderPodcastForm = () => {
        const podcast = localPodcasts.find(p => p.id === editingPodcastId);
        if (!podcast) return null;

        return (
             <div className="animate-fadeIn">
                <button onClick={() => setEditingPodcastId(null)} className="mb-4 text-sm text-primary hover:underline">&larr; بازگشت به لیست پادکست‌ها</button>
                <fieldset className="bg-white p-4 rounded-lg border border-border-color shadow-sm mb-6">
                    <legend className="font-bold text-base mb-2 px-2">{currentPodcasts.some(p=>p.id === podcast.id) ? `ویرایش: ${podcast.title}` : 'افزودن پادکست جدید'}</legend>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField label="عنوان پادکست"><TextInput value={podcast.title || ''} onChange={e => handlePodcastFieldChange(podcast.id, 'title', e.target.value)} /></FormField>
                             {/* Fix: Changed input to edit speakerId (number) instead of speaker (string). */}
                             <FormField label="شناسه سخنران"><TextInput type="number" value={podcast.speakerId || ''} onChange={e => handlePodcastFieldChange(podcast.id, 'speakerId', parseInt(e.target.value) || 1)}/></FormField>
                        </div>
                         <FormField label="لینک کاور"><TextInput value={podcast.cover || ''} onChange={e => handlePodcastFieldChange(podcast.id, 'cover', e.target.value)} /></FormField>
                         <FormField label="توضیحات"><TextArea value={podcast.description || ''} onChange={e => handlePodcastFieldChange(podcast.id, 'description', e.target.value)} rows={3} /></FormField>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <FormField label="سال انتشار"><TextInput type="number" value={podcast.year || ''} onChange={e => handlePodcastFieldChange(podcast.id, 'year', parseInt(e.target.value))} /></FormField>
                            <div className="flex items-center gap-2 pt-6">
                                <input type="checkbox" id="isSquare" checked={podcast.isSquare || false} onChange={e => handlePodcastFieldChange(podcast.id, 'isSquare', e.target.checked)} className="rounded text-primary focus:ring-primary/50" />
                                <label htmlFor="isSquare" className="text-sm font-medium text-gray-700">کاور مربعی</label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی‌ها</label>
                            <div className="flex flex-wrap gap-2">
                                {contentCategories.map(cat => (
                                    <button key={cat} onClick={() => {
                                        const currentCategories = podcast.categories || [];
                                        const newCategories = currentCategories.includes(cat) ? currentCategories.filter(c => c !== cat) : [...currentCategories, cat];
                                        handlePodcastFieldChange(podcast.id, 'categories', newCategories);
                                    }}
                                        className={`text-xs font-semibold py-1 px-3 rounded-full transition-colors ${podcast.categories.includes(cat) ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset className="bg-gray-50 p-4 rounded-lg border border-border-color shadow-sm">
                    <legend className="font-bold text-base mb-2 px-2 text-primary border-b-2 border-primary/50 pb-1">مدیریت اپیزودها ({toPersianDigits(podcast.episodes.length)})</legend>
                    {renderEpisodeForm(podcast)}
                    {podcast.episodes.length > 0 && editingEpisodeIndex === null && (
                        <div className="space-y-2">
                            {podcast.episodes.map((ep, index) => (
                                <div key={index} className="bg-white p-3 rounded-lg flex justify-between items-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-400 font-mono text-sm w-6 text-center">{toPersianDigits(index + 1)}</span>
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">{ep.title}</p>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <span><i className="far fa-calendar-alt mr-1"></i> {formatPersianDateForInput(ep.date)}</span>
                                                <span><i className="far fa-clock mr-1"></i> {ep.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => handleEditEpisode(index)} className="text-sm text-blue-600 hover:underline font-semibold">ویرایش</button>
                                        <button onClick={() => handleDeleteEpisode(index)} className="text-sm text-red-600 hover:underline font-semibold">حذف</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {editingEpisodeIndex === null && (
                         <button onClick={handleAddNewEpisode} className="mt-4 bg-primary/10 text-primary text-sm font-semibold py-1.5 px-4 rounded-full hover:bg-primary/20 transition-all active:scale-95">
                           <i className="fas fa-plus mr-2"></i> افزودن اپیزود جدید
                         </button>
                    )}
                </fieldset>
                
                <div className="mt-6 flex justify-end">
                    <button onClick={() => setEditingPodcastId(null)} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-gray-800 transition-colors">
                        تایید و بازگشت به لیست
                    </button>
                </div>
            </div>
        );
    };

    const renderPodcastPanel = () => {
        if (editingPodcastId !== null) {
            return renderPodcastForm();
        }
        return (
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">لیست پادکست‌ها ({toPersianDigits(localPodcasts.length)})</h3>
                    <button onClick={handleAddNewPodcast} className="bg-primary text-white text-xs font-semibold py-1.5 px-4 rounded-full hover:bg-primary-dark transition-colors shadow-sm">
                        <i className="fas fa-plus mr-1"></i> پادکست جدید
                    </button>
                </div>
                <div className="space-y-2">
                    {localPodcasts.map((p: Podcast) => (
                        <div key={p.id} className="bg-card-bg p-3 rounded-lg flex justify-between items-center border border-border-color shadow-sm">
                            <div className="flex items-center gap-3">
                                <img src={p.cover} alt={p.title} className="w-12 h-12 rounded-md object-cover"/>
                                <div>
                                    <p className="font-bold">{p.title}</p>
                                    {/* Fix: Display speakerId as speaker name is not available here. */}
                                    <p className="text-sm text-text-secondary">شناسه سخنران: {p.speakerId} - {toPersianDigits(p.episodes.length)} اپیزود</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setEditingPodcastId(p.id)} className="text-sm text-blue-600 hover:underline font-semibold">ویرایش</button>
                                <button onClick={() => handleDeletePodcast(p.id)} className="text-sm text-red-600 hover:underline font-semibold">حذف</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderVideoForm = () => {
        const video = localVideos.find(v => v.id === editingVideoId);
        if (!video) return null;

        return (
            <fieldset className="bg-white p-4 rounded-lg border border-border-color shadow-sm animate-fadeIn" style={{backgroundColor: 'white'}}>
                <legend className="font-bold text-base mb-2 px-2" style={{color: '#2e86c1'}}>{currentVideos.some(v => v.id === video.id) ? `ویرایش: ${video.title}` : 'افزودن ویدیو جدید'}</legend>
                <div className="space-y-4">
                    <FormField label="لینک یا شناسه ویدیو از آپارات">
                        <div className="flex gap-2">
                            <TextInput value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://www.aparat.com/v/xxxxx" />
                            <button onClick={handleFetchVideoDetails} disabled={isFetching} className="bg-secondary text-white font-semibold px-4 py-2 rounded-md whitespace-nowrap active:scale-95 transition-transform disabled:opacity-50">
                                {isFetching ? <i className="fas fa-spinner fa-spin"></i> : 'دریافت اطلاعات'}
                            </button>
                        </div>
                        {fetchError && <p className="text-red-500 text-xs mt-1">{fetchError}</p>}
                    </FormField>
                    {(video.embedId || video.title) && ( // Show fields if there's any data
                        <div className="space-y-4 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <FormField label="عنوان ویدیو"><TextInput value={video.title || ''} onChange={e => handleVideoFieldChange(video.id, 'title', e.target.value)} /></FormField>
                               <FormField label="لینک کاور"><TextInput value={video.thumbnailUrl || ''} onChange={e => handleVideoFieldChange(video.id, 'thumbnailUrl', e.target.value)} /></FormField>
                           </div>
                           <FormField label="توضیحات"><TextArea value={video.description || ''} onChange={e => handleVideoFieldChange(video.id, 'description', e.target.value)} rows={3} /></FormField>
                            <div>
                               <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی‌ها</label>
                               <div className="flex flex-wrap gap-2">
                                   {contentCategories.map(cat => (
                                       <button key={cat} onClick={() => handleVideoCategoryChange(video.id, cat)}
                                           className={`text-xs font-semibold py-1 px-3 rounded-full transition-colors ${(video.categories || []).includes(cat) ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                           {cat}
                                       </button>
                                   ))}
                               </div>
                           </div>
                            <div className="flex justify-end gap-2">
                                <button onClick={handleCloseVideoForm} className="bg-secondary text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors">تایید و بازگشت به لیست</button>
                            </div>
                        </div>
                    )}
                </div>
            </fieldset>
        );
    }

    const renderVideoPanel = () => (
         <div className="space-y-6">
            {editingVideoId !== null ? renderVideoForm() : (
                 <div>
                    <div className="flex justify-between items-center mb-3">
                         <h3 className="font-bold text-lg">لیست ویدیوها ({toPersianDigits(localVideos.length)})</h3>
                         <button onClick={handleAddNewVideo} className="bg-secondary text-white text-xs font-semibold py-1.5 px-4 rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                            <i className="fas fa-plus mr-1"></i> ویدیوی جدید
                        </button>
                    </div>
                     <div className="space-y-2">
                        {localVideos.map((v: Video) => (
                            <div key={v.id} className="bg-card-bg p-3 rounded-lg flex justify-between items-center border border-border-color shadow-sm">
                                <div className="flex items-center gap-3">
                                    <img src={v.thumbnailUrl} alt={v.title} className="w-20 h-12 rounded-md object-cover"/>
                                    <div>
                                        <p className="font-bold text-sm">{v.title}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => handleEditVideo(v)} className="text-sm text-blue-600 hover:underline font-semibold">ویرایش</button>
                                    <button onClick={() => handleDeleteVideo(v.id)} className="text-sm text-red-600 hover:underline font-semibold">حذف</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );


    return (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div ref={modalRef} className="bg-background rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-3 border-b border-border-color flex-shrink-0">
                    <h2 className="font-bold text-lg">پنل مدیریت محتوا</h2>
                    <button onClick={handleDiscardAndClose} className="text-text-secondary text-xl w-8 h-8 rounded-full hover:bg-gray-200 active:bg-gray-300">&times;</button>
                </header>
                <div className="border-b border-border-color flex-shrink-0">
                    <TabButton tab="podcasts" label="مدیریت پادکست‌ها" />
                    <TabButton tab="videos" label="مدیریت ویدیوها" />
                </div>
                <main className="flex-grow p-4 overflow-y-auto" style={{backgroundColor: '#f8f9fa'}}>
                    <fieldset className="bg-white p-4 rounded-lg border border-border-color shadow-sm mb-6">
                        <legend className="font-bold text-base mb-2 px-2 text-green-700">مدیریت داده‌ها (مهم)</legend>
                        <div className="space-y-3">
                            <p className="text-xs text-gray-600 leading-relaxed">
                                برای اینکه تغییرات شما برای همیشه در کد ذخیره شود و با رفرش از بین نرود، لطفاً مراحل زیر را دنبال کنید:
                                <br/>
                                ۱. تمام تغییرات مورد نظر خود را در پنل اعمال کرده و روی دکمه <strong>"ذخیره و بستن"</strong> کلیک کنید.
                                <br/>
                                ۲. دوباره پنل مدیریت را باز کنید و روی دکمه زیر کلیک کنید.
                                <br/>
                                ۳. تمام متنی که در کادر ظاهر می‌شود را کپی کرده و برای من در چت ارسال کنید.
                            </p>
                            <button
                                onClick={() => setExportedData(JSON.stringify({ podcasts: localPodcasts, videos: localVideos }, null, 2))}
                                className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                خروجی گرفتن از داده‌های فعلی
                            </button>
                            {exportedData && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">داده‌های شما برای ذخیره‌سازی دائمی:</label>
                                    <textarea
                                        readOnly
                                        value={exportedData}
                                        className="w-full h-48 bg-gray-100 p-2 border border-gray-300 rounded-md font-mono text-xs"
                                        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                                    />
                                </div>
                            )}
                        </div>
                    </fieldset>

                    <fieldset className="bg-white p-4 rounded-lg border border-border-color shadow-sm mb-6">
                        <legend className="font-bold text-base mb-2 px-2 text-gray-600">تنظیمات انتشار در ایتا</legend>
                        <div className="space-y-3">
                            <p className="text-xs text-gray-500">برای انتشار خودکار در ایتا، اطلاعات زیر را از <a href="https://eitaayar.ir" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">سایت ایتایار</a> دریافت و وارد کنید.</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField label="توکن (Token)">
                                    <TextInput value={eitaaToken} onChange={e => setEitaaToken(e.target.value)} placeholder="Token دریافتی از ایتایار" />
                                </FormField>
                                <FormField label="پین (PIN)">
                                    <TextInput value={eitaaPin} onChange={e => setEitaaPin(e.target.value)} placeholder="Pin دریافتی از ایتایار" />
                                </FormField>
                                <FormField label="شناسه کانال">
                                    <TextInput value={eitaaChannelId} onChange={e => setEitaaChannelId(e.target.value)} placeholder="مثال: @soha_sima" />
                                </FormField>
                            </div>
                        </div>
                    </fieldset>
                    {activeTab === 'podcasts' ? renderPodcastPanel() : renderVideoPanel()}
                </main>
                 <footer className="flex-shrink-0 flex justify-end items-center gap-4 p-3 border-t border-border-color bg-gray-50">
                    <button onClick={handleDiscardAndClose} className="bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors">
                        لغو
                    </button>
                    <button 
                        onClick={handleSaveChangesAndClose} 
                        disabled={!hasChanges()}
                        className="bg-primary text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ذخیره و بستن
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AdminPage;