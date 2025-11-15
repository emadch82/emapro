import React from 'react';

interface UserProfilePageProps {
  onClose: () => void;
  onLogout: () => void;
  user: { phoneNumber: string; interests: string[] };
  onNavigateToFavorites: () => void;
  onNavigateToLibrary: () => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ onClose, onLogout, user, onNavigateToFavorites, onNavigateToLibrary }) => {
    
    // Mask phone number for display
    const maskedPhoneNumber = user.phoneNumber 
      ? `${user.phoneNumber.substring(0, 4)}****${user.phoneNumber.substring(8)}`
      : 'شماره ثبت نشده';

    return (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-end sm:items-center sm:justify-center p-0 sm:p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div 
              className="bg-background rounded-t-2xl sm:rounded-lg shadow-2xl w-full max-w-md flex flex-col animate-slideInUp h-[80vh] sm:h-auto"
              onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-4 border-b border-border-color flex-shrink-0">
                    <h2 className="font-bold text-lg">پروفایل کاربری</h2>
                    <button onClick={onClose} className="text-text-secondary text-xl w-8 h-8 rounded-full hover:bg-gray-200 active:bg-gray-300">&times;</button>
                </header>
                
                <main className="flex-grow p-6 overflow-y-auto">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-5xl font-bold mb-4">
                            <i className="fas fa-user"></i>
                        </div>
                        <p className="text-lg font-semibold text-text-primary">{maskedPhoneNumber}</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-semibold text-text-primary mb-3">علاقه‌مندی‌های شما</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.interests.length > 0 ? (
                                user.interests.map(interest => (
                                    <span key={interest} className="bg-primary-light-op text-primary py-1 px-3 rounded-full text-sm font-semibold">
                                        {interest}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-text-secondary">هنوز علاقه‌مندی انتخاب نکرده‌اید.</p>
                            )}
                        </div>
                         <button className="text-sm text-primary mt-3 hover:underline">
                            ویرایش علاقه‌مندی‌ها
                        </button>
                    </div>

                    <div className="space-y-2">
                        <button onClick={onNavigateToFavorites} className="w-full text-right p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-4">
                            <i className="fas fa-heart text-text-secondary w-5 text-center"></i>
                            <span>علاقه‌مندی‌ها</span>
                        </button>
                         <button onClick={onNavigateToLibrary} className="w-full text-right p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-4">
                            <i className="fas fa-bookmark text-text-secondary w-5 text-center"></i>
                            <span>کتابخانه</span>
                        </button>
                        <button className="w-full text-right p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-4">
                            <i className="fas fa-cog text-text-secondary w-5 text-center"></i>
                            <span>تنظیمات</span>
                        </button>
                         <button className="w-full text-right p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-4">
                            <i className="fas fa-question-circle text-text-secondary w-5 text-center"></i>
                            <span>راهنما و پشتیبانی</span>
                        </button>
                    </div>

                </main>

                <footer className="flex-shrink-0 p-4 border-t border-border-color">
                    <button 
                        onClick={onLogout}
                        className="w-full bg-red-500/10 text-red-600 font-semibold py-3 px-5 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                        خروج از حساب کاربری
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default UserProfilePage;