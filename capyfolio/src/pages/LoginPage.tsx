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
    <div className="min-h-screen bg-[#FAF7F2] font-['Instrument_Sans',sans-serif] text-[#182536]">
      <div className="flex min-h-[900px] flex-wrap bg-[#FAF7F2]">
        <section className="relative flex min-w-0 flex-[1.1_1_560px] flex-col gap-10 overflow-hidden bg-[#1E3C61] bg-[radial-gradient(rgba(250,247,242,0.13)_1.5px,transparent_1.5px)] bg-[size:26px_26px] px-8 py-12 text-[#FAF7F2] sm:px-12 lg:px-16">
          <div className="flex items-center gap-3">
            <CapyWordmark showMascot size="lg" />
          </div>

          <div className="flex w-full max-w-[690px] flex-col gap-6">
            <h1 className="m-0 max-w-[600px] text-[clamp(3.25rem,5vw,5rem)] font-extrabold leading-[0.96] tracking-[-0.035em] text-white">
              Conecte-se ao universo acadêmico.
            </h1>
            <p className="m-0 max-w-[460px] text-[19px] leading-[1.55] text-[#DCE5EE]">
              Explore projetos, publique suas pesquisas e faça parte de uma comunidade que valoriza o conhecimento.
            </p>
          </div>

          <div className="relative z-10 flex w-full max-w-[440px] flex-col gap-3.5">
            <div className="flex items-center gap-4 rounded-[16px] border-[2px] border-[#182536] bg-[#FAF7F2] p-3 shadow-[4px_4px_0_#FEA402]">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[12px] border-[2px] border-[#182536] bg-[#FFF4D6]">
                <Search className="h-5 w-5 text-[#182536]" />
              </span>
              <div className="flex flex-col">
                <strong className="font-bold text-[#182536]">Descubra</strong>
                <span className="text-sm text-[#56616D]">Projetos de diversas áreas e instituições.</span>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[16px] border-[2px] border-[#182536] bg-[#FAF7F2] p-3 shadow-[4px_4px_0_#1B8243]">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[12px] border-[2px] border-[#182536] bg-[#EAF5EE]">
                <Share2 className="h-5 w-5 text-[#182536]" />
              </span>
              <div className="flex flex-col">
                <strong className="font-bold text-[#182536]">Compartilhe</strong>
                <span className="text-sm text-[#56616D]">Seus trabalhos e conquistas acadêmicas.</span>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[16px] border-[2px] border-[#182536] bg-[#FAF7F2] p-3 shadow-[4px_4px_0_#EAF0F5]">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[12px] border-[2px] border-[#182536] bg-[#EAF0F5]">
                <MessageSquare className="h-5 w-5 text-[#182536]" />
              </span>
              <div className="flex flex-col">
                <strong className="font-bold text-[#182536]">Conecte-se</strong>
                <span className="text-sm text-[#56616D]">Com pesquisadores, estudantes e instituições.</span>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-10 right-6 z-20 flex h-[300px] w-[300px] items-end justify-center overflow-hidden rounded-full border-[2px] border-[#182536] bg-[#FAF7F2] shadow-[8px_8px_0_#FEA402]">
            <div className="absolute inset-x-0 bottom-0 top-auto h-0 w-full" />
            <CapyLoginIllustration compact />
          </div>

          <div className="absolute bottom-5 right-4 z-30 max-w-[210px] -rotate-[4deg] rounded-xl border-[2px] border-[#182536] bg-[#FEA402] px-4 py-2.5 text-[17px] font-bold leading-[1.2] text-[#182536] shadow-[4px_4px_0_#182536]">
            Grandes ideias também nascem na universidade.
          </div>
        </section>

        <section className="flex min-w-0 flex-[1_1_440px] items-center justify-center px-8 py-14 sm:px-8 lg:px-8">
          <div className="w-full max-w-[460px] rounded-[24px] border-[2px] border-[#182536] bg-white p-10 shadow-[8px_8px_0_#1B8243]">
            <div className="mb-6 flex flex-col gap-2">
              <h2 className="m-0 text-[34px] font-extrabold leading-[1.05] tracking-[-0.025em] text-[#1E3C61]">Entrar na sua conta</h2>
              <p className="m-0 text-[16px] leading-[1.5] text-[#56616D]">
                Acesse com seu e-mail institucional ou crie uma nova conta.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[15px] font-bold text-[#182536]">E-mail</label>
                <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" className="h-[52px] w-full rounded-[12px] border-2 border-[#8A96A3] bg-white px-4 text-[16px] text-[#182536] outline-none placeholder:text-[#6B7682] focus:border-[#1E3C61] focus:shadow-[3px_3px_0_#FEA402]" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="senha" className="text-[15px] font-bold text-[#182536]">Senha</label>
                <div className="relative">
                  <input id="senha" type={showPassword ? 'text' : 'password'} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" className="h-[52px] w-full rounded-[12px] border-2 border-[#8A96A3] bg-white py-0 pl-4 pr-12 text-[16px] text-[#182536] outline-none placeholder:text-[#6B7682] focus:border-[#1E3C61] focus:shadow-[3px_3px_0_#FEA402]" />
                  <button type="button" aria-label="Mostrar senha" onClick={() => setShowPassword((current) => !current)} className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-lg bg-transparent text-[#56616D] hover:text-[#182536]">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</div>}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex min-h-[44px] items-center gap-2.5 text-[15px] text-[#182536]">
                  <input type="checkbox" className="h-5 w-5 accent-[#1E3C61]" />
                  Lembrar de mim
                </label>
                <button type="button" onClick={handleUnavailable} className="text-[15px] font-semibold text-[#1B8243] hover:underline">Esqueceu sua senha?</button>
              </div>

              <button type="submit" disabled={isSubmitting} className="h-[56px] rounded-[14px] border-[2px] border-[#182536] bg-[#1E3C61] text-[18px] font-bold text-white shadow-[4px_4px_0_#FEA402] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#FEA402] disabled:opacity-70">
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-sm text-[#56616D]">
              <span className="h-[2px] flex-1 bg-[#DDE2E6]" />
              <span>ou</span>
              <span className="h-[2px] flex-1 bg-[#DDE2E6]" />
            </div>

            <button type="button" onClick={handleUnavailable} className="flex h-[56px] w-full items-center justify-center gap-3 rounded-[14px] border-[2px] border-[#182536] bg-white text-[16px] font-semibold text-[#182536] shadow-[4px_4px_0_#182536] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#182536]">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6a4.8 4.8 0 01-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5z"></path>
                <path fill="#34A853" d="M12 22.5c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10.5 10.5 0 0012 22.5z"></path>
                <path fill="#FBBC05" d="M6.2 14.1a6.3 6.3 0 010-4.2V7.2H2.7a10.5 10.5 0 000 9.6z"></path>
                <path fill="#EA4335" d="M12 5.7c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10.5 10.5 0 002.7 7.2l3.5 2.7c.8-2.2 3.1-4 5.8-4z"></path>
              </svg>
              Entrar com Google
            </button>

            <p className="mt-6 text-center text-[15px] text-[#56616D]">
              Não tem uma conta? <Link to="/cadastro" className="font-semibold text-[#1B8243] hover:underline">Criar conta</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
