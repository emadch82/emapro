import React from 'react';
import type { Video } from '../types';
import { toPersianDigits, formatTime } from '../utils/helpers';

interface VideoCardProps {
  video: Video;
  onSelect: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onSelect }) => {
  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert('گزینه‌های بیشتر به زودی اضافه خواهد شد.');
  };

  return (
    <div 
      className="bg-transparent cursor-pointer group"
      onClick={onSelect}
    >
      <div className="relative w-full aspect-video bg-gray-200 rounded-xl overflow-hidden mb-3 shadow-lg shadow-black/10">
        <img src={video.thumbnailUrl} alt={video.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] px-1.5 py-0.5 rounded font-sans backdrop-blur-sm font-semibold tracking-wider">
          {toPersianDigits(formatTime(video.duration))}
        </div>
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
           {video.categories.slice(0, 1).map(cat => (
              <span key={cat} className="bg-black/60 text-white py-0.5 px-2 rounded-full text-[10px] font-semibold backdrop-blur-sm">
              {cat}
              </span>
          ))}
        </div>
      </div>
      <div className="flex items-start gap-3 px-1">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold leading-tight text-text-primary line-clamp-2">{video.title}</h3>
          <div className="text-xs text-text-secondary mt-1">
            <p>
              <span>{toPersianDigits(video.viewCount)} بازدید</span>
              <span className="mx-1">•</span>
              <span>{video.uploadDate}</span>
            </p>
          </div>
        </div>
        <button onClick={handleOptionsClick} className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
          <i className="fas fa-ellipsis-v"></i>
        </button>
      </div>
    </div>
  );
};

export default VideoCard;