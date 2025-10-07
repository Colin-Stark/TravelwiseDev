import { Card, Form, Alert, Button, Row, Carousel, Col, Image, Container, Figure } from "react-bootstrap";
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
import { Typeahead } from "react-bootstrap-typeahead";
import SearchFlightStep1 from "@/components/flight/SearchFlightStep1";
import SearchFlightStep2 from "@/components/flight/SearchFlightStep2";
import SearchFlightStep3 from "@/components/flight/SearchFlightStep3";
import SearchFlightStep4 from "@/components/flight/SearchFlightStep4";

export default function SearchFlight(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    
    const { theme } = useContext(ThemeContext);
    const router = useRouter();
    const [warning, setWarning] = useState("");
    const [pageCount, setPageCount] = useState(1);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        //remove page blocker
        setIsBlocked(false);

        // const queryString = window.location.search;
        // const urlParams = new URLSearchParams(queryString);
        // const countryParam = urlParams.get('iso');
        // if(countryParam) {
        //     setFormData((prevDa));
        // }
    }, [setIsBlocked]);

    useEffect(() => {
        if(warning !== "") {
            //remove page blocker
            setIsBlocked(false);
        }

    }, [warning, setIsBlocked]);

    function handleNext(data) {
        setFormData((prevData) => ({ ...prevData, ...data }));
        setPageCount((prevCount)=>prevCount+1);
    }

    function handlePrevious() {
        setPageCount((prevCount)=>prevCount-1);
    }

    const renderStep = () => {
        switch (pageCount) {
        case 1:
            return <SearchFlightStep1 onNext={handleNext} initialData={formData} />;
        case 2:
            return <SearchFlightStep2 onNext={handleNext} onPrevious={handlePrevious} initialData={formData} />;
        case 3:
            return <SearchFlightStep3 onNext={handleNext} onPrevious={handlePrevious} initialData={formData} />;
        case 4:
            return <SearchFlightStep4 onNext={handleNext} onPrevious={handlePrevious} initialData={formData} />;
        default:
            return null;
        }
    };

   return (
    <div>
        <Row className="mt-2">
            <Card className="bg-dark text-white m-0 p-0">
                <Card.Img className="img-title rounded-0" src={`/images/preview_1.jpg`} alt="Card image" />
                <Card.ImgOverlay className="d-flex align-items-center px-4 px-md-5">
                    <Card.Title><h1>Search Flights</h1></Card.Title>
                </Card.ImgOverlay>
            </Card>
        </Row>
        <hr/>
        <br/>
        {renderStep()}
    </div>
    );
}