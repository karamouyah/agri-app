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
  subtitle = 'Agricultural Intelligence',
  className = '',
  textClassName = '',
}) {
  const scale = sizeMap[size] || sizeMap.md

  return (
    <div className={`inline-flex items-center ${scale.shell} ${className}`}>
      <span
        className={`relative inline-flex ${scale.mark} items-center justify-center overflow-hidden rounded-2xl shadow-[0_16px_32px_rgba(22,101,52,0.18)] ring-1 ring-emerald-100 dark:ring-slate-700`}
        aria-hidden="true"
      >
        <img
          src="/agri-logo.svg"
          alt=""
          className="relative z-10 h-full w-full object-contain p-[3px]"
          loading="eager"
        />
      </span>

      {showText && (
        <span className={`min-w-0 ${textClassName}`}>
          <span className={`block font-display font-extrabold text-slate-900 dark:text-slate-100 ${scale.title}`}>AgriGov Market</span>
          <span className={`block font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300 ${scale.subtitle}`}>
            {subtitle}
          </span>
        </span>
      )}
    </div>
  )
}
