import React from 'react';
import Image from 'next/image';
// Dummy authentication state (replace with real auth logic)
const isLoggedIn = false;

export default function Navbar() {
    if (!isLoggedIn) {
        return (
            <nav style={{
                background: '#181A20',
                borderBottom: '1px solid #fff1',
                padding: '0 0',
                width: '100%',
                minHeight: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 32 }}>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: 22 }}>TravelWise</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginRight: 32 }}>
                    <button style={{
                        background: '#23262F',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 24,
                        padding: '8px 24px',
                        fontWeight: 500,
                        fontSize: 16,
                        cursor: 'pointer',
                        marginRight: 8,
                    }}>Log in</button>
                    <div style={{
                        background: '#23262F',
                        color: '#fff',
                        borderRadius: 24,
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                    }}>
                        <span role="img" aria-label="US Flag">🇺🇸</span>
                        <span style={{ fontSize: 16 }}>EN</span>
                        <svg width="16" height="16" fill="#fff" style={{ marginLeft: 4 }} viewBox="0 0 16 16"><path d="M4.646 6.646a.5.5 0 0 1 .708 0L8 9.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z" /></svg>
                    </div>
                </div>
            </nav>
        );
    }
    return (
        <nav style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee', background: '#fff' }}>
            <span style={{ fontWeight: 'bold', marginRight: '2rem', fontSize: '1.2rem' }}>TravelWise</span>
            <a href="#" style={{ marginRight: '1.5rem', color: '#222', textDecoration: 'none' }}>My Trips</a>
            <a href="#" style={{ marginRight: '1.5rem', color: '#222', textDecoration: 'none' }}>Explore</a>
            <a href="#" style={{ marginRight: '1.5rem', color: '#222', textDecoration: 'none' }}>Guides</a>
            <a href="#" style={{ marginRight: '1.5rem', color: '#222', textDecoration: 'none' }}>Support</a>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '8px', top: '8px', color: '#888' }}>🔍</span>
                    <input type="text" placeholder="Search" style={{ padding: '8px 8px 8px 32px', borderRadius: '8px', border: 'none', background: '#f3f5f7', outline: 'none' }} />
                </div>
                <span style={{ fontSize: '1.2rem', color: '#888' }}>🔔</span>
                <Image src="/avatar.jpg" alt="avatar" width={32} height={32} style={{ borderRadius: '50%' }} />
            </div>
        </nav>
    );
}
