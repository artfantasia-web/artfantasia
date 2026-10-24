import React, { useState } from 'react';
import { Lock, ShieldCheck, X, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { loginAdmin } = useAdminData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const success = loginAdmin(username, password);
    setIsSubmitting(false);

    if (success) {
      setError(null);
      setUsername('');
      setPassword('');
      onLoginSuccess();
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-amber-400/40 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(251,191,36,0.15)] text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
            ART FANTASIA CONSOLE
          </span>
          <h3 className="text-xl font-bold text-white mt-1">
            관리자 로그인
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            소식 작성 및 인터네셔널 로고 관리를 위해 인증해주세요.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5 font-semibold">
              관리자 아이디 (ID)
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
                required
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5 font-semibold">
              비밀번호 (Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-sm shadow-[0_4px_16px_rgba(251,191,36,0.3)] hover:shadow-[0_4px_22px_rgba(251,191,36,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>로그인 및 관리자 진입</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUsername('artfantasia');
                setPassword('qhtm0920!');
                setError(null);
              }}
              className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 text-xs font-mono transition-colors border border-zinc-800 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🔑 관리자 계정 자동입력 (artfantasia)</span>
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-zinc-900 text-center">
          <span className="text-[11px] text-zinc-500 font-mono">
            SECURED FOR ART FANTASIA OFFICIAL ADMIN
          </span>
        </div>
      </div>
    </div>
  );
};
