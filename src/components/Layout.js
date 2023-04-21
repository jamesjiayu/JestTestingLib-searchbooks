import React from "react"
import Header from "./Header"
import { Routes, Route, useLocation } from "react-router-dom"
import Search from "./Search"
import Wishlist from "./Wishlist"

export const LocationDisplay = () => {
    const location = useLocation()

    return <div data-testid="location-display">{location.pathname}</div>
}

const Layout = () => {
    return (
        <div>
            <LocationDisplay />
            <Header />

            <main>
                <Routes>
                    <Route path="/" element={<Search />} />
                    <Route path="search" element={<Search />} />
                    <Route path="wishlist" element={<Wishlist />} />
                </Routes>

            </main>

        </div>
    )
}

export default Layout
