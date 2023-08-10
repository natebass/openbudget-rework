import React from "react"
import {Link, Outlet} from "react-router-dom"

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link className="mx-2" to="/">Home</Link>
            <Link className="mx-2" to="/compare">Comparison</Link>
            <Link className="mx-2" to="/budget-flow">Overview</Link>
            <Link className="mx-2" to="/budget-tree">Detail</Link>
          </li>
        </ul>
      </nav>
      <div className="container mx-auto">
        <Outlet/>
      </div>
    </>
  )
}

export default Layout
