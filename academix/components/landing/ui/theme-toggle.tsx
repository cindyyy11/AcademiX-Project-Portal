'use client'

import { useEffect, useState } from 'react'
import Icon from '@/components/Icon'

type Theme = 'light' | 'dark'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme')
    if (current === 'dark' || current === 'light') {
      setTheme(current)
    }
  }, [])

  const applyTheme = (next: Theme) => {
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch (e) {
      // localStorage unavailable, theme just won't persist
    }
  }

  return (
    <div
      className={`relative flex w-14 h-6.5 rounded-sm border border-n-1 overflow-hidden shrink-0 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1/2 before:bg-purple-1 before:transition-all dark:border-white ${theme === 'dark' ? 'before:translate-x-full' : ''
        }`}
    >
      <button type="button" className="grow text-0" aria-label="Switch to light mode" onClick={() => applyTheme('light')}>
        <Icon className="relative z-1 fill-n-1 transition-color dark:fill-white" name="sun" />
      </button>
      <button type="button" className="grow text-0" aria-label="Switch to dark mode" onClick={() => applyTheme('dark')}>
        <Icon className="relative z-1 fill-n-1 transition-color dark:fill-white" name="moon" />
      </button>
    </div>
  )
}
