import { CapyMascot } from './CapyMascot';

export function CapyLoginIllustration({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative select-none ${compact ? 'inline-block' : 'flex items-center gap-4 pt-4'}`}>
      <div className={`relative overflow-hidden rounded-full border-[2px] border-[#182536] bg-[#FAF7F2] shadow-[8px_8px_0_#FEA402] ${compact ? 'h-[300px] w-[300px]' : 'h-32 w-32'} `}>
        <div className="absolute inset-x-0 bottom-0 left-0 right-0 mx-auto h-[16px] w-24 rounded-full bg-[#EAF0F5]" />
        <div className={`relative flex h-full w-full items-end justify-center ${compact ? 'pb-0' : 'pb-0'}`}>
          <CapyMascot className={compact ? 'h-[240px] w-[240px]' : 'h-28 w-28'} />
        </div>
      </div>

      {!compact && (
        <div className="-rotate-6 transform origin-left">
          <p className="text-sm font-semibold leading-snug text-[#1E3C61] italic">
            Grandes ideias<br />
            também nascem na<br />
            universidade.
          </p>
          <div className="mt-1.5 h-1 w-28 rounded-full bg-[#FEA402]" />
        </div>
      )}
    </div>
  );
}
