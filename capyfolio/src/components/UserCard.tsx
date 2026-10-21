import { ArrowUpRight, Building2, GraduationCap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { User } from '../types';

export function UserCard({ user, isConnected, onToggleConnect }: { user: User; isConnected?: boolean; onToggleConnect?: () => void }) {
  return (
    <article className="bg-white border border-[#DDE2E6] rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-[#DDE2E6]" />
          <div className="min-w-0">
            <Link to={`/perfil/${user.id}`} className="text-base font-bold text-[#182536] hover:text-[#1E3C61] block truncate">{user.name}</Link>
            <p className="text-xs text-gray-500 truncate">{user.focus}</p>
          </div>
        </div>
        <button type="button" onClick={onToggleConnect} className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border ${isConnected ? 'bg-[#E8F5ED] text-[#1B8243] border-[#CDE8D7]' : 'bg-white text-[#1E3C61] border-[#CBD3DA] hover:bg-gray-50'} cursor-pointer`}>
          {isConnected ? 'Conectado' : 'Conectar'}
        </button>
      </div>

      <div className="mt-4 space-y-2.5 text-[11px] text-gray-500">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-[#1E3C61]" />
          <span>{user.institution}</span>
        </div>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-3.5 h-3.5 text-[#1B8243]" />
          <span>{user.course} • {user.period}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-[#FEA402]" />
          <span>{user.connections ?? 0} conexões</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {user.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-[#FAF7F2] border border-[#DDE2E6] px-2 py-1 text-[10px] font-medium text-gray-600">{tag}</span>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[#F1F3F5] flex items-center justify-between">
        <span className="text-[11px] text-gray-500">Perfil acadêmico</span>
        <Link to={`/perfil/${user.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3C61] hover:underline">
          Ver perfil <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
