import { ArrowUpRight, CalendarDays, FolderOpen, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project, User } from '../types';
import { SpatialMapProjectCover } from './SpatialMapProjectCover';

export function ProjectCard({ project, author, isFavorited, onToggleFavorite }: { project: Project; author?: User; isFavorited?: boolean; onToggleFavorite?: () => void }) {
  const cover = project.visualType === 'spatial-map' ? <SpatialMapProjectCover /> : (
    <div className="relative w-full h-52 sm:h-56 rounded-xl overflow-hidden border border-[#DDE2E6] bg-gradient-to-br from-[#1E3C61] via-[#225A8A] to-[#1B8243] flex items-end p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(253,224,71,0.22),_transparent_38%)]" />
      <div className="relative z-10 flex items-center gap-2 text-white">
        <FolderOpen className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em]">Projeto</span>
      </div>
    </div>
  );

  return (
    <article className="bg-white border border-[#DDE2E6] rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <Link to={`/projeto/${project.id}`} className="block">
        {cover}
      </Link>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] rounded-full bg-[#E8F5ED] text-[#1B8243]">{project.area}</span>
          <button type="button" onClick={onToggleFavorite} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#1E3C61] cursor-pointer">
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#1E3C61] text-[#1E3C61]' : ''}`} />
            {project.favorites ?? 0}
          </button>
        </div>

        <div className="space-y-2">
          <Link to={`/projeto/${project.id}`} className="block text-lg font-bold text-[#182536] hover:text-[#1E3C61] leading-tight">
            {project.title}
          </Link>
          <p className="text-sm text-gray-600 leading-relaxed">{project.shortDescription}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500">
          <div className="inline-flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            {project.date}
          </div>
          <div className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {project.institution}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#F1F3F5]">
          <div className="flex items-center gap-3 min-w-0">
            {author && (
              <>
                <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full object-cover border border-[#DDE2E6]" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#182536] truncate">{author.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{project.type}</p>
                </div>
              </>
            )}
          </div>
          <Link to={`/projeto/${project.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3C61] hover:underline">
            Ver projeto
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
