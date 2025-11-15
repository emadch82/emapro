import React, { useState } from 'react';

interface LoginPageProps {
  onLoginSuccess: (phoneNumber: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('لطفاً یک شماره تماس معتبر (مانند 09123456789) وارد کنید.');
      return;
    }
    setError('');
    // In a real app, you would send an OTP here.
    // For now, we'll just simulate a successful login.
    onLoginSuccess(phoneNumber);
  };

  return (
    <div className="fixed inset-0 bg-background z-[2000] flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center items-center gap-4 mb-8">
          <img src="https://uploadkon.ir/uploads/2b2d28_25logo-soha-w.png" alt="لوگو سُها" className="w-16 h-16 rounded-2xl shadow-lg" />
           <img src="https://uploadkon.ir/uploads/2b2d28_25لوگوتایپ.png" alt="لوگوتایپ سُها" className="h-12" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">ورود | ثبت نام</h1>
        <p className="text-text-secondary mb-8">برای ورود به دنیای سُها، شماره تماس خود را وارد کنید.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="tel"
              dir="ltr"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="09123456789"
              className="w-full px-4 py-3 text-center tracking-widest border-2 border-border-color rounded-lg text-lg focus:ring-primary focus:border-primary transition"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-primary-dark transition-colors active:scale-95 disabled:opacity-50"
            disabled={!phoneNumber}
          >
            ارسال کد تایید
          </button>
        </form>
         <p className="text-xs text-text-secondary mt-6 leading-relaxed">
            با ورود و یا ثبت نام در سُها شما <a href="#" className="text-primary hover:underline">شرایط و قوانین</a> استفاده از سرویس‌های سایت و <a href="#" className="text-primary hover:underline">قوانین حریم خصوصی</a> آن را می‌پذیرید.
          </p>
      </div>
    </div>
  );
};

export default LoginPage;