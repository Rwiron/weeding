import { NavLink, Outlet } from 'react-router-dom'

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        isActive ? 'text-rose-600 bg-rose-50' : 'text-gray-700 hover:text-rose-600 hover:bg-rose-50'
      }`
    }
  >
    {children}
  </NavLink>
)

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <nav className="sticky top-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Our Wedding
            </h1>
            <div className="hidden md:flex items-center gap-2">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/events">Events</NavItem>
              <NavItem to="/gallery">Gallery</NavItem>
              <NavItem to="/rsvp">RSVP</NavItem>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-serif mb-2">With Love,</p>
          <p className="text-xl font-semibold">The Happy Couple</p>
          <p className="text-gray-400 mt-4">© 2025 Our Wedding Website</p>
        </div>
      </footer>
    </div>
  )
}

export default RootLayout


