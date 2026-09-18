import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="py-12 land-md:py-16">
        <div className="max-w-6xl mx-auto px-4 land-sm:px-6">

          {/* Top area: Blocks */}
          <div className="grid land-md:grid-cols-12 gap-8 land-lg:gap-20 mb-8 land-md:mb-12">

            {/* 1st block */}
            <div className="land-md:col-span-4 land-lg:col-span-5">
              <div className="mb-2">
                {/* Logo */}
                <Link href="/" className="inline-block" aria-label="AcademiX">
                  <img src="/images/AcademiX_Logo.png" alt="AcademiX Logo" style={{ width: "130px" }} />
                </Link>
              </div>
              <div className="text-n-3">Welcome to AcademiX, where education meets efficient project management. Our platform streamlines academic projects with intuitive tools that empower collaboration, organization, and innovation. Join us in shaping the future of education through seamless project coordination.</div>
            </div>

            {/* 2nd and 3rd blocks */}
            <div className="land-md:col-span-8 land-lg:col-span-7 grid land-sm:grid-cols-2 gap-8">

              {/* 2nd block */}
              <div className="text-sm">
                <h6 className="text-n-1 font-medium mb-1">Product</h6>
                <ul>
                  <li className="mb-1">
                    <Link href="/#features" className="text-n-3 hover:text-n-1 transition duration-150 ease-in-out">Features</Link>
                  </li>
                  <li className="mb-1">
                    <Link href="/#how-it-works" className="text-n-3 hover:text-n-1 transition duration-150 ease-in-out">How it works</Link>
                  </li>
                </ul>
              </div>

              {/* 3rd block */}
              <div className="text-sm">
                <h6 className="text-n-1 font-medium mb-1">Get started</h6>
                <ul>
                  <li className="mb-1">
                    <Link href="/signup" className="text-n-3 hover:text-n-1 transition duration-150 ease-in-out">Create an account</Link>
                  </li>
                  <li className="mb-1">
                    <Link href="/Auth/login" className="text-n-3 hover:text-n-1 transition duration-150 ease-in-out">Sign in</Link>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Bottom area */}
          <div className="land-md:flex land-md:items-center land-md:justify-between">

            {/* Copyrights note */}
            <div className="text-n-3 text-sm">© {new Date().getFullYear()} AcademiX. All rights reserved.</div>

          </div>

        </div>
      </div>
    </footer>
  )
}
