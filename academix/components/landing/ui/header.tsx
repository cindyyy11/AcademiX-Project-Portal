import Link from 'next/link'
import ThemeToggle from './theme-toggle'

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 w-full z-30 bg-background border-b border-n-1 dark:bg-n-2 dark:border-white">
      <div className="max-w-6xl mx-auto px-4 land-sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
            <img src="/images/AcademiX_Logo.png" alt="AcademiX Logo" className="block" style={{ width: "150px" }} />
          </div>
          {/* Navigation */}
          <nav className="flex grow items-center">
            <ul className="flex-grow flex justify-end items-center space-x-4">
              <li>
                <ThemeToggle />
              </li>
              <li>
                <Link href="/Auth/login" className="btn-purple">
                  Sign In
                </Link>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </header>
  )
}
