import { Card, Form, Alert, Button, Row, Carousel, Col, Image } from "react-bootstrap";
import { useRouter } from "next/router";
import { registerUser } from "@/lib/authenticate";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { ThemeContext } from "./_app";
import * as formik from 'formik';
import * as yup from 'yup';

export default function Register(props) {
    const { theme } = useContext(ThemeContext);
    const router = useRouter();
    const [warning, setWarning] = useState("");
    
    const { Formik } = formik;
    const schema = yup.object().shape({
        fullname: yup.string()
            .required('Full name is required'),
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


    async function updateAtoms() {
        // setFavouritesList(await getFavourites()); 
        // setSearchHistory(await getHistory());
    }

    useEffect(() => {
        updateAtoms();
    }, []);

    async function handleSubmit(values) {
        try {
            await registerUser(values.fullname, values.email, values.password, values.confirmPassword);
            await updateAtoms(); 
            router.push('/login');
        } catch (err) {
            setWarning(err.message);
        }
    }

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
                <h2 className="text-center">Create your account</h2>
                {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
                <Formik
                    validationSchema={schema}
                    onSubmit={(values)=>{handleSubmit(values)}}
                    initialValues={{
                        fullname: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                    }}
                >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                    <Form className="mt-4" onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter your Full name" 
                                id="fullname" 
                                name="fullname" 
                                value={values.fullname}
                                onChange={handleChange}
                                isInvalid={!!errors.fullname}
                            />
                            <Form.Control.Feedback type="invalid">
                            {errors.fullname}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <br />
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
                        <Button variant="primary" className="w-100 rounded-pill" type="submit">Signup</Button>
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