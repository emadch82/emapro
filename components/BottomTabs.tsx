import React from 'react';
import type { Page } from '../types';

interface BottomTabsProps {
  activeTab: Page;
  onTabChange: (tab: Page) => void;
}

const ICONS: Record<Page, string> = {
  mahfel: 'fas fa-comments',
  sowt: 'fas fa-podcast',
  matn: 'fas fa-book-open',
  videos: 'fas fa-video',
};

const LABELS: Record<Page, string> = {
  mahfel: 'محفل',
  sowt: 'صوت‌ها',
  matn: 'متون',
  videos: 'ویدیوها',
};

const TabItem: React.FC<{ tab: Page; activeTab: Page; onClick: (tab: Page) => void }> = ({ tab, activeTab, onClick }) => {
    const isActive = activeTab === tab;
    
    const colorClass = isActive 
      ? (tab === 'videos' ? 'text-secondary' : 'text-primary') 
      : 'text-text-secondary/80 group-hover:text-text-primary';
    
    const labelClass = isActive ? 'font-bold' : 'font-medium';

    return (
        <div
            className="flex-1 flex justify-center items-center"
            onClick={() => onClick(tab)}
        >
            <div className="relative flex flex-col items-center justify-center gap-1 cursor-pointer group w-16 h-14">
                <div className={`text-xl transition-all duration-200 ${isActive ? '-mt-1' : ''} ${colorClass}`}>
                    <i className={ICONS[tab]}></i>
                </div>
                <div className={`text-[10px] transition-all duration-200 ${labelClass} ${colorClass}`}>
                    {LABELS[tab]}
                </div>
                {isActive && (
                    <div className={`absolute bottom-2 h-1 w-5 rounded-full ${tab === 'videos' ? 'bg-secondary' : 'bg-primary'}`}></div>
                )}
            </div>
        </div>
    );
};


const BottomTabs: React.FC<BottomTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card-bg/90 backdrop-blur-lg flex border-t border-border-color shadow-[0_-2px_15px_rgba(0,0,0,0.05)] z-[100]">
      {(Object.keys(LABELS) as Page[]).map((tab) => (
        <TabItem key={tab} tab={tab} activeTab={activeTab} onClick={onTabChange} />
      ))}
    </div>
  );
};

export default BottomTabs;