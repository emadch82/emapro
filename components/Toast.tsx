import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      // Animate in
      setIsVisible(true);

      const closeTimer = setTimeout(() => {
        // Animate out
        setIsVisible(false);
        // Call onClose after animation finishes
        setTimeout(onClose, 300);
      }, duration);

      return () => {
        clearTimeout(closeTimer);
      };
    }
  }, [message, duration, onClose]);

  return (
    <div
      className={`fixed top-5 right-5 z-[9999] bg-gray-800 text-white px-6 py-3 rounded-lg shadow-2xl transition-all duration-300 ease-in-out flex items-center gap-3 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <i className="fas fa-check-circle text-primary"></i>
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
};

export default Toast;
