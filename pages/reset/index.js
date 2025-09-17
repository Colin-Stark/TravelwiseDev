import { Card, Form, Alert, Button, Row, Carousel, Col, Image } from "react-bootstrap";
import { useRouter } from "next/router";
import { registerUser } from "@/lib/authenticate";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { ThemeContext } from "../_app";
import {useFormik} from 'formik';
import * as yup from 'yup';
import OtpInput from 'react-otp-input';
import { useAtom } from "jotai";
import { isBlockedAtom, resetEmailAtom, resetOTPPassAtom } from "@/store";

export default function ForgotPassword(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    
    const { theme } = useContext(ThemeContext);
    const router = useRouter();
    const [warning, setWarning] = useState("");
    const [email, setEmail] = useState(null);
    const [resetEmail, setResetEmail] = useAtom(resetEmailAtom);
    const [resetOTPPass, setResetOTPPass] = useAtom(resetOTPPassAtom);

    //otp constants
    const [otp, setOtp] = useState('');    
    const initialSeconds = 30;
    const [seconds, setSeconds] = useState(initialSeconds);
    
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: yup.object({
            email: yup.string()
                .required('Email is required')
                .email('Email must be valid'),
        }),
        onSubmit: (values) => {
            handleEmailSubmit(values);
        },
    });

    const formik_otp = useFormik({
        initialValues: {
            otp: '',
        },
        validationSchema: yup.object({
            otp: yup.string()
                .length(6, 'OTP must be 6 digits')
                .required('OTP is required'),
        }),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        //remove page blocker
        setIsBlocked(false);
        //remove page blocker
        setResetEmail(null);
        setResetOTPPass(false);

        //reset otp expiry
        localStorage.removeItem("reset_otp")

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const emailParam = urlParams.get('email');
        if(emailParam) {
            setEmail(emailParam);
        }
    }, []);

    useEffect(() => {
        if(warning !== "") {
            //remove page blocker
            setIsBlocked(false);
        }

    }, [warning]);

    //for countdown
    useEffect(() => {
        // Exit early if countdown is finished
        if (seconds <= 0) {
            return;
        }

        // Set up the timer
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);

        // Clean up the timer
        return () => clearInterval(timer);
    }, [seconds]); // Re-run effect when 'seconds' changes

    async function handleEmailSubmit(values) {
        try {
            const valid = await sendOTP(values.email)

            if(valid) {
                setEmail(values.email);
                router.push('/reset?email='+values.email);
            }

        } catch (err) {
            setWarning(err.message);
        }
    }

    async function handleSubmit(values) {
        // //dummy data
        // if(true) {
        //     setResetEmail(email);
        //     setResetOTPPass(true);
        // }
        // return;

        try {
            //set reset otp expiry
            localStorage.setItem("reset_otp", email);

            router.push('/reset/password');
        } catch (err) {
            setWarning(err.message);
        }
    }

    async function sendOTP(userEmail) {
        //reset seconds
        setSeconds(initialSeconds);

        //create/update OTP then send to email
        setWarning(""); // Clear previous warnings
        setIsBlocked(true); //block actions

        //dummy data
        setResetEmail(null);
        setResetOTPPass(false);
        setIsBlocked(false);
        return true;

        try {
            const res = await fetch("/api/forgot-password", {  // Changed to same-origin API route
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                // Try to parse error message from server
                let errorMsg = "Invalid email";
                try {
                    errorMsg = data.message || errorMsg;
                } catch (e) { }
                setWarning(errorMsg);
                return false;
            }

            setIsBlocked(false);
            return true;

        } catch (err) {
            setIsBlocked(false);
            setWarning("Network error: " + err.message);
        }

        return false;
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
        {
            email === null ?
            (
                <Col md={4} xs={12} className="mb-6 px-5 px-md-3 px-lg-5">
                    <h2 className="text-center">Forgot your password?</h2>
                    <p className="text-center">Enter the email address associated to your account</p>
                    {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
                    <Form className="mt-4" onSubmit={formik.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter your Email" 
                                id="email" 
                                name="email" 
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                            {formik.errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>                        
                        <br /><br />
                        <Button variant="primary" className="w-100 rounded-pill" type="submit">Reset Password</Button>
                        <br />
                    </Form>
                </Col>
            )
            :
            (
                <Col md={4} xs={12} className="mb-6 px-3 px-lg-5">
                    <h2 className="text-center">Enter OTP Code {resetEmail}</h2>
                    <br/>
                    <p className="text-center">Please enter the OTP verification code that has been sent to your email:<br/><b>{email}</b></p>
                    {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
                    <Form className="mt-4" onSubmit={formik_otp.handleSubmit}>
                        {formik_otp.touched.otp && formik_otp.errors.otp ? (
                        <p className="text-center text-red-400">
                            *{formik_otp.errors.otp}*
                        </p>
                        ) : null}
                        <br/>
                        <OtpInput
                            value={formik_otp.values.otp}
                            onChange={(value) => formik_otp.setFieldValue('otp', value)}
                            numInputs={6}
                            containerStyle="otp-container"
                            inputStyle="otp-input"
                            shouldAutoFocus={true}
                            renderInput={(props) => <input {...props} />}
                        />
                        <br /><br />
                        <Row className="mt-2">
                    {
                        seconds <= 0 ?
                        (    
                            <div className="text-center">
                                <small className="me-2 text-gray-400" role="button" onClick={()=>sendOTP(email)}>Did&apos;t receive verification code?</small>
                            </div>
                        )
                        :
                        (
                            <div className="text-center">
                                <small className="me-2 text-gray-400">Can resend OTP after {seconds} seconds</small>
                            </div>
                        )
                    }
                        </Row>
                        <br /><br />
                        <Button variant="primary" className="w-100 rounded-pill" type="submit">Verify</Button>
                        <br />
                    </Form>
                </Col>
            )
        }
        </Row>
    </>
    );
}