import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import AgriIllustration from './AgriIllustration'
import Reveal from './Reveal'

function renderAction(action, index) {
  const classes =
    action.kind === 'secondary'
      ? 'btn-secondary px-4 py-3 text-sm'
      : 'btn-primary px-4 py-3 text-sm'

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
      <section className={`surface-card section-shell relative overflow-hidden p-6 md:p-8 ${className}`}>
        <div className="absolute -left-14 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-lime-200/30 blur-3xl" />
        <div className="absolute -right-14 top-12 h-48 w-48 rounded-full bg-amber-100/45 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
          <div>
            {brand && <BrandLogo size="sm" className="mb-4" />}
            {badge ? <p className="badge-soft px-3 py-1 text-xs">{badge}</p> : null}
            {eyebrow ? (
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
            ) : null}
            <h2 className="mt-2 max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">{description}</p>

            {actions.length > 0 && <div className="mt-6 flex flex-wrap gap-3">{actions.map(renderAction)}</div>}

            {stats.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:max-w-2xl xl:grid-cols-3">
                {stats.map((stat, index) => (
                  <article key={`${stat.label}-${index}`} className="surface-muted lift-card px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
                    {stat.help ? <p className="mt-1 text-xs text-slate-500">{stat.help}</p> : null}
                  </article>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="media-shell float-gentle">
              <AgriIllustration variant={variant} />
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}
