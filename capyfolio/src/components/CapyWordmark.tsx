import { CapyMascot } from './CapyMascot';

export function CapyWordmark({ showMascot = true, size = 'md' }: { showMascot?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const textSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl';

  return (
    <div className="inline-flex items-center gap-2 select-none">
      {showMascot && <CapyMascot className={size === 'lg' ? 'w-10 h-10' : 'w-8 h-8'} />}
      <div className={`relative font-extrabold tracking-tight leading-none flex items-baseline ${textSize}`}>
        <svg viewBox="0 0 44 28" className={size === 'lg' ? 'w-6 h-4.5 absolute -top-2.5 -left-2' : 'w-5 h-4 absolute -top-2 -left-1.5'} fill="none">
          <polygon points="3,13 21,4 40,10 22,19" fill="#1E3C61" stroke="#182536" strokeWidth="2" />
          <path d="M12 15V22C16 19 24 18 29 20V14" fill="#1E3C61" stroke="#182536" strokeWidth="2" />
          <path d="M7 14L5 24" stroke="#1E3C61" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="5" cy="24.5" r="2" fill="#1E3C61" />
        </svg>
        <span className="text-[#1B8243]">Cap</span>
        <span className="text-[#1E3C61]">y</span>
        <span className="text-[#FEA402]">Folio</span>
      </div>
    </div>
  );
}
