import React, { useMemo, useCallback } from 'react';
import type { Author, Book } from '../types';
import BookCard from '../components/BookCard';

interface MatnPageProps {
  authors: Author[];
  books: Book[];
  onBookSelect: (book: Book) => void;
  onAuthorSelect: (author: Author) => void;
}

const MatnPage: React.FC<MatnPageProps> = ({ authors, books, onBookSelect, onAuthorSelect }) => {

  const masterAuthors = useMemo(() => authors.filter(a => a.role === 'master'), [authors]);
  
  const getAuthorById = useCallback((id: number) => authors.find(a => a.id === id), [authors]);

  const recentBooks = useMemo(() => {
    return [...books]
      .sort((a, b) => new Date(b.addedDate || 0).getTime() - new Date(a.addedDate || 0).getTime())
      .slice(0, 9); // Increased to 9 for a 3x3 grid
  }, [books]);

  const bookCategories = useMemo(() => {
    const allCategories = books.flatMap(b => b.categories);
    const categoryOrder = ["فلسفه و تفکر", "گفتمان پیشرفت", "تعلیم و تربیت", "مدرسه سیاست", "دیدار آوینی", "روضه سها", "هیئت کتاب", "قصه مقاومت"];
    const uniqueCategories = [...new Set(allCategories)];
    
    return uniqueCategories.sort((a: string, b: string) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
  }, [books]);

  return (
    <main className="pb-20">
      <section className="pt-4 mb-8">
        <h2 className="text-lg font-bold mb-4 text-text-primary pr-2.5 border-r-4 border-primary flex items-center gap-2 mx-4">
          <i className="fas fa-feather-alt"></i>
          اساتید و مولفین
        </h2>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar px-4">
          {masterAuthors.map(author => (
            <div 
              key={author.id} 
              className="flex flex-col items-center gap-2 flex-shrink-0 w-24 cursor-pointer group"
              onClick={() => onAuthorSelect(author)}
            >
              <img src={author.avatar} alt={author.name} className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white/50 group-hover:border-primary/50 group-hover:scale-105 transition-all duration-300" />
              <p className="text-xs font-semibold text-center text-text-primary group-hover:text-primary transition-colors line-clamp-2 h-8">{author.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 px-4">
        <h2 className="text-lg font-bold mb-4 text-text-primary pr-2.5 border-r-4 border-primary flex items-center gap-2">
          <i className="fas fa-book-reader"></i>
          کتاب‌های مورد بحث
        </h2>
        <div className="grid grid-cols-3 justify-items-center gap-y-6">
          {recentBooks.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              author={getAuthorById(book.authorId)} 
              onClick={() => onBookSelect(book)} 
            />
          ))}
        </div>
      </section>

      <div className="space-y-8">
        {bookCategories.map(category => (
            <section key={category} className="px-4">
                <h2 className="text-base font-bold mb-4 text-text-primary pr-2.5 border-r-2 border-primary/70 flex items-center gap-2">
                  {category}
                </h2>
                <div className="grid grid-cols-3 justify-items-center gap-y-6">
                  {books.filter(b => b.categories.includes(category)).map(book => (
                      <BookCard 
                        key={book.id}
                        book={book}
                        author={getAuthorById(book.authorId)}
                        onClick={() => onBookSelect(book)}
                      />
                  ))}
                </div>
            </section>
        ))}
      </div>
    </main>
  );
};

export default MatnPage;