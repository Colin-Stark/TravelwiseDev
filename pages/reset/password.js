import { Card, Form, Alert, Button, Row, Carousel, Col, Image } from "react-bootstrap";
import { useRouter } from "next/router";
import { registerUser } from "@/lib/authenticate";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { ThemeContext } from ".././_app";
import * as formik from 'formik';
import * as yup from 'yup';
import { useAtom } from "jotai";
import { isBlockedAtom, resetEmailAtom, resetOTPPassAtom } from "@/store";

export default function UpdatePassword(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    const [resetEmail, setResetEmail] = useAtom(resetEmailAtom);
    const [resetOTPPass, setResetOTPPass] = useAtom(resetOTPPassAtom);

    const { theme } = useContext(ThemeContext);
    const router = useRouter();
    const [warning, setWarning] = useState("");
    const [complete, setComplete] = useState(false);

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


    async function updateAtoms() {
        setResetEmail(null);
        setResetOTPPass(false);
    }

    useEffect(() => {
        //remove page blocker
        setIsBlocked(false);
        
        //redirect to forgot password if not verified
        if(!resetEmail || !resetOTPPass) {
            router.push('/reset');
        }
    }, []);

    useEffect(() => {
        if(warning !== "") {
            //remove page blocker
            setIsBlocked(false);
        }

    }, [warning]);

    async function handleSubmit(values) {
        setWarning(""); // Clear previous warnings
        setIsBlocked(true); //block actions

        try {
            const res = await fetch("/api/reset-password", {  // Changed to same-origin API route
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    email: resetEmail,
                    newPassword: values.password,
                    confirmPassword: values.confirmPassword,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                // Try to parse error message from server
                let errorMsg = null;
                try {
                    errorMsg = data.message || errorMsg;
                } catch (e) { }
                setWarning(errorMsg);
                return false;
            }

            await updateAtoms(); 
            setComplete(true);
            setIsBlocked(false);

        } catch (err) {
            setIsBlocked(false);
            setWarning("Network error: " + err.message);
        }
    }

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
        {
            complete ?
            (
                <Col md={4} xs={12} className="mt-4 px-5 px-md-3 px-lg-5">
                    <h2 className="text-center">Successfully Updated Password</h2>
                    <br />
                    <p className="text-center">Your password has been updated! You can now login using your new credentials!</p>
                    <br />
                    <Row className="mt-2">
                        <Col className="d-flex justify-content-center align-items-center">
                            <small className="me-2 text-gray-400">Login to your account: </small>
                            <Link className="text-link" href="/login"><small>Login</small></Link>
                        </Col>
                    </Row>
                </Col>
            )
            :
            (
                <Col md={4} xs={12} className="mt-4 px-5 px-md-3 px-lg-5">
                    <h2 className="text-center">Update Password</h2>
                    {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
                    <Formik
                        validationSchema={schema}
                        onSubmit={(values)=>{handleSubmit(values)}}
                        initialValues={{
                            password: '',
                            confirmPassword: '',
                        }}
                    >
                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                        <Form className="mt-4" onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>New Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Enter your new Password" 
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
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Re-enter your new Password" 
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
                            <Button variant="primary" className="w-100 rounded-pill" type="submit" disabled={isBlocked}>Update Password</Button>
                            <br />
                        </Form>
                    )}
                    </Formik>
                </Col>
            )
        }
        </Row>
    </>
    );
}