import { Bell, ChevronDown, LogOut, Plus, Search } from 'lucide-react';
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#182536] antialiased selection:bg-[#1E3C61]/15 selection:text-[#1E3C61]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 h-full">
            <button type="button" onClick={() => navigate('/feed')} className="focus:outline-none cursor-pointer">
              <CapyWordmark showMascot size="md" />
            </button>

            <nav className="hidden md:flex items-center gap-6 h-full">
              <NavLink to="/projetos" className={({ isActive }) => `h-full inline-flex items-center text-sm transition-colors border-b-2 ${isActive ? 'border-[#1E3C61] text-[#1E3C61] font-semibold' : 'border-transparent text-gray-500 hover:text-[#1E3C61] font-medium'}`}>
                Projetos
              </NavLink>
              <NavLink to="/pessoas" className={({ isActive }) => `h-full inline-flex items-center text-sm transition-colors border-b-2 ${isActive ? 'border-[#1E3C61] text-[#1E3C61] font-semibold' : 'border-transparent text-gray-500 hover:text-[#1E3C61] font-medium'}`}>
                Pessoas
              </NavLink>
              <NavLink to="/feed" className={({ isActive }) => `h-full inline-flex items-center text-sm transition-colors border-b-2 ${isActive ? 'border-[#1E3C61] text-[#1E3C61] font-semibold' : 'border-transparent text-gray-500 hover:text-[#1E3C61] font-medium'}`}>
                Feed
              </NavLink>
              <NavLink to="/eventos" className={({ isActive }) => `h-full inline-flex items-center text-sm transition-colors border-b-2 ${isActive ? 'border-[#1E3C61] text-[#1E3C61] font-semibold' : 'border-transparent text-gray-500 hover:text-[#1E3C61] font-medium'}`}>
                Eventos
              </NavLink>
              <NavLink to="/perfil" className={({ isActive }) => `h-full inline-flex items-center text-sm transition-colors border-b-2 ${isActive ? 'border-[#1E3C61] text-[#1E3C61] font-semibold' : 'border-transparent text-gray-500 hover:text-[#1E3C61] font-medium'}`}>
                Meu Portfólio
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSearchSubmit();
              }}
              className="hidden sm:flex items-center relative w-64 lg:w-72"
            >
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Buscar projetos, pessoas, instituições..."
                className="w-full rounded-full bg-[#FAF7F2] border border-[#DDE2E6] pl-9 pr-4 py-1.5 text-xs text-[#182536] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1E3C61] transition-colors"
              />
            </form>

            <button
              type="button"
              onClick={onOpenCreateModal}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3C61] bg-[#FAF7F2] hover:bg-gray-100 border border-[#DDE2E6] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publicar</span>
            </button>

            <Link to="/eventos" className="p-2 text-gray-500 hover:text-[#1E3C61] rounded-full hover:bg-gray-50 transition-colors cursor-pointer relative" title="Notificações Acadêmicas">
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FEA402] absolute top-2 right-2" />
            </Link>

            <div className="flex items-center gap-2">
              <Link to="/perfil" className="flex items-center gap-1.5 cursor-pointer group" title={`Portfólio de ${currentUser.name}`}>
                <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover border border-[#DDE2E6]" />
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1E3C61]" />
              </Link>

              <button type="button" onClick={onLogout} title="Sair para tela de Login" className="p-1.5 text-gray-400 hover:text-[#182536] rounded-lg cursor-pointer">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden flex items-center justify-around border-t border-gray-100 px-3 py-2 bg-white">
          <NavLink to="/projetos" className={({ isActive }) => `text-xs py-1 px-2 rounded-md ${isActive ? 'text-[#1E3C61] font-semibold bg-gray-50' : 'text-gray-500'}`}>
            Projetos
          </NavLink>
          <NavLink to="/pessoas" className={({ isActive }) => `text-xs py-1 px-2 rounded-md ${isActive ? 'text-[#1E3C61] font-semibold bg-gray-50' : 'text-gray-500'}`}>
            Pessoas
          </NavLink>
          <NavLink to="/feed" className={({ isActive }) => `text-xs py-1 px-2 rounded-md ${isActive ? 'text-[#1E3C61] font-semibold bg-gray-50' : 'text-gray-500'}`}>
            Feed
          </NavLink>
          <NavLink to="/eventos" className={({ isActive }) => `text-xs py-1 px-2 rounded-md ${isActive ? 'text-[#1E3C61] font-semibold bg-gray-50' : 'text-gray-500'}`}>
            Eventos
          </NavLink>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-20 bg-white border-t border-[#DDE2E6]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <CapyWordmark showMascot size="sm" />
            <span className="text-gray-300">|</span>
            <span>Comunidade Universitária de Pesquisa, Projetos e Conhecimento</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-medium text-gray-600">
            <Link to="/projetos" className="hover:text-[#1E3C61] cursor-pointer">Projetos</Link>
            <Link to="/pessoas" className="hover:text-[#1E3C61] cursor-pointer">Pessoas</Link>
            <Link to="/eventos" className="hover:text-[#1E3C61] cursor-pointer">Eventos</Link>
            <Link to="/feed" className="hover:text-[#1E3C61] cursor-pointer">Feed</Link>
            <Link to="/perfil" className="hover:text-[#1E3C61] cursor-pointer">Meu Portfólio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
