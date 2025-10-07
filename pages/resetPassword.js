import { Card, Form, Alert, Button, Row, Carousel, Col, Image } from "react-bootstrap";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { ThemeContext } from "./_app";
import * as formik from 'formik';
import * as yup from 'yup';

export default function ChangePassword(props) {
    const { theme } = useContext(ThemeContext);
    const router = useRouter();
    const [warning, setWarning] = useState("");
    const [complete, setComplete] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false); // Block actions during submission

    // Assume user email is available (e.g., from context, props, or localStorage). Replace with actual logic.
    const userEmail = "user@example.com"; // Placeholder: Fetch from user context or API.

    // Carousel images (same as reference)
    const images = [
        {img: "preview_1.jpg", caption: ""},
        {img: "preview_2.jpg", caption: ""},
        {img: "preview_3.jpg", caption: ""},
        {img: "preview_4.jpg", caption: ""},
        {img: "preview_5.jpg", caption: ""},
    ];
    
    const { Formik } = formik;
    const schema = yup.object().shape({
        currentPassword: yup.string().required('Current password is required'),
        password: yup.string()
            .required('New password is required')
            .min(8, 'Password must be at least 8 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/\d/, 'Password must contain at least one number')
            .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
        confirmPassword: yup.string()
            .required('Confirm password is required')
            .oneOf([yup.ref('password')], 'Passwords must match'),
    });

    useEffect(() => {
        // Remove any initial blocks
        setIsBlocked(false);
    }, []);

    useEffect(() => {
        if (warning !== "") {
            setIsBlocked(false);
        }
    }, [warning]);

    async function handleSubmit(values) {
        setWarning(""); // Clear previous warnings
        setIsBlocked(true); // Block actions

        try {
            const res = await fetch("/api/change-password", { // New API for password change
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    currentPassword: values.currentPassword,
                    newPassword: values.password,
                    confirmPassword: values.confirmPassword,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                let errorMsg = "Failed to change password";
                try {
                    errorMsg = data.message || errorMsg;
                } catch (e) {}
                setWarning(errorMsg);
                return false;
            }

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
                                    {image.caption ? (
                                        <Carousel.Caption>
                                            <h3>{image.caption}</h3>
                                        </Carousel.Caption>
                                    ) : (
                                        <></>
                                    )}
                                </Carousel.Item>
                            ))
                        }
                    </Carousel>
                </Col>
                {
                    complete ? (
                        <Col md={4} xs={12} className="mt-4 px-5 px-md-3 px-lg-5">
                            <h2 className="text-center">Password Changed Successfully</h2>
                            <br />
                            <p className="text-center">Your password has been updated! You can now use your new credentials.</p>
                            <br />
                            <Row className="mt-2">
                                <Col className="d-flex justify-content-center align-items-center">
                                    <small className="me-2 text-gray-400">Back to profile: </small>
                                    <Link className="text-link" href="/profile"><small>Profile</small></Link>
                                </Col>
                            </Row>
                        </Col>
                    ) : (
                        <Col md={4} xs={12} className="mt-4 px-5 px-md-3 px-lg-5">
                            <h2 className="text-center">Change Password</h2>
                            {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
                            <Formik
                                validationSchema={schema}
                                onSubmit={(values) => { handleSubmit(values) }}
                                initialValues={{
                                    currentPassword: '',
                                    password: '',
                                    confirmPassword: '',
                                }}
                            >
                                {({ handleSubmit, handleChange, values, touched, errors }) => (
                                    <Form className="mt-4" onSubmit={handleSubmit}>
                                        <Form.Group>
                                            <Form.Label>Current Password</Form.Label>
                                            <Form.Control 
                                                type="password" 
                                                placeholder="Enter your current password" 
                                                id="currentPassword" 
                                                name="currentPassword" 
                                                value={values.currentPassword}
                                                onChange={handleChange}
                                                isInvalid={!!errors.currentPassword}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.currentPassword}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <br />
                                        <Form.Group>
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control 
                                                type="password" 
                                                placeholder="Enter your new password" 
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
                                                placeholder="Re-enter your new password" 
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
                                        <Button variant="primary" className="w-100 rounded-pill" type="submit" disabled={isBlocked}>
                                            Change Password
                                        </Button>
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