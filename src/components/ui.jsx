// File responsibility: Defines a reusable React UI component shared across pages.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { Link } from 'react-router-dom'

// cn handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const buttonStyles = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-900',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus-visible:ring-offset-slate-900',
}

// Card handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden',
        'dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

// SoftCard handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function SoftCard({ className = '', children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-slate-50 p-4',
        'dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Eyebrow handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function Eyebrow({ children, className = '' }) {
  return (
    <p className={cn('text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400', className)}>
      {children}
    </p>
  )
}

export function SectionHeader({ title, actions, className = '' }) {
  return (
    <div className={cn('flex flex-col gap-2 md:flex-row md:items-center md:justify-between', className)}>
      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-xl">{title}</h2>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

const toneStyles = {
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  slate: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  sky: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',
}

// StatCard handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function StatCard({ icon: Icon, label, value, help, tone = 'emerald', className = '' }) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{value}</p>
          {help ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{help}</p> : null}
        </div>
        {Icon ? (
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg", toneStyles[tone] || toneStyles.slate)}>
            <Icon />
          </span>
        ) : null}
      </div>
    </Card>
  )
}

export function PageHeader({
  title,
  actions,
  meta = [],
  className = '',
}) {
  return (
    <div className={cn('pb-3 border-b border-slate-200 dark:border-slate-800', className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-2xl">
            {title}
          </h1>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>

      {meta.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2 md:gap-4">
          {meta.map((item, index) => (
            <span
              key={`${item.label}-${index}`}
              className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400"
            >
              <span className="font-medium mr-1 text-slate-900 dark:text-slate-200">{item.label}:</span>
              <span>{item.value}</span>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

// StatusBadge handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function StatusBadge({ status, className = '' }) {
  const value = String(status || 'unknown').toLowerCase()

  let palette = 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'
  if (['approved', 'accepted', 'active', 'delivered', 'paid', 'verified'].some((item) => value.includes(item))) {
    palette = 'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/40'
  } else if (['shipped', 'transit', 'processing'].some((item) => value.includes(item))) {
    palette = 'bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-950/30 dark:text-sky-300 dark:ring-sky-900/40'
  } else if (['declined', 'rejected', 'cancelled', 'failed'].some((item) => value.includes(item))) {
    palette = 'bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-900/40'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1',
        palette,
        className,
      )}
    >
      {status}
    </span>
  )
}

// FormField handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function FormField({ label, icon: Icon, hint, children, className = '' }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {Icon ? <Icon className="text-emerald-600 dark:text-emerald-300" /> : null}
        {label}
      </span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-slate-500 dark:text-slate-400">{hint}</span> : null}
    </label>
  )
}

// Input handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function Input({ className = '', ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-900',
        className,
      )}
      {...props}
    />
  )
}

// Select handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={cn(
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition duration-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-900',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

// Textarea handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={cn(
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-900',
        className,
      )}
      {...props}
    />
  )
}

// SkeletonBlock handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function SkeletonBlock({ className = '' }) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800/80', className)} />
}

// EmptyState handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <Card className={cn('flex flex-col items-center px-6 py-10 text-center', className)}>
      {Icon ? (
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-50 text-2xl text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/40">
          <Icon />
        </span>
      ) : null}
      <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      {action ? (
        action.to ? (
          <Link to={action.to} className={cn(buttonStyles.secondary, 'mt-5')}>
            {action.label}
          </Link>
        ) : (
          <button type="button" onClick={action.onClick} className={cn(buttonStyles.secondary, 'mt-5')}>
            {action.label}
          </button>
        )
      ) : null}
    </Card>
  )
}

// ActionCard handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function ActionCard({ to, onClick, icon: Icon, title, description, meta, className = '' }) {
  const shared = cn(
    'group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800/50',
    className,
  )

  const body = (
    <>
      {Icon ? (
        <span className="flex h-10 w-10 shrink-0 transition-colors items-center justify-center rounded-lg bg-emerald-50 text-xl text-emerald-600 group-hover:bg-emerald-100 dark:bg-slate-800 dark:text-emerald-400 dark:group-hover:bg-slate-700">
          <Icon />
        </span>
      ) : null}
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      {meta ? <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">{meta}</p> : null}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={shared}>
        {body}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={shared}>
      {body}
    </button>
  )
}


