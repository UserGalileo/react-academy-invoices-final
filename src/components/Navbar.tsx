import { NavLink } from 'react-router-dom';

export function Navbar() {
  return (
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <div className="navbar-nav">
            <NavLink
                to="/"
                end={true}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >Home
            </NavLink>
            <NavLink
                to="/invoices"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >Invoices
            </NavLink>
          </div>
        </div>
      </nav>
  )
}
