import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, MessageSquare, Search, Share2 } from 'lucide-react';
import { CapyLoginIllustration } from '../components/CapyLoginIllustration';
import { CapyWordmark } from '../components/CapyWordmark';

export function LoginPage({ onLogin }: { onLogin: (email: string, password: string) => Promise<boolean> }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    const ok = await onLogin(email.trim(), password);
    setIsSubmitting(false);
    if (!ok) {
      setError('E-mail ou senha incorretos');
      return;
    }

    const redirectTo = (location.state as { from?: string } | null)?.from || '/feed';
    navigate(redirectTo, { replace: true });
  };

  const handleUnavailable = () => {
    setError('Funcionalidade ainda não disponível.');
  };

  return (
    <div className="capy-hero-shell min-h-[calc(100vh-44px)] flex flex-col justify-between relative overflow-hidden">
      <div className="pointer-events-none select-none absolute -bottom-20 -left-12 w-[440px] h-[220px] rounded-full bg-[#1B8243]/10 blur-2xl" aria-hidden="true" />
      <div className="capy-dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="max-w-6xl w-full mx-auto px-6 py-10 md:py-14 relative z-10">
        <div className="mb-10"><CapyWordmark showMascot size="lg" /></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-10">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-[#1E3C61]">Conecte-se ao<br /><span className="text-[#1B8243]">universo acadêmico.</span></h1>
              <p className="text-base text-[#56616D] leading-relaxed max-w-md">Explore projetos, publique suas pesquisas e faça parte de uma comunidade que valoriza o conhecimento.</p>
            </div>
            <div className="space-y-5 pt-1">
              <div className="flex items-start gap-4"><div className="w-11 h-11 rounded-full bg-[#FAF7F2] border-[2px] border-[#182536] shadow-[4px_4px_0_#FEA402] flex items-center justify-center text-[#1E3C61] shrink-0"><Search className="w-4 h-4" /></div><div><h3 className="text-sm font-bold text-[#1E3C61]">Descubra</h3><p className="text-sm text-[#56616D]">Projetos de diversas áreas e instituições.</p></div></div>
              <div className="flex items-start gap-4"><div className="w-11 h-11 rounded-full bg-[#FAF7F2] border-[2px] border-[#182536] shadow-[4px_4px_0_#1B8243] flex items-center justify-center text-[#1E3C61] shrink-0"><Share2 className="w-4 h-4" /></div><div><h3 className="text-sm font-bold text-[#1E3C61]">Compartilhe</h3><p className="text-sm text-[#56616D]">Seus trabalhos e conquistas acadêmicas.</p></div></div>
              <div className="flex items-start gap-4"><div className="w-11 h-11 rounded-full bg-[#FAF7F2] border-[2px] border-[#182536] shadow-[4px_4px_0_#1E3C61] flex items-center justify-center text-[#1E3C61] shrink-0"><MessageSquare className="w-4 h-4" /></div><div><h3 className="text-sm font-bold text-[#1E3C61]">Conecte-se</h3><p className="text-sm text-[#56616D]">Com pesquisadores, estudantes e instituições.</p></div></div>
            </div>
            <CapyLoginIllustration />
          </div>

          <div className="lg:col-span-5">
            <div className="capy-panel p-8 bg-white">              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#1E3C61]">Entrar na sua conta</h2>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">Acesse com seu e-mail institucional ou crie uma nova conta.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#182536] mb-1.5">E-mail</label>
                  <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm text-[#182536] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3C61]/15 focus:border-[#1E3C61]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#182536] mb-1.5">Senha</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" className="w-full bg-white border border-[#CBD3DA] rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-[#182536] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3C61]/15 focus:border-[#1E3C61]" />
                    <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                </div>

                {error && <div className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="inline-flex items-center gap-2 text-gray-600 cursor-pointer"><input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 accent-[#1E3C61]" /> <span>Lembrar de mim</span></label>
                  <button type="button" onClick={handleUnavailable} className="text-[#1E3C61] font-medium hover:underline cursor-pointer">Esqueceu sua senha?</button>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-[#1E3C61] hover:bg-[#162D49] text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors cursor-pointer mt-2 disabled:opacity-70">{isSubmitting ? 'Entrando...' : 'Entrar'}</button>
              </form>

              <div className="relative my-5 flex items-center justify-center"><div className="border-t border-[#DDE2E6] w-full" /><span className="bg-white px-3 text-xs text-gray-400">ou</span><div className="border-t border-[#DDE2E6] w-full" /></div>
              <button type="button" onClick={handleUnavailable} className="w-full bg-white hover:bg-gray-50 border border-[#CBD3DA] text-[#182536] font-medium py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z" /><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z" /><path fill="#FBBC05" d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z" /><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5L1.6 17c1.9 3.9 5.8 7 10.4 7z" /></svg>
                <span>Entrar com Google</span>
              </button>
              <p className="text-center text-xs text-gray-500 mt-6">Não tem uma conta? <Link to="/cadastro" className="text-[#1E3C61] font-semibold hover:underline">Criar conta</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
