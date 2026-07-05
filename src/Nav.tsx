import { Menu } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS: Array<{ label: string; to: string | null }> = [
  { label: 'Technology', to: '/technology' },
  { label: 'Products', to: null },
  { label: 'Research', to: null },
  { label: 'Contact', to: null },
]

export default function Nav() {
  const { pathname } = useLocation()
  const pill = (active: boolean) =>
    `${active ? 'text-white' : 'text-white/80'} px-4 py-1.5 rounded-full text-sm font-medium`

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
      <Link to="/" className="flex items-center gap-2">
        <svg
          width="26"
          height="26"
          viewBox="0 0 256 256"
          fill="#ffffff"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
        </svg>
        <span className="text-white text-2xl font-playfair italic">Agile Hand</span>
      </Link>

      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
        <Link to="/" className={pill(pathname === '/')}>
          Overview
        </Link>
        {NAV_LINKS.map(({ label, to }) =>
          to ? (
            <Link key={label} to={to} className={pill(pathname === to)}>
              {label}
            </Link>
          ) : (
            <a key={label} href="#demo" className={pill(false)}>
              {label}
            </a>
          ),
        )}
      </div>

      <a
        href="#demo"
        className="hidden lg:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full"
      >
        Request a Demo
      </a>

      <button className="lg:hidden text-white p-2" aria-label="Open menu">
        <Menu size={24} />
      </button>
    </nav>
  )
}
