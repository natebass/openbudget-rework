import React from "react"
import {Link, Outlet} from "react-router-dom"

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
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
