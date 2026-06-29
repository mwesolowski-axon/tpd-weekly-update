import { Link, useLocation } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Latest' },
  { to: '/archive', label: 'Archive' },
]

const iconUrl = `${import.meta.env.BASE_URL}icon.png?v=${import.meta.env.VITE_ICON_VERSION}`

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900 text-white shadow-md">
        <div className="mx-auto max-w-5xl px-4 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="shrink-0 bg-transparent transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Home, Axon Weekly Update"
            >
              <img
                src={iconUrl}
                alt=""
                className="h-40 w-40 object-contain bg-transparent"
              />
            </Link>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Tucson Police Department</p>
              <h1 className="text-2xl font-bold">Axon Weekly Update</h1>
            </div>
          </div>
          <nav className="flex gap-1">
            {nav.map((item) => {
              const active =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500">
        Tucson Police Department, Axon Program Weekly Updates
      </footer>
    </div>
  )
}
