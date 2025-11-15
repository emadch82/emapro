import React from 'react';

const LoadingPage: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background z-[3000] flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-4 mb-4">
        <img src="https://uploadkon.ir/uploads/2b2d28_25logo-soha-w.png" alt="لوگو سُها" className="w-16 h-16 rounded-2xl shadow-lg" />
        <img src="https://uploadkon.ir/uploads/2b2d28_25لوگوتایپ.png" alt="لوگوتایپ سُها" className="h-12" />
      </div>
      <div className="flex items-center gap-2 text-text-secondary">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span>در حال بارگذاری...</span>
      </div>
    </div>
  );
};

export default LoadingPage;
