import { Link } from 'react-router-dom'

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const buttonStyles = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(22,101,52,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-[0_18px_34px_rgba(22,101,52,0.2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:focus-visible:ring-emerald-900',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/60 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:bg-slate-700 dark:hover:text-slate-50 dark:focus-visible:ring-emerald-900',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition duration-200 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus-visible:ring-emerald-900',
}

export function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-emerald-100/80 bg-white/90 shadow-[0_20px_55px_rgba(15,23,42,0.06)] backdrop-blur-sm transition duration-300',
        'dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-[0_20px_55px_rgba(2,6,23,0.45)]',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function SoftCard({ className = '', children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70 p-4 shadow-sm',
        'dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800/80 dark:text-slate-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Eyebrow({ children, className = '' }) {
  return (
    <p className={cn('text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300', className)}>
      {children}
    </p>
  )
}

export function SectionHeader({ eyebrow, title, description, actions, className = '' }) {
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-2xl">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  )
}

const toneStyles = {
  emerald: 'from-emerald-50 to-white text-emerald-700 ring-emerald-100 dark:from-emerald-950/50 dark:to-slate-900 dark:text-emerald-300 dark:ring-emerald-900/40',
  slate: 'from-slate-50 to-white text-slate-700 ring-slate-200 dark:from-slate-900 dark:to-slate-800 dark:text-slate-200 dark:ring-slate-700',
  sky: 'from-sky-50 to-white text-sky-700 ring-sky-100 dark:from-sky-950/30 dark:to-slate-900 dark:text-sky-300 dark:ring-sky-900/40',
}

export function StatCard({ icon: Icon, label, value, help, tone = 'emerald', className = '' }) {
  return (
    <Card
      className={cn(
        'bg-gradient-to-br p-4 ring-1',
        toneStyles[tone] || toneStyles.emerald,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          {help ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{help}</p> : null}
        </div>
        {Icon ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-lg shadow-sm ring-1 ring-emerald-100 dark:bg-slate-800 dark:ring-slate-700">
            <Icon />
          </span>
        ) : null}
      </div>
    </Card>
  )
}

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

export function SkeletonBlock({ className = '' }) {
  return <div className={cn('animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/80', className)} />
}

export function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <Card className={cn('flex flex-col items-center px-6 py-10 text-center', className)}>
      {Icon ? (
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/40">
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

export function ActionCard({ to, onClick, icon: Icon, title, description, meta, className = '' }) {
  const shared = cn(
    'group flex h-full flex-col rounded-2xl border border-emerald-100 bg-white/95 p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)]',
    'dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-emerald-500/30 dark:hover:shadow-[0_20px_40px_rgba(2,6,23,0.35)]',
    className,
  )

  const body = (
    <>
      {Icon ? (
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-lg text-emerald-700 ring-1 ring-emerald-100 transition duration-200 group-hover:scale-105 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/40">
          <Icon />
        </span>
      ) : null}
      <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      {meta ? <p className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300">{meta}</p> : null}
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
