import React, { useState } from 'react';
import type { Book, Podcast, Author } from '../types';
import { toPersianDigits, formatPersianDate } from '../utils/helpers';

interface BookPageProps {
  book: Book;
  allPodcasts: Podcast[];
  authors: Author[];
  onBack: () => void;
  onPlayEpisode: (podcast: Podcast, episodeIndex: number) => void;
  onAuthorSelect: (author: Author) => void;
}

const BookPage: React.FC<BookPageProps> = ({ book, allPodcasts, authors, onBack, onPlayEpisode, onAuthorSelect }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'sessions' | 'comments'>('about');
  const author = authors.find(a => a.id === book.authorId);

  const getRelatedEpisodeDetails = () => {
    return book.relatedEpisodes
      .map(ref => {
        const podcast = allPodcasts.find(p => p.id === ref.podcastId);
        if (podcast && podcast.episodes[ref.episodeIndex]) {
          return {
            podcast,
            episode: podcast.episodes[ref.episodeIndex],
            episodeIndex: ref.episodeIndex,
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  };

  const relatedEpisodes = getRelatedEpisodeDetails();
  
  // Set initial tab intelligently
  useState(() => {
    if (book.description) {
      setActiveTab('about');
    } else if (relatedEpisodes.length > 0) {
      setActiveTab('sessions');
    } else {
      setActiveTab('comments');
    }
  });


  return (
    <div className="fixed inset-0 bg-gray-900 z-[200] overflow-y-auto animate-fadeIn">
      <header className="relative p-4 pb-4">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${book.cover})`, filter: 'blur(20px) brightness(0.6)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>

        <div className="relative z-10">
          <button onClick={onBack} className="bg-black/30 border-none w-10 h-10 rounded-full text-base text-white cursor-pointer backdrop-blur-md transition-all duration-300 flex items-center justify-center absolute left-4 top-4 active:bg-black/50 active:scale-95">
            <i className="fas fa-arrow-right"></i>
          </button>
          <div className="flex gap-4 items-end pt-8">
            <div className="w-[100px] h-[150px] rounded-lg overflow-hidden shadow-2xl flex-shrink-0">
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 text-right">
              <h1 className="text-xl font-bold mb-1 leading-tight text-gray-100 drop-shadow-md">{book.title}</h1>
              {author && (
                <p 
                  className="text-base font-semibold text-gray-400 mb-3 leading-relaxed cursor-pointer hover:underline drop-shadow-sm"
                  onClick={() => onAuthorSelect(author)}
                >
                  {author.name}
                </p>
              )}
              <div className="flex flex-wrap gap-x-2 gap-y-1 justify-end">
                {book.categories.map(cat => (
                  <span key={cat} className="bg-primary/20 text-primary-light py-0.5 px-2.5 rounded-full text-[10px] font-bold">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="bg-gray-900 border-b border-gray-700 flex justify-center sticky top-0 z-20">
          {book.description && <button onClick={() => setActiveTab('about')} className={`py-3 px-6 text-sm font-semibold transition-all ${activeTab === 'about' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}>درباره</button>}
          {relatedEpisodes.length > 0 && <button onClick={() => setActiveTab('sessions')} className={`py-3 px-6 text-sm font-semibold transition-all ${activeTab === 'sessions' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}>{`جلسات (${toPersianDigits(relatedEpisodes.length)})`}</button>}
          <button onClick={() => setActiveTab('comments')} className={`py-3 px-6 text-sm font-semibold transition-all ${activeTab === 'comments' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}>گفتگوها</button>
      </div>

      <div className="p-4 bg-gray-900">
          {activeTab === 'about' && book.description && (
            <section className="animate-fadeIn">
                <p className="text-gray-400 leading-loose text-justify text-sm whitespace-pre-wrap">
                    {book.description}
                </p>
            </section>
          )}

          {activeTab === 'sessions' && (
            <section className="animate-fadeIn">
                {relatedEpisodes.length > 0 ? (
                    <div className="flex flex-col gap-3">
                    {relatedEpisodes.map((item, index) => (
                        <div key={index} onClick={() => onPlayEpisode(item.podcast, item.episodeIndex)} className="group flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors duration-200 hover:bg-white/5">
                           <span className="text-gray-500 font-mono text-lg w-6 text-center flex-shrink-0">{toPersianDigits(index + 1)}</span>
                           <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                                <img src={item.episode.cover || item.podcast.cover} alt={item.episode.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                    <i className="fas fa-play"></i>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-200 line-clamp-2 group-hover:text-primary">{item.episode.title}</h4>
                                <p className="text-xs text-gray-400 mt-1">{item.podcast.title}</p>
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500/80">
                                  <span><i className="far fa-clock mr-1"></i> {item.episode.duration}</span>
                                  <span><i className="far fa-calendar-alt mr-1"></i> {formatPersianDate(item.episode.date)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <i className="fas fa-link-slash text-3xl mb-3"></i>
                        <p>جلسه صوتی مرتبطی برای این کتاب یافت نشد.</p>
                    </div>
                )}
            </section>
          )}

          {activeTab === 'comments' && (
             <section className="animate-fadeIn">
                 <div className="text-center py-10 text-gray-500">
                    <i className="fas fa-comments text-3xl mb-3"></i>
                    <p>بخش گفتگوها به زودی فعال خواهد شد.</p>
                </div>
             </section>
          )}
      </div>
    </div>
  );
};

export default BookPage;