import { Card, Form, Alert, Button, Container, Row, Col, Carousel, Image } from "react-bootstrap";
import { useRouter } from "next/router";
import { authenticateUser } from "@/lib/authenticate";
import { useContext, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { languageAtom } from "@/store";
import { ThemeContext } from "./_app";
import Link from "next/link";

export default function Login(props){
    const router = useRouter();
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [warning, setWarning] = useState(null);
    const { theme } = useContext(ThemeContext);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await authenticateUser(user, password);
            await updateAtoms(); 
            router.push('/home');
        } catch (err) {
            setWarning(err.message);
        }
    }

    async function updateAtoms() {
        // setFavouritesList(await getFavourites()); 
        // setSearchHistory(await getHistory());
    }

    useEffect(() => {
        updateAtoms();
    }, []);

    return (
    <>
        <Row className="d-flex justify-content-center align-items-center m-0 p-0">
            <Col md={8} xs={0}>
            <Carousel className="d-none d-md-block" data-bs-theme={theme === "dark" ? "light" : "dark"}>
                <Carousel.Item>
                    <Row className="justify-content-center align-items-center">
                        <Image className="w-50" fluid src="/favicon.ico" alt="carousel-img" />
                    </Row>
                    <Carousel.Caption>
                        <h3>
                            Caption 1
                        </h3>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Row className="justify-content-center align-items-center">
                        <Image className="w-50" fluid src="/favicon.ico" alt="carousel-img" />
                    </Row>
                    <Carousel.Caption>
                        <h3>
                            Caption 2
                        </h3>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Row className="justify-content-center align-items-center">
                        <Image className="w-50" fluid src="/favicon.ico" alt="carousel-img" />
                    </Row>
                    <Carousel.Caption>
                        <h3>
                            Caption 3
                        </h3>
                    </Carousel.Caption>
                </Carousel.Item>
                </Carousel>
            </Col>
            <Col md={4} xs={12} className="px-5 px-md-3 px-lg-5">
                <h2 className="text-center">Welcome back</h2>
                <Form className="mt-4" onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Email</Form.Label><Form.Control type="text" placeholder="Enter your Email" id="userName" name="userName" onChange={e => setUser(e.target.value)} />
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Form.Label>Password</Form.Label><Form.Control type="password" placeholder="Enter your Password" id="password" name="password" onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                    <br />
                    <Link className="text-link" href="/">Forgot password?</Link>
                    <br /><br />
                    <Button variant="primary" className="w-100 rounded-pill" type="submit">Login</Button>
                    <br />
                    <Row className="mt-2">
                        <Col className="d-flex justify-content-center align-items-center">
                            <small className="me-2 text-gray-400">Don&apos;t have an account?</small>
                            <Link className="text-link" href="/"><small>Signup</small></Link>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
    </>
    );
}