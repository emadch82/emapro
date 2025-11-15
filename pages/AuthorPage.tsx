import React from 'react';
import type { Author, Book, Podcast } from '../types';
import BookCard from '../components/BookCard';
import { toPersianDigits, formatPersianDate } from '../utils/helpers';

interface AuthorPageProps {
  author: Author;
  allBooks: Book[];
  allPodcasts: Podcast[];
  onBack: () => void;
  onBookSelect: (book: Book) => void;
  onPlayEpisode: (podcast: Podcast, episodeIndex: number) => void;
}

const AuthorPage: React.FC<AuthorPageProps> = ({ author, allBooks, allPodcasts, onBack, onBookSelect, onPlayEpisode }) => {
  const authorBooks = allBooks.filter(book => book.authorId === author.id);
  const authorPodcasts = allPodcasts.filter(podcast => podcast.speakerId === author.id);
  
  const hasBooks = authorBooks.length > 0;
  const hasPodcasts = authorPodcasts.length > 0;
  
  const isSpecialAuthor = author.id === 7;

  return (
    <div className="fixed inset-0 bg-gray-900 text-white z-[200] overflow-y-auto animate-fadeIn">
      <header className="p-4 relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${author.coverImage || author.avatar})`, filter: 'blur(8px)' }}></div>
        <div className="relative z-10">
            <button onClick={onBack} className="bg-black/40 text-white border-none w-10 h-10 rounded-full text-base cursor-pointer backdrop-blur-sm transition-all duration-300 flex items-center justify-center absolute left-4 top-0 active:bg-black/50 active:scale-95">
              <i className="fas fa-arrow-right"></i>
            </button>
            <div className="flex items-start gap-5 pt-4">
                <img 
                    src={author.avatar} 
                    alt={author.name} 
                    className="w-24 h-32 rounded-xl object-cover shadow-lg flex-shrink-0"
                    style={{ border: isSpecialAuthor ? '3px solid rgba(251, 191, 36, 0.5)' : '3px solid rgba(255,255,255,0.2)' }}
                />
                <div className="flex-1 mt-2">
                    <h1 className={`text-2xl font-bold ${isSpecialAuthor ? 'text-amber-400' : 'text-white'}`}>{author.name}</h1>
                    <p className="text-sm mt-2 leading-relaxed line-clamp-4 text-gray-300">
                      {author.bio}
                    </p>
                </div>
            </div>
        </div>
      </header>
      
      <main className="pb-8">
        {hasBooks && (
          <section className="pt-6">
            <h2 className={`text-lg font-bold mb-4 pr-4 border-r-4 flex items-center gap-2 mx-4 ${isSpecialAuthor ? 'border-amber-400 text-amber-400' : 'border-primary text-gray-200'}`}>
              <i className="fas fa-book"></i>
              آثار مکتوب ({toPersianDigits(authorBooks.length)})
            </h2>
            <div className="flex overflow-x-auto items-start gap-x-5 pb-4 no-scrollbar px-4 h-[17rem]">
              {authorBooks.map(book => (
                <div key={book.id} className="flex-shrink-0">
                  <BookCard book={book} author={author} onClick={() => onBookSelect(book)} />
                </div>
              ))}
            </div>
          </section>
        )}
        
        {hasPodcasts && (
          <section className="pt-6">
            <h2 className={`text-lg font-bold mb-4 pr-4 border-r-4 flex items-center gap-2 mx-4 ${isSpecialAuthor ? 'border-amber-400 text-amber-400' : 'border-primary text-gray-200'}`}>
              <i className="fas fa-headphones-alt"></i>
              جلسات صوتی
            </h2>
            <div className="px-4 space-y-3">
              {authorPodcasts.flatMap(podcast => 
                podcast.episodes.map((episode, index) => (
                  <div 
                    key={`${podcast.id}-${index}`} 
                    onClick={() => onPlayEpisode(podcast, index)} 
                    className="group flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-200 border shadow-sm bg-gray-800/70 border-gray-700 hover:bg-gray-700/60"
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img src={episode.cover || podcast.cover} alt={episode.title} className="w-full h-full object-cover"/>
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <i className="fas fa-play"></i>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-semibold line-clamp-2 ${isSpecialAuthor ? 'text-gray-200 group-hover:text-amber-300' : 'text-gray-200 group-hover:text-primary'}`}>{episode.title}</h4>
                      <p className="text-xs mt-1 text-gray-400">{podcast.title}</p>
                       <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                        <span><i className="far fa-clock mr-1"></i> {episode.duration}</span>
                        <span><i className="far fa-calendar-alt mr-1"></i> {formatPersianDate(episode.date)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {(!hasBooks && !hasPodcasts) && (
             <div className="text-center py-20 text-gray-500">
                <i className="fas fa-box-open text-4xl mb-4"></i>
                <p>اثری برای این استاد ثبت نشده است.</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default AuthorPage;