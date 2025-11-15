import React from 'react';
import type { Podcast, Episode } from '../types';

interface MinimizedPlayerProps {
  track: { podcast: Podcast; episode: Episode };
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onExpand: () => void;
  onClose: () => void;
  onSelectPodcast: (podcast: Podcast) => void;
  isVisible: boolean;
}

const MinimizedPlayer: React.FC<MinimizedPlayerProps> = ({
  track,
  isPlaying,
  progress,
  onPlayPause,
  onExpand,
  onClose,
  onSelectPodcast,
  isVisible,
}) => {
  return (
    <div
      className={`fixed bottom-16 left-2.5 right-2.5 bg-gradient-to-r from-primary to-primary-dark rounded-xl shadow-2xl z-[900] transition-transform duration-300 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-[calc(100%+2rem)]'}`}
    >
      <div className="relative h-full flex items-center p-2 gap-2.5 cursor-pointer" onClick={onExpand}>
        <div className={`transition-all duration-300 ease-in-out flex-shrink-0 ${isPlaying ? 'w-12' : 'w-0'}`} >
            <div
              className="w-12 h-12 rounded-lg overflow-hidden"
              onClick={(e) => { e.stopPropagation(); onSelectPodcast(track.podcast); }}
            >
              <img src={track.podcast.cover} alt={track.episode.title} className="w-full h-full object-cover" />
            </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{track.podcast.title}</p>
          <p className="text-xs text-white/80 truncate">{track.episode.title}</p>
        </div>
        <div className="flex items-center gap-0 pr-1">
            <button
              onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
              className="w-10 h-10 text-lg text-white rounded-full flex items-center justify-center flex-shrink-0 active:bg-white/20 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className={`w-10 h-10 text-lg text-white/80 rounded-full flex items-center justify-center active:bg-white/20 transition-all duration-300 ease-in-out flex-shrink-0 ${!isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
              aria-label="Close Player"
              tabIndex={!isPlaying ? 0 : -1}
            >
              <i className="fas fa-times"></i>
            </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30 rounded-b-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div
          className="h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${(progress || 0) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MinimizedPlayer;