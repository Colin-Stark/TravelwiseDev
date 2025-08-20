import { Container, Nav, Navbar, Form, Button, NavDropdown, Row, Dropdown, Col } from 'react-bootstrap';
import React, { useContext, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeContext } from '@/pages/_app';
import { languageAtom } from '@/store';
import { useAtom } from 'jotai';
import { getLanguage } from '@/lib/userData';

// Dummy authentication state (replace with real auth logic)
const isLoggedIn = false;

export default function MainNavbar() {
    const pathname = usePathname();
    const { theme } = useContext(ThemeContext);
    const [language, setLanguage] = useAtom(languageAtom);
    //dummy user profile
    const userProfile = "user_default.png";

    const imgPath = "/images/";
    const languages = {
        "EN": {"img": "flag_us.png", "name": "English"},
        "FR": {"img": "flag_fr.png", "name": "Français"},
    };

    async function updateAtoms() {
        setLanguage(await getLanguage()); 
    }

    //handle language change
    async function handleChangeLanguage(abbr) {
        //change set language
        setLanguage(abbr);

        //change language
    }

    useEffect(() => {
        //load language
        updateAtoms();
    }, []);

    if (!isLoggedIn) {
        return (
            <>
                <Navbar className={theme === "dark" ? "fixed-top nav-border navbar-dark bg-dark" : "fixed-top nav-border"}>
                    <Container>
                        <Navbar.Brand>TravelWise</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                            {
                                isLoggedIn ? 
                                (<>
                                    <Nav.Link href='/'>Home</Nav.Link>
                                    <Nav.Link href='/'>My Trips</Nav.Link>
                                    <NavDropdown menuVariant={theme} title="Explore">
                                        <NavDropdown.Item href="/">Search Flights</NavDropdown.Item>
                                        <NavDropdown.Item href="/">Search Hotels</NavDropdown.Item>
                                        <NavDropdown.Item href="/">Search Transportation</NavDropdown.Item>
                                    </NavDropdown>
                                    <Nav.Link href='/'>Guides</Nav.Link>
                                    <Nav.Link href='/'>Support</Nav.Link>
                                    <NavDropdown title={<span><Image className='d-inline' src={imgPath + userProfile} alt="avatar" width={24} height={24} /></span>} menuVariant={theme}>
                                        <div className='text-center'>username</div>
                                        <NavDropdown.Divider menu_variant="dark" />
                                        <NavDropdown.Item href="/">Profile</NavDropdown.Item>
                                        <NavDropdown.Item href="/">Settings</NavDropdown.Item>
                                    </NavDropdown>
                                </>)
                                :
                                    pathname === "/register" ? 
                                    (<Nav.Link href='/login'>Login</Nav.Link>) :
                                    (<Nav.Link href='/register'>Signup</Nav.Link>)    
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
                    </Container>
                </Navbar>
            </>
        );
    }
}
