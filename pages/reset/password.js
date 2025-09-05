import { Card, Form, Alert, Button, Row, Carousel, Col, Image } from "react-bootstrap";
import { useRouter } from "next/router";
import { registerUser } from "@/lib/authenticate";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { ThemeContext } from ".././_app";
import * as formik from 'formik';
import * as yup from 'yup';

export default function UpdatePassword(props) {
    const { theme } = useContext(ThemeContext);
    const router = useRouter();
    const [warning, setWarning] = useState("");
    const [complete, setComplete] = useState(false);
    
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
        // setFavouritesList(await getFavourites()); 
        // setSearchHistory(await getHistory());
    }

    useEffect(() => {
        //check if has value in local storage and is not expired
        if(!localStorage.getItem("reset_otp")) {
            router.push('/login');
        }
    }, []);

    async function handleSubmit(values) {
        try {
            //const result = await updateUserPassword(values.password, values.confirmPassword);
            const result = true;
            await updateAtoms(); 
            setComplete(result);
        } catch (err) {
            setWarning(err.message);
        }
    }

    return (
    <>
{
    localStorage.getItem("reset_otp") ?
    (
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
                            <Button variant="primary" className="w-100 rounded-pill" type="submit">Update Password</Button>
                            <br />
                        </Form>
                    )}
                    </Formik>
                </Col>
            )
        }
        </Row>
    )
    :
    (
        <></>
    )
}
    </>
    );
}