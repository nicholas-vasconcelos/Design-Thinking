import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CapyWordmark } from '../components/CapyWordmark';

export function RegisterPage({ onRegister }: { onRegister: (data: { name: string; email: string; password: string; confirmPassword: string; institution: string; course: string; period: string; focus: string; tags: string[]; bio: string; }) => Promise<string | null> }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: 'Universidade Federal Fluminense (UFF)',
    course: 'Ciência da Computação',
    period: '6º Período',
    focus: 'Dados e Análise',
    tagsInput: 'Python, GeoPandas, PostgreSQL',
    bio: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) nextErrors.name = 'Informe seu nome completo.';
    if (!form.email.trim()) nextErrors.email = 'Informe seu e-mail.';
    if (!form.password) nextErrors.password = 'Informe uma senha.';
    if (form.password.length < 8) nextErrors.password = 'A senha deve ter pelo menos 8 caracteres.';
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'As senhas não conferem.';
    if (!form.institution.trim()) nextErrors.institution = 'Informe a instituição.';
    if (!form.course.trim()) nextErrors.course = 'Informe o curso.';
    if (!form.period.trim()) nextErrors.period = 'Informe o período.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const tags = form.tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean);
    setErrors({});
    setIsSubmitting(true);
    const result = await onRegister({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      institution: form.institution.trim(),
      course: form.course.trim(),
      period: form.period.trim(),
      focus: form.focus.trim(),
      tags,
      bio: form.bio.trim(),
    });
    setIsSubmitting(false);

    if (result) {
      setErrors({ email: result });
      return;
    }

    navigate('/perfil', { replace: true });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8"><CapyWordmark showMascot size="lg" /></div>
      <div className="max-w-2xl mx-auto bg-white border border-[#DDE2E6] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-[#1E3C61]">Criar sua conta acadêmica</h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">Configure seu perfil universitário para publicar pesquisas e se conectar com estudantes.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">Nome completo</label>
              <input type="text" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" placeholder="Ex: Gabriel Costa" />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">E-mail institucional</label>
              <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" placeholder="seu@id.uff.br" />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">Senha</label>
              <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" placeholder="Mínimo 8 caracteres" />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">Confirmar senha</label>
              <input type="password" value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" placeholder="Confirme sua senha" />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">Instituição de Ensino</label>
              <input type="text" value={form.institution} onChange={(event) => setForm((current) => ({ ...current, institution: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" />
              {errors.institution && <p className="mt-1 text-xs text-red-600">{errors.institution}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">Curso</label>
              <input type="text" value={form.course} onChange={(event) => setForm((current) => ({ ...current, course: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" />
              {errors.course && <p className="mt-1 text-xs text-red-600">{errors.course}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">Período</label>
              <input type="text" value={form.period} onChange={(event) => setForm((current) => ({ ...current, period: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" />
              {errors.period && <p className="mt-1 text-xs text-red-600">{errors.period}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">Área / Foco de Atuação</label>
              <input type="text" value={form.focus} onChange={(event) => setForm((current) => ({ ...current, focus: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#182536] mb-1.5">Tags (separadas por vírgula)</label>
            <input type="text" value={form.tagsInput} onChange={(event) => setForm((current) => ({ ...current, tagsInput: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#182536] mb-1.5">Resumo acadêmico</label>
            <textarea rows={3} value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} placeholder="Fale brevemente sobre suas linhas de pesquisa e interesses..." className="w-full bg-white border border-[#CBD3DA] rounded-lg p-3.5 text-sm focus:outline-none focus:border-[#1E3C61]" />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#DDE2E6]">
            <Link to="/login" className="px-4 py-2.5 rounded-lg border border-[#CBD3DA] text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer">Voltar para Login</Link>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-[#1E3C61] hover:bg-[#162D49] text-white text-sm font-semibold cursor-pointer disabled:opacity-70">{isSubmitting ? 'Criando...' : 'Criar conta'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
