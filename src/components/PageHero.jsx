import { Link } from 'react-router-dom'
import AgriIllustration from './AgriIllustration'
import Reveal from './Reveal'
import BrandLogo from './BrandLogo'
import { Card, StatCard, buttonStyles, cn } from './ui'

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
  return (
    <Reveal>
      <Card
        className={cn(
          'relative overflow-hidden border-emerald-200 bg-[radial-gradient(circle_at_top_left,_rgba(220,252,231,0.8),_transparent_34%),linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(240,253,244,0.9))] p-6 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(17,24,39,0.94))] md:p-8',
          className,
        )}
      >
        <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-emerald-100/80 blur-3xl dark:bg-emerald-500/15" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-slate-100/80 blur-3xl dark:bg-slate-700/60" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            {brand && <BrandLogo size="sm" className="mb-4" />}
            {badge ? (
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-900/40 dark:bg-slate-800/90 dark:text-emerald-300">
                {badge}
              </p>
            ) : null}
            {eyebrow ? <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">{eyebrow}</p> : null}
            <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100 md:text-5xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">{description}</p>

            {actions.length > 0 && <div className="mt-6 flex flex-wrap gap-3">{actions.map(renderAction)}</div>}

            {stats.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:max-w-2xl xl:grid-cols-3">
                {stats.map((stat, index) => (
                  <StatCard
                    key={`${stat.label}-${index}`}
                    label={stat.label}
                    value={stat.value}
                    help={stat.help}
                    tone={index === 1 ? 'slate' : 'emerald'}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="media-frame">
              <AgriIllustration variant={variant} />
            </div>
          </div>
        </div>
      </Card>
    </Reveal>
  )
}
