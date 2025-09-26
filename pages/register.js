import { Card, Form, Alert, Button, Row, Carousel, Col, Image } from "react-bootstrap";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { ThemeContext } from "./_app";
import * as formik from 'formik';
import * as yup from 'yup';
import { useAtom } from "jotai";
import { isBlockedAtom } from "@/store";
import { checkValidLogin } from "@/lib/cookies";

export default function Register(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    
    const { theme } = useContext(ThemeContext);
    const router = useRouter();
    const [warning, setWarning] = useState("");

    //carousel images
    const images = [
        {img: "preview_1.jpg", caption: ""},
        {img: "preview_2.jpg", caption: ""},
        {img: "preview_3.jpg", caption: ""},
        {img: "preview_4.jpg", caption: ""},
        {img: "preview_5.jpg", caption: ""},
    ];

    const { Formik } = formik;
    const schema = yup.object().shape({
        email: yup.string()
            .required('Email is required')
            .email('Email must be valid'),
        password: yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/\d/, 'Password must contain at least one number')
            .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
        confirmPassword: yup.string()
            .required('Confirm Password is required')
            .oneOf([yup.ref('password')], 'Passwords must match'),
    });

    async function handleSubmit(values) {
        setWarning(""); // Clear previous warnings
        setIsBlocked(true); //block actions

        try {
            const res = await fetch("/api/signup", {  // Changed to same-origin API route
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                    confirmPassword: values.confirmPassword
                }),
            });

            if (!res.ok) {
                // Try to parse error message from server
                let errorMsg = "Registration failed";
                try {
                    const data = await res.json();
                    errorMsg = data.message || errorMsg;
                } catch (e) { }
                setWarning(errorMsg);
                return;
            }

            // Registration successful, redirect to login
            router.push('/login');
        } catch (err) {
            setWarning("Network error: " + err.message);
        }
    }

    useEffect(() => {
        //remove page blocker
        setIsBlocked(false);
    }, []);

    useEffect(() => {
        if(warning !== "") {
            //remove page blocker
            setIsBlocked(false);
        }

        //check if logged in
        if(checkValidLogin()) {
            router.push("/");
        }

    }, [warning]);

    return (
        <>
            <Row className="d-flex justify-content-center align-items-center m-0 p-0">
                <Col md={8} xs={0}>
                    <Carousel className="d-none d-md-block" data-bs-theme={theme === "dark" ? "light" : "dark"}>
                    {
                        images.map((image, index) => (
                            <Carousel.Item key={index}>
                                <Row className="justify-content-center align-items-center">
                                    <Image className="carousel fluid" src={`/images/${image.img}`} alt="carousel-img" />
                                </Row>
                            { image.caption ? 
                                (
                                    <Carousel.Caption>
                                        <h3>
                                            {image.caption}
                                        </h3>
                                    </Carousel.Caption>
                                )
                                :
                                (
                                    <></>
                                )
                            }
                            </Carousel.Item>
                        ))
                    }
                    </Carousel>
                </Col>
                <Col md={4} xs={12} className="mt-4 px-5 px-md-3 px-lg-5">
                    <h2 className="text-center">Create your account</h2>
                    {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
                    <Formik
                        validationSchema={schema}
                        onSubmit={(values) => { handleSubmit(values) }}
                        initialValues={{
                            email: '',
                            password: '',
                            confirmPassword: '',
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
                                <Form.Group>
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Re-enter your Password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        isInvalid={!!errors.confirmPassword}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.confirmPassword}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <br /><br />
                                <Button variant="primary" className="w-100 rounded-pill" type="submit" disabled={isBlocked}>Signup</Button>
                                <br />
                                <Row className="mt-2">
                                    <div className="text-center">
                                        <small className="text-gray-400">By continuing you agree to our </small>
                                        <Link className="text-link" href="/" target="_blank"><small>Terms of Service</small></Link>
                                    </div>
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