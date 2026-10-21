import { CapyMascot } from './CapyMascot';

export function CapyLoginIllustration() {
  return (
    <div className="relative flex items-center gap-4 pt-4 select-none">
      <div className="relative w-32 h-32 shrink-0">
        <svg viewBox="0 0 160 150" className="w-full h-full" fill="none">
          <path d="M22 30L26 24M18 42L12 40M115 24L121 19" stroke="#1E3C61" strokeWidth="2" strokeLinecap="round" />
          <rect x="82" y="112" width="44" height="10" rx="2" fill="#FFFFFF" stroke="#182536" strokeWidth="2.5" />
          <rect x="85" y="102" width="40" height="10" rx="2" fill="#E8F5ED" stroke="#182536" strokeWidth="2.5" />
          <rect x="88" y="92" width="35" height="10" rx="2" fill="#FEA402" stroke="#182536" strokeWidth="2.5" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-start">
          <CapyMascot className="w-28 h-28" />
        </div>
      </div>

      <div className="-rotate-6 transform origin-left">
        <p className="text-sm font-semibold text-[#1E3C61] leading-snug italic">
          Grandes ideias<br />
          também nascem na<br />
          universidade.
        </p>
        <div className="h-1 w-28 bg-[#FEA402] rounded-full mt-1.5" />
      </div>
    </div>
  );
}
