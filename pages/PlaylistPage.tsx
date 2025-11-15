
import React, { useState } from 'react';
import type { Podcast, Episode, Author } from '../types';
import { toPersianDigits, formatPersianDate } from '../utils/helpers';

interface PlaylistPageProps {
  podcast: Podcast;
  author?: Author;
  onBack: () => void;
  onPlayEpisode: (podcast: Podcast, episodeIndex: number) => void;
  onAuthorSelect?: (author: Author) => void;
}

const PlaylistPage: React.FC<PlaylistPageProps> = ({ podcast, author, onBack, onPlayEpisode, onAuthorSelect }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'episodes' | 'comments'>('episodes');

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const playAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (podcast.episodes.length > 0) {
      onPlayEpisode(podcast, 0);
    }
  };
  
  const handleAuthorClick = () => {
      if (author && onAuthorSelect) {
          onAuthorSelect(author);
      }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-[200] overflow-y-auto animate-fadeIn">
      <header
        className="text-white p-4 pb-20 relative bg-cover bg-center"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${podcast.cover})`, filter: 'blur(20px) brightness(0.6)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>


        <div className="relative z-10">
          <button onClick={onBack} className="bg-black/30 border-none w-10 h-10 rounded-full text-base text-white cursor-pointer backdrop-blur-md transition-all duration-300 flex items-center justify-center absolute left-4 top-4 active:bg-black/50 active:scale-95">
            <i className="fas fa-arrow-right"></i>
          </button>
          <div className="flex gap-4 items-end pt-8">
            <div className="w-[100px] h-[150px] rounded-lg overflow-hidden shadow-2xl flex-shrink-0">
              <img src={podcast.cover} alt={podcast.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 text-right">
              <h1 className="text-xl font-bold mb-1 leading-tight text-gray-100 drop-shadow-md">{podcast.title}</h1>
              {author && (
                <p 
                    className="text-base font-semibold text-gray-400 mb-3 leading-relaxed cursor-pointer hover:underline drop-shadow-sm"
                    onClick={handleAuthorClick}
                >
                  {author.name}
                </p>
              )}
              <div className="flex items-center justify-end gap-x-4 gap-y-1 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 drop-shadow-sm">
                  <i className="fas fa-headphones"></i>
                  <span>{toPersianDigits(podcast.episodes.length)} اپیزود</span>
                </div>
                {podcast.categories.slice(0,1).map(cat => (
                  <div key={cat} className="flex items-center gap-1.5 text-xs text-gray-400 drop-shadow-sm">
                    <i className="fas fa-tag"></i>
                    <span>{cat}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2.5 justify-end">
                <button onClick={playAll} className="bg-primary text-white font-semibold border-none py-2 px-4 rounded-xl text-sm cursor-pointer transition-all duration-300 active:scale-95 flex items-center gap-1.5 shadow-lg">
                  <i className="fas fa-play"></i>
                  <span>پخش همه</span>
                </button>
                <button onClick={toggleBookmark} className="bg-gray-800/70 border border-gray-600/50 py-2 px-4 rounded-xl text-gray-300 text-sm cursor-pointer backdrop-blur-md transition-all duration-300 active:scale-95 active:bg-gray-700 flex items-center gap-1.5">
                  <i className={`${isBookmarked ? 'fas fa-bookmark text-primary' : 'far fa-bookmark'}`}></i>
                  <span>ذخیره</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gray-900 border-b border-gray-700 flex justify-center -mt-10 pt-2 sticky top-0 z-10">
          <button onClick={() => setActiveTab('about')} className={`py-3 px-6 text-sm font-semibold transition-all ${activeTab === 'about' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}>درباره</button>
          <button onClick={() => setActiveTab('episodes')} className={`py-3 px-6 text-sm font-semibold transition-all ${activeTab === 'episodes' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}>{`قسمت‌ها (${toPersianDigits(podcast.episodes.length)})`}</button>
          <button onClick={() => setActiveTab('comments')} className={`py-3 px-6 text-sm font-semibold transition-all ${activeTab === 'comments' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}>نظرات</button>
      </div>

      <div className="p-4 bg-gray-900">
        {activeTab === 'about' && (
            <section className="animate-fadeIn">
                <p className="text-gray-400 leading-loose text-justify text-sm whitespace-pre-wrap">
                    {podcast.description || "توضیحاتی برای این مجموعه ثبت نشده است."}
                </p>
            </section>
        )}
        {activeTab === 'episodes' && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            {podcast.episodes.map((episode, index) => (
              <div key={index} onClick={() => onPlayEpisode(podcast, index)} className="group flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors duration-200 hover:bg-white/5">
                <span className="text-gray-500 font-mono text-lg w-6 text-center flex-shrink-0">{toPersianDigits(index + 1)}</span>
                <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <img src={episode.cover || podcast.cover} alt={episode.title} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-200 line-clamp-2 group-hover:text-primary">{episode.title}</h4>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500/80">
                    <span><i className="far fa-clock mr-1"></i> {episode.duration}</span>
                    <span><i className="far fa-calendar-alt mr-1"></i> {formatPersianDate(episode.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'comments' && (
             <section className="animate-fadeIn">
                 <div className="text-center py-10 text-gray-500">
                    <i className="fas fa-comments text-3xl mb-3"></i>
                    <p>بخش نظرات به زودی فعال خواهد شد.</p>
                </div>
             </section>
          )}
      </div>
    </div>
  );
};

export default PlaylistPage;