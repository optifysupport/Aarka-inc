import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { loginAdmin } from '../../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onCancel,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter the admin password.');
      return;
    }

    setIsLoading(true);

    try {
      const isValid = await loginAdmin(password.trim());
      if (isValid) {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('Incorrect password. Access denied.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn font-['Sora',sans-serif]">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e5beb3]/50">
        {/* Top Header */}
        <div className="bg-[#271813] p-6 text-white text-center relative">
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-4 left-4 text-white/70 hover:text-white flex items-center gap-1 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Store</span>
          </button>

          <div className="w-14 h-14 rounded-2xl bg-[#ab2f00] text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-orange-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h2 className="font-extrabold text-2xl tracking-tight">Admin Portal</h2>
          <p className="text-xs text-white/80 mt-1">
            Secure administrative control panel
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-red-700 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                autoFocus
                required
                className="w-full pl-10 pr-10 py-3 bg-[#fff8f6] border border-[#e5beb3] rounded-xl text-sm text-[#271813] font-medium placeholder-gray-400 focus:border-[#ab2f00] focus:ring-2 focus:ring-[#ab2f00]/20 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#ab2f00] hover:bg-[#d63d00] text-white font-extrabold rounded-xl text-sm uppercase tracking-wider shadow-md hover:shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Unlock Admin Portal</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
