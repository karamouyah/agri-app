// File responsibility: Defines a reusable React UI component shared across pages.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { Link } from 'react-router-dom'
import AgriIllustration from './AgriIllustration'
import BrandLogo from './BrandLogo'
import { Card, buttonStyles, cn } from './ui'

// renderAction handles this module workflow, using its parameters and returning JSX, data, or a service result.
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
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 md:p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm',
        className,
      )}
    >
      <div className={cn('relative grid gap-4', isWorkspaceHero ? 'lg:grid-cols-[1.2fr_280px] lg:items-start' : 'lg:grid-cols-[1.1fr_0.9fr] lg:items-center')}>
        <div>
          {brand && <BrandLogo size="sm" className="mb-4" />}
          {badge ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {badge}
            </span>
          ) : null}
          <h1 className={cn('max-w-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100', isWorkspaceHero ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl')}>
            {title}
          </h1>

          {actions.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{actions.map(renderAction)}</div>}

          {stats.length > 0 && (
            <div className={cn('mt-8 grid gap-4 border-t border-slate-200 pt-6 dark:border-slate-800', isWorkspaceHero ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:max-w-xl')}>
              {stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`}>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{stat.value}</p>
                  {stat.help ? <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{stat.help}</p> : null}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={cn(isWorkspaceHero ? 'hidden lg:block' : 'hidden lg:block')}>
          <div className="flex h-full items-center justify-end">
            <AgriIllustration variant={variant} />
          </div>
        </div>
      </div>
    </div>
  )
}
