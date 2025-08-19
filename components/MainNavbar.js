import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

// Replace this with real auth logic or pass as prop
const isLoggedIn = false;

export default function MainNavbar({ loggedIn } = {}) {
    const auth = typeof loggedIn === 'boolean' ? loggedIn : isLoggedIn;

    if (!auth) {
        return (
            <header className="main-navbar">
                <Link href="/" className="brand-link">
                    <span className="brand">TravelWise</span>
                </Link>
                <div className="nav-right">
                    <Link href="/login" className="login-button">Log in</Link>
                </div>
            </header>
        );
    }

    return (
        <header className="main-navbar">
            <Link href="/" className="brand-link">
                <span className="brand">TravelWise</span>
            </Link>

            <nav className="nav-links">
                <Link href="#" className="nav-link">My Trips</Link>
                <Link href="#" className="nav-link">Explore</Link>
                <Link href="#" className="nav-link">Guides</Link>
                <Link href="#" className="nav-link">Support</Link>
            </nav>

            <div className="nav-right">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input className="search-input" type="text" placeholder="Search" />
                </div>
                <button className="icon" aria-label="notifications">🔔</button>
                <Image src="/avatar.jpg" alt="avatar" width={32} height={32} className="avatar" />
            </div>
        </header>
    );
}
