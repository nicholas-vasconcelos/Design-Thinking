import { ArrowUpRight, CalendarDays, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Event } from '../types';
import { LlmEventCover } from './LlmEventCover';

export function EventCard({ event, isRegistered, onToggleRegistration }: { event: Event; isRegistered?: boolean; onToggleRegistration?: () => void }) {
  const cover = event.category === 'Palestra' || event.category === 'Simpósio' ? <LlmEventCover /> : (
    <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden border border-[#DDE2E6] bg-gradient-to-br from-[#1E3C61] via-[#1B8243] to-[#FEA402] p-4 flex items-end">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_30%)]" />
      <div className="relative z-10 text-white text-xs font-semibold uppercase tracking-[0.18em]">{event.category}</div>
    </div>
  );

  return (
    <article className="bg-white border border-[#DDE2E6] rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <Link to={`/evento/${event.id}`} className="block">
        {cover}
      </Link>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] rounded-full bg-[#EAF2FF] text-[#1E3C61]">{event.category}</span>
          <span className={`text-[10px] font-medium rounded-full px-2 py-1 ${event.status === 'Inscrições abertas' ? 'bg-[#E8F5ED] text-[#1B8243]' : 'bg-[#F3F4F6] text-gray-500'}`}>
            {event.status}
          </span>
        </div>

        <div className="space-y-2">
          <Link to={`/evento/${event.id}`} className="text-lg font-bold text-[#182536] hover:text-[#1E3C61] leading-tight block">
            {event.title}
          </Link>
          <p className="text-sm text-gray-600 leading-relaxed">{event.shortDescription}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500">
          <div className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />{event.date}</div>
          <div className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{event.city}</div>
          <div className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{event.attendeesCount}</div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#F1F3F5]">
          <span className="text-xs text-gray-500">{event.modality}</span>
          <button type="button" onClick={onToggleRegistration} disabled={event.status !== 'Inscrições abertas'} className={`inline-flex items-center gap-1 text-xs font-semibold ${event.status === 'Inscrições abertas' ? 'text-[#1E3C61] hover:underline cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}>
            {isRegistered ? 'Inscrito' : 'Inscrever-se'}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
