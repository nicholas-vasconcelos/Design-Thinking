import { Bell, ChevronDown, LogOut, Menu, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { CapyWordmark } from './CapyWordmark';

export function Layout({
  currentUser,
  onOpenCreateModal,
  onLogout,
  globalSearchQuery,
  onSearchChange,
  onSearchSubmit,
  children,
}: {
  currentUser: User;
  onOpenCreateModal: () => void;
  onLogout: () => void;
  globalSearchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/projetos', label: 'Projetos' },
    { to: '/pessoas', label: 'Pessoas' },
    { to: '/feed', label: 'Feed' },
    { to: '/eventos', label: 'Eventos' },
    { to: '/perfil', label: 'Meu Portfólio' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#182536] antialiased selection:bg-[#1E3C61]/15 selection:text-[#1E3C61] overflow-x-hidden">
      <header className="sticky top-0 z-30 border-b-[2px] border-[#182536] bg-[#FAF7F2]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3 h-full min-w-0">
            <button type="button" onClick={() => navigate('/feed')} className="focus:outline-none cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center">
              <CapyWordmark showMascot size="md" />
            </button>

            <nav className="hidden md:flex items-center gap-4 lg:gap-6 h-full">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `h-full inline-flex items-center text-sm transition-colors border-b-2 ${isActive ? 'border-[#1E3C61] text-[#1E3C61] font-semibold' : 'border-transparent text-gray-500 hover:text-[#1E3C61] font-medium'}`}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSearchSubmit();
              }}
              className="hidden sm:flex items-center relative w-48 md:w-56 lg:w-72"
            >
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-full border border-[#DDE2E6] bg-[#FAF7F2] py-2 pl-9 pr-3 text-xs text-[#182536] placeholder:text-gray-400 transition-colors focus:border-[#1E3C61] focus:bg-white focus:outline-none"
              />
            </form>

            <button
              type="button"
              onClick={onOpenCreateModal}
              className="hidden lg:inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[#DDE2E6] bg-[#FAF7F2] px-3 py-2 text-xs font-semibold text-[#1E3C61] transition-colors hover:bg-gray-100"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Publicar</span>
            </button>

            <Link to="/eventos" className="relative flex h-11 w-11 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#1E3C61]" title="Notificações Acadêmicas">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#FEA402]" />
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <Link to="/perfil" className="group flex items-center gap-1.5" title={`Portfólio de ${currentUser.name}`}>
                <img src={currentUser.avatar} alt={currentUser.name} className="h-8 w-8 rounded-full border border-[#DDE2E6] object-cover" />
                <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#1E3C61]" />
              </Link>

              <button type="button" onClick={onLogout} title="Sair para tela de Login" className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-400 transition-colors hover:text-[#182536]">
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              aria-label="Abrir menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#DDE2E6] bg-white text-[#1E3C61] shadow-sm transition-transform active:scale-95 md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button type="button" className="absolute inset-0 bg-[#182536]/40" aria-label="Fechar menu" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-[82%] max-w-sm border-l-[2px] border-[#182536] bg-white p-4 shadow-[-8px_0_30px_rgba(24,37,54,0.18)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#DDE2E6] pb-4">
              <CapyWordmark showMascot size="sm" />
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#DDE2E6] text-[#1E3C61] transition-transform active:scale-95">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-5 space-y-2">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `flex min-h-[44px] items-center justify-between rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-[#EAF0F5] text-[#1E3C61]' : 'text-[#182536] hover:bg-[#FAF7F2]'}`}
                >
                  <span>{label}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 space-y-3 border-t border-[#DDE2E6] pt-4">
              <div className="flex items-center gap-3 rounded-xl border border-[#DDE2E6] bg-[#FAF7F2] px-3 py-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={globalSearchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Buscar..."
                  className="w-full border-0 bg-transparent text-sm text-[#182536] placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <button type="button" onClick={() => { onOpenCreateModal(); setIsMobileMenuOpen(false); }} className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#1E3C61] px-4 py-3 text-sm font-semibold text-white">
                <Plus className="h-4 w-4" />
                Publicar
              </button>
              <button type="button" onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[#DDE2E6] bg-white px-4 py-3 text-sm font-semibold text-[#182536]">
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t border-[#DDE2E6] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-gray-500 sm:px-6 sm:flex-row">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <CapyWordmark showMascot size="sm" />
            <span className="hidden text-gray-300 sm:inline">|</span>
            <span>Comunidade Universitária de Pesquisa, Projetos e Conhecimento</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-medium text-gray-600 sm:gap-6">
            <Link to="/projetos" className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center hover:text-[#1E3C61]">Projetos</Link>
            <Link to="/pessoas" className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center hover:text-[#1E3C61]">Pessoas</Link>
            <Link to="/eventos" className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center hover:text-[#1E3C61]">Eventos</Link>
            <Link to="/feed" className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center hover:text-[#1E3C61]">Feed</Link>
            <Link to="/perfil" className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center hover:text-[#1E3C61]">Meu Portfólio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
