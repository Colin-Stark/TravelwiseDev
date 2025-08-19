import { Container, Nav, Navbar, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
// Dummy authentication state (replace with real auth logic)
const isLoggedIn = false;

export default function MainNavbar() {
    if (!isLoggedIn) {
        return (
            <Navbar className="fixed-top navbar-dark bg-dark">
                <Container>
                    <Navbar.Brand>TravelWise</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link href="/" passHref>
                                <Nav.Link>Home</Nav.Link>
                            </Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
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
