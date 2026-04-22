import { Link } from 'react-router-dom'
import AgriIllustration from './AgriIllustration'
import Reveal from './Reveal'
import BrandLogo from './BrandLogo'
import { Card, buttonStyles, cn } from './ui'

function renderAction(action, index) {
  const classes =
    action.kind === 'secondary'
      ? cn(buttonStyles.secondary, 'px-4 py-3')
      : cn(buttonStyles.primary, 'px-4 py-3')

  if (action.to) {
    return (
      <Link key={`${action.label}-${index}`} to={action.to} className={classes}>
        <span className="inline-flex items-center gap-2">
          {action.icon ? <action.icon /> : null}
          {action.label}
        </span>
      </Link>
    )
  }

  return (
    <button
      key={`${action.label}-${index}`}
      type={action.type || 'button'}
      onClick={action.onClick}
      disabled={action.disabled}
      className={classes}
    >
      <span className="inline-flex items-center gap-2">
        {action.icon ? <action.icon /> : null}
        {action.label}
      </span>
    </button>
  )
}

export default function PageHero({
  eyebrow,
  title,
  description,
  badge,
  actions = [],
  stats = [],
  variant = 'hero',
  className = '',
  brand = false,
}) {
  const isWorkspaceHero = !brand

  return (
    <Reveal>
      <Card
        className={cn(
          'relative overflow-hidden border-slate-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-5 dark:border-slate-800 dark:bg-[linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(15,23,42,0.92))] md:p-6',
          className,
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent dark:via-emerald-900/50" />

        <div className={cn('relative grid gap-6', isWorkspaceHero ? 'lg:grid-cols-[1.2fr_280px] lg:items-start' : 'lg:grid-cols-[1.1fr_0.9fr] lg:items-center')}>
          <div>
            {brand && <BrandLogo size="sm" className="mb-4" />}
            {badge ? (
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-300">
                {badge}
              </p>
            ) : null}
            {eyebrow ? <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">{eyebrow}</p> : null}
            <h2 className={cn('mt-3 max-w-3xl font-bold leading-tight text-slate-900 dark:text-slate-100', isWorkspaceHero ? 'text-[1.9rem] md:text-[2.2rem]' : 'text-3xl md:text-[3.15rem]')}>
              {title}
            </h2>
            <p className={cn('mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300', isWorkspaceHero ? 'leading-6 md:text-[15px]' : 'leading-7 md:text-base')}>
              {description}
            </p>

            {actions.length > 0 && <div className="mt-6 flex flex-wrap gap-3">{actions.map(renderAction)}</div>}

            {stats.length > 0 && (
              <div className={cn('mt-5 grid gap-3', isWorkspaceHero ? 'sm:grid-cols-3' : 'sm:grid-cols-2 xl:max-w-2xl xl:grid-cols-3')}>
                {stats.map((stat, index) => (
                  <div
                    key={`${stat.label}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/85"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                    {stat.help ? <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">{stat.help}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={cn(isWorkspaceHero ? 'hidden lg:block' : '')}>
            <div className={cn('media-frame', isWorkspaceHero ? 'p-2.5' : '')}>
              <AgriIllustration variant={variant} />
            </div>
          </div>
        </div>
      </Card>
    </Reveal>
  )
}
