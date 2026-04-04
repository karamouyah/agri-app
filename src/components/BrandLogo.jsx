const sizeMap = {
  sm: {
    shell: 'gap-2.5',
    mark: 'h-10 w-10',
    title: 'text-base',
    subtitle: 'text-[10px]',
  },
  md: {
    shell: 'gap-3',
    mark: 'h-12 w-12',
    title: 'text-lg',
    subtitle: 'text-[11px]',
  },
  lg: {
    shell: 'gap-3.5',
    mark: 'h-14 w-14',
    title: 'text-xl',
    subtitle: 'text-xs',
  },
}

export default function BrandLogo({
  size = 'md',
  showText = true,
  subtitle = 'Direct Agricultural Trade',
  className = '',
  textClassName = '',
}) {
  const scale = sizeMap[size] || sizeMap.md

  return (
    <div className={`inline-flex items-center ${scale.shell} ${className}`}>
      <span
        className={`relative inline-flex ${scale.mark} items-center justify-center overflow-hidden rounded-[1.35rem] shadow-[0_16px_34px_rgba(43,111,61,0.22)]`}
        aria-hidden="true"
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(255,255,255,0.38),transparent_36%),linear-gradient(155deg,#16492f_0%,#237343_52%,#77c76b_100%)]" />
        <span className="absolute inset-[1px] rounded-[1.25rem] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent)]" />

        <svg viewBox="0 0 64 64" className="relative z-10 h-[74%] w-[74%]" fill="none" aria-hidden="true">
          <circle cx="19" cy="17" r="7" fill="#F2C96E" />

          <path
            d="M8 42c8-6 16-8 24-8s16 2 24 8"
            stroke="#F7FBEF"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M10 47c7-4 14-6 22-6 8 0 15 2 22 6"
            stroke="#DCEFC9"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M14 52c6-3 12-4 18-4 6 0 12 1 18 4"
            stroke="#B9DD94"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.95"
          />

          <path
            d="M24 39c0-9.4 5.8-15.6 14.8-18.4 3.4 9.8.4 17.8-7.9 21.4-2.7 1.1-5.1 1-6.9-.2V39Z"
            fill="#F7FCEB"
          />
          <path
            d="M38.4 18.8c5.8 1.7 9.8 5.8 12.4 12-6.2 3-11.6 2.6-16-1 1-4.2 2.2-7.7 3.6-11Z"
            fill="#D8F0C4"
          />
          <path
            d="M35.2 22.4c-1 4.8-1.4 10-1.1 17.4"
            stroke="#F7FCEB"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          <path
            d="M47.5 19v19.5"
            stroke="#F6FAEC"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M47.5 22.5 43.8 25" stroke="#F6FAEC" strokeWidth="2" strokeLinecap="round" />
          <path d="M47.5 26.5 51.2 24" stroke="#F6FAEC" strokeWidth="2" strokeLinecap="round" />
          <path d="M47.5 28.6 43.6 31.1" stroke="#F6FAEC" strokeWidth="2" strokeLinecap="round" />
          <path d="M47.5 32.5 51.4 30" stroke="#F6FAEC" strokeWidth="2" strokeLinecap="round" />
          <path d="M47.5 34.7 43.8 37.2" stroke="#F6FAEC" strokeWidth="2" strokeLinecap="round" />
          <path d="M47.5 38.5 51 36.2" stroke="#F6FAEC" strokeWidth="2" strokeLinecap="round" />

          <circle cx="15.5" cy="53" r="3" fill="#E8B85B" />
        </svg>
      </span>

      {showText && (
        <span className={`min-w-0 ${textClassName}`}>
          <span
            className={`block font-['Sora'] font-extrabold tracking-[-0.03em] text-[var(--text-strong)] ${scale.title}`}
          >
            AgriGov Market
          </span>
          <span
            className={`block font-semibold uppercase tracking-[0.22em] text-emerald-700/90 ${scale.subtitle}`}
          >
            {subtitle}
          </span>
        </span>
      )}
    </div>
  )
}
