import { Container, Nav, Navbar, Form, Button, NavDropdown, Row, Dropdown, Col } from 'react-bootstrap';
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeContext } from '@/pages/_app';
import { languageAtom, isBlockedAtom, userAtom } from '@/store';
import { useAtom } from 'jotai';
import { getLanguage } from '@/lib/userData';
import { setThemeCookie, getThemeCookie, getLanguageCookie, setLanguageCookie, checkValidLogin, removeUserCookie } from "@/lib/cookies";
import { BlinkBlur } from 'react-loading-indicators';

export default function MainNavbar() {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);

    const pathname = usePathname();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [language, setLanguage] = useAtom(languageAtom);
    const [user, setUser] = useAtom(userAtom);

    //dummy user profile
    const userProfile = "user_default.png";

    const imgPath = "/images/";
    const languages = {
        "EN": {"img": "flag_us.png", "name": "English"},
        "FR": {"img": "flag_fr.png", "name": "Français"},
    };

    async function updateAtoms() {
        setLanguage(await getLanguage()); 

        //set user
        setUser(await checkValidLogin());
    }

    //handle language change
    async function handleChangeLanguage(abbr) {
        //change set language
        setLanguage(abbr);
        //set language cookie
        setLanguageCookie(abbr);

        //change language
    }

    useEffect(() => {
        //update atoms
        updateAtoms();
    }, []);

    return (
        <>
            <div className={isBlocked ? "blocker" : ""}>
            {
                isBlocked ?
                (
                    <div className='loading'>
                        <BlinkBlur size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
                    </div>
                )
                : (
                    <></>
                )
            }
            </div>
            <Navbar expand="md" className={theme === "dark" ? "fixed-top nav-border navbar-dark bg-navbar-dark px-5" : "fixed-top nav-border bg-light px-5"}>
                <Navbar.Brand><Nav.Link href='/'>TravelWise</Nav.Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                    {
                        user ? 
                        (<>
                            <Nav.Link href='/'>Home</Nav.Link>
                            <Nav.Link href='/itinerary/'>My Trips</Nav.Link>
                            <NavDropdown menuVariant={theme} title="Explore">
                                <NavDropdown.Item href="/search/flight">Search Flights</NavDropdown.Item>
                                <NavDropdown.Item href="/search/hotel">Search Hotels</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href='/'>Guides</Nav.Link>
                            <Nav.Link href='/'>Support</Nav.Link>
                            <NavDropdown title={<span><Image className='d-inline' src={imgPath + userProfile} alt="avatar" width={24} height={24} /></span>} menuVariant={theme}>
                                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                                <NavDropdown.Item href="/">
                                    <div onClick={(e)=>{removeUserCookie()}}>Logout</div>
                                </NavDropdown.Item>
                            </NavDropdown>
                        </>)
                        :
                            pathname === "/login" ? 
                            (<Nav.Link href='/register'>Signup</Nav.Link>) :
                            (<Nav.Link href='/login'>Login</Nav.Link>)
                    }
                        <Dropdown>
                            <Dropdown.Toggle variant={theme}>
                                <Image className='d-inline me-2' src={imgPath + languages[language]?.img} alt="avatar" width={24} height={24} style={{ borderRadius: '50%' }} />
                                <label>{language}</label>
                            </Dropdown.Toggle>

                            <Dropdown.Menu variant={theme}>
                            {
                                Object.keys(languages).map((abbr, index) => (
                                    <Dropdown.Item className={language === abbr ? 'active' : ''} onClick={() => handleChangeLanguage(abbr)} key={index}>
                                        <Image className='d-inline me-2' src={imgPath + languages[abbr]?.img} alt="avatar" width={24} height={24} style={{ borderRadius: '50%' }} />
                                        <label>{languages[abbr]?.name}</label>
                                    </Dropdown.Item>
                                ))
                            }
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}
