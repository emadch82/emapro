import React from 'react';
import type { Book, Author } from '../types';
import { toPersianDigits } from '../utils/helpers';

interface BookCardProps {
  book: Book;
  author?: Author;
  onClick: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, author, onClick }) => {
  const hasRelatedEpisodes = book.relatedEpisodes && book.relatedEpisodes.length > 0;

  return (
    <div
      className="cursor-pointer group h-full flex flex-col items-center text-center w-28" // Constrained width
      onClick={onClick}
    >
      <div className="relative h-40 w-full flex items-end justify-center">
        <img 
          src={book.cover} 
          alt={book.title} 
          loading="lazy" 
          className="h-full w-auto object-contain rounded-md shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
        />
        {hasRelatedEpisodes && (
           <div className="absolute bottom-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0">
              <i className="fas fa-headphones text-[10px]"></i>
              <span>{toPersianDigits(book.relatedEpisodes.length)} جلسه</span>
          </div>
        )}
      </div>
      <div className="mt-2.5 w-full">
        <h3 className="text-sm font-bold leading-tight line-clamp-2 text-text-primary group-hover:text-primary transition-colors h-10">{book.title}</h3>
        {author && (
          <p className="text-xs text-text-secondary mt-1 truncate">{author.name}</p>
        )}
      </div>
    </div>
  );
};

export default BookCard;