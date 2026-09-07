'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export default function DesktopMenu() {
  const [desktopNavOpen, setDesktopNavOpen] = useState<boolean>(false)

  const trigger = useRef<HTMLButtonElement>(null)
  const desktopNav = useRef<HTMLDivElement>(null)

  // close the desktop menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!desktopNav.current || !trigger.current) return;
      if (!desktopNavOpen || desktopNav.current.contains(target as Node) || trigger.current.contains(target as Node)) return;
      setDesktopNavOpen(false)
    };
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  }, [desktopNavOpen])

  // close the desktop menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!desktopNavOpen || keyCode !== 27) return;
      setDesktopNavOpen(false)
    };
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  }, [desktopNavOpen])

  return (
    <div className="md:block">
      {/* Desktop menu button */}
      <button
        ref={trigger}
        className={`menu-button ${desktopNavOpen ? 'active' : ''}`}
        aria-controls="desktop-nav"
        aria-expanded={desktopNavOpen}
        onClick={() => setDesktopNavOpen(!desktopNavOpen)}
      >
        <span className="sr-only">Menu</span>
        <svg
          className="w-6 h-6 fill-current text-gray-800 hover:text-gray-600 transition duration-150 ease-in-out"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="4" width="24" height="2" rx="1" />
          <rect y="11" width="24" height="2" rx="1" />
          <rect y="18" width="24" height="2" rx="1" />
        </svg>
      </button>

      {/* Desktop navigation */}
      <nav
        id="desktop-nav"
        ref={desktopNav}
        className={`absolute top-full z-20 left-0 w-full px-4 sm:px-6 overflow-hidden transition-all duration-300 ease-in-out ${desktopNavOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-80'}`}
      >
        <ul className="bg-white px-4 py-2">
          <li>
            <Link href="/signin" className="flex font-medium w-full text-purple-600 hover:text-gray-800 py-2 justify-center" onClick={() => setDesktopNavOpen(false)}>
              Sign in
            </Link>
          </li>
          <li>
            <Link
              href="/signup"
              className="font-medium w-full inline-flex items-center justify-center border border-transparent px-4 py-2 my-2 rounded-sm text-white bg-purple-600 hover:bg-purple-700 transition duration-150 ease-in-out" onClick={() => setDesktopNavOpen(false)}
            >
              Sign up
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
