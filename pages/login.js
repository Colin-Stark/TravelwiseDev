import { Card, Form, Alert, Button, Container, Row, Col, Carousel, Image } from "react-bootstrap";
import { useRouter } from "next/router";
import { authenticateUser } from "@/lib/authenticate";
import { useContext, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { languageAtom, isBlockedAtom, userAtom, resetEmailAtom } from "@/store";
import { ThemeContext } from "./_app";
import Link from "next/link";
import * as formik from 'formik';
import * as yup from 'yup';
import { setLogDateCookie, setUserCookie } from "@/lib/cookies";

export default function Login(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    const [user, setUser] = useAtom(userAtom);
    const [resetEmail, setResetEmail] = useAtom(resetEmailAtom);
    
    const { theme, toggleTheme } = useContext(ThemeContext);
    const router = useRouter();
    const [warning, setWarning] = useState("");
        
    const { Formik } = formik;
    const schema = yup.object().shape({
        email: yup.string()
            .required('Email is required')
            .email('Email must be valid'),
        password: yup.string()
            .required('Password is required'),
    });

    // async function handleSubmit(values) {
    //     try {
    //         await authenticateUser(values.email, values.password);
    //         await updateAtoms(); 
    //         router.push('/home');
    //     } catch (err) {
    //         setWarning(err.message);
    //     }
    // }

    async function handleSubmit(values) {
        setWarning(""); // Clear previous warnings
        setIsBlocked(true); //block actions

        try {
            const res = await fetch("/api/login", {  // Changed to same-origin API route
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                // Try to parse error message from server
                let errorMsg = "Invalid username or password";
                try {
                    errorMsg = data.message || errorMsg;
                } catch (e) { }
                setWarning(errorMsg);
                return;
            }

            //update user
            setUserCookie(JSON.stringify(data.user));
            setLogDateCookie((new Date()).getTime());
            setUser(data.user);

            // login successful, redirect to home
            router.push('/');
        } catch (err) {
            setWarning("Network error: " + err.message);
        }
    }

    async function updateAtoms() {
        //setUser(await getUser());
    }

    useEffect(() => {
        //remove page blocker
        setIsBlocked(false);
        setResetEmail("randemail");

        updateAtoms();

        //reset local storage
        localStorage.removeItem("reset_otp");
    }, []);

    useEffect(() => {
        if(warning !== "") {
            //remove page blocker
            setIsBlocked(false);
        }

    }, [warning]);

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
            <Col md={4} xs={12} className="mt-4 px-5 px-md-3 px-lg-5">
                <h2 className="text-center">Welcome back</h2>
                {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
                <Formik
                    validationSchema={schema}
                    onSubmit={(values)=>{handleSubmit(values)}}
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                    <Form className="mt-4" onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter your Email" 
                                id="email" 
                                name="email" 
                                value={values.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                            {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter your Password" 
                                id="password" 
                                name="password" 
                                value={values.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                            {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <Link className="text-link" href="/reset">Forgot password?</Link>
                        <br /><br />
                        <Button variant="primary" className="w-100 rounded-pill" type="submit" disabled={isBlocked}>Login</Button>
                        <br />
                        <Row className="mt-2">
                            <Col className="d-flex justify-content-center align-items-center">
                                <small className="me-2 text-gray-400">Don&apos;t have an account?</small>
                                <Link className="text-link" href="/register"><small>Signup</small></Link>
                            </Col>
                        </Row>
                        <br />
                    </Form>
                )}
                </Formik>
            </Col>
        </Row>
    </>
    );
}