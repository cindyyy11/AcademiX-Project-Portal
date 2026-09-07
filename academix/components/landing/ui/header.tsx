import Link from 'next/link'
import MobileMenu from './mobile-menu'

export default function Header() {
  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
            <div className="shrink-0 mr-4">
          {/* Logo */}
          <img src="/images/AcademiX_Logo.png" alt="AcademiX Logo" className="block" style={{width:"150px"}} />
          </div>
          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow items-center">
            {/* Desktop sign in links */}
            <ul className="flex-grow flex justify-end items-center space-x-4">
              <li>
                {/* Make sure to add the link */}
                <Link href="http://localhost:3000/Auth/login" passHref>
                  <span className="btn-sm text-white bg-purple-600 hover:bg-purple-700">
                    Sign In
                  </span>
                </Link>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </header>
  )
}
