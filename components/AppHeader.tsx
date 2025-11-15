import React from 'react';

interface AppHeaderProps {
  onOpenAdmin: () => void;
  onOpenProfile: () => void;
  isVisible: boolean;
  liveStream: { isLive: boolean; url: string };
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onOpenAdmin, onOpenProfile, isVisible, liveStream, theme, isAuthenticated }) => {
  const isDark = theme === 'dark';

  const themeClasses = {
    header: isDark ? 'bg-gray-900 border-gray-700' : 'bg-card-bg border-border-color',
    liveButton: isDark ? 'text-blue-300 bg-blue-500/20 hover:bg-blue-500/30' : 'text-blue-600 bg-blue-500/10 hover:bg-blue-500/20',
    addButton: isDark ? 'text-gray-300 hover:text-white active:bg-gray-700' : 'text-text-secondary hover:text-text-primary active:bg-gray-100',
  };
  
  const headerVisibilityClass = isVisible ? 'translate-y-0' : '-translate-y-full';

  return (
    <header className={`${themeClasses.header} p-[15px] border-b sticky top-0 z-50 shadow-sm overflow-hidden transition-all duration-300 ${headerVisibilityClass}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenAdmin}>
          <img src="https://uploadkon.ir/uploads/2b2d28_25logo-soha-w.png" alt="لوگو سُها" className="w-[42px] h-[42px] rounded-[10px] object-cover shadow-[0_4px_12px_rgba(26,179,148,0.3)]" />
          <img src="https://uploadkon.ir/uploads/2b2d28_25لوگوتایپ.png" alt="لوگوتایپ سُها" className={`h-7 ${isDark ? 'invert' : ''}`} />
        </div>
        <div className="flex items-center gap-4">
          <a href={liveStream.url} target="_blank" rel="noopener noreferrer" className={`${themeClasses.liveButton} flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 active:scale-95`}>
             {liveStream.isLive && <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>}
            <span>پخش زنده</span>
          </a>
          <button className={`${themeClasses.addButton} bg-none border-none text-[18px] cursor-pointer p-2 rounded-full transition-all duration-300 ease-in-out active:text-primary`} onClick={onOpenProfile}>
            <i className={`fas ${isAuthenticated ? 'fa-user-circle' : 'fa-sign-in-alt'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
