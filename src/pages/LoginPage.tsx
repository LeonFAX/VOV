import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';

export function LoginPage() {
  const { t } = useTranslation('pages');
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/admin');
      } else {
        setError(t('login.invalidCredentials'));
      }
    } catch {
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[#F5F0E8]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl p-8 border border-[#E8DFD0] shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#8B6914]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#8B6914]" />
            </div>
            <h1 className="text-2xl font-bold text-[#2D2619] mb-2 font-serif">
              {t('admin.title')}
            </h1>
            <p className="text-[#8A7D6E] text-sm">
              {t('login.email')} / {t('login.password')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#9A3A3A]/10 border border-[#9A3A3A]/20 rounded-lg p-3 text-[#9A3A3A] text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[#5C5346] text-sm mb-2 font-medium">{t('login.email')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A7D6E]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="pl-10 bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619] placeholder:text-[#B8A890] focus:border-[#8B6914] focus:ring-[#8B6914]/20 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#5C5346] text-sm mb-2 font-medium">{t('login.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A7D6E]" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-[#FAF8F4] border-[#E8DFD0] text-[#2D2619] placeholder:text-[#B8A890] focus:border-[#8B6914] focus:ring-[#8B6914]/20 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7D6E] hover:text-[#2D2619] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B6914] text-white hover:bg-[#7A5C10] py-6 font-semibold rounded-lg transition-colors"
            >
              {loading ? t('login.submitting') : t('login.submit')}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-[#E8DFD0]">
            <p className="text-[#8A7D6E] text-xs text-center">
              Demo: admin@example.com / admin
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}