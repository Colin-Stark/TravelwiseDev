import { ThemeContext } from "@/pages/_app";
import { isBlockedAtom } from "@/store";
import { useAtom } from "jotai";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import {DatePickerField} from "@/components/DatePickerField";
import * as formik from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import { fetchCurrencyData } from "@/lib/currencyData";
import BtnCounter from "../BtnCounter";

const propertyTypes = {
    "12" : "Beach hotels",
    "13" : "Boutique hotels",
    "14" : "Hostels",
    "15" : "Inns",
    "16" : "Motels",
    "17" : "Resorts",
    "18" : "Spa hotels",
    "19" : "Bed and breakfasts",
    "20" : "Other",
    "21" : "Apartment hotels",
    "22" : "Minshuku",
    "23" : "Japanese-style business hotels",
    "24" : "Ryokan",
};

const hotelClasses = {
    "2" : "2-star",
    "3" : "3-star",
    "4" : "4-star",
    "5" : "5-star",
};

const dateNow = moment();
dateNow.set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
});

export default function SearchHotelStep1(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    const { theme } = useContext(ThemeContext);
    const [warning, setWarning] = useState("");
    const [options, setOptions] = useState({});
    const [currencies, setCurrencies] = useState({});

    const initialValues = {
        check_in_date : props.initialData["check_in_date"] ? props.initialData["check_in_date"] : "",
        check_out_date : props.initialData["check_out_date"] ? props.initialData["check_out_date"] : "",
        adults: props.initialData["adults"] ? props.initialData["adults"] : 1,
        children: props.initialData["children"] ? props.initialData["children"] : 0,
        hotel_class: props.initialData["hotel_class"] ? props.initialData["hotel_class"] : Object.keys(hotelClasses),
        max_price: props.initialData["max_price"] ? props.initialData["max_price"] : "",
        currency : props.initialData["currency"] ? props.initialData["currency"] : "CAD",
        property_types : props.initialData["property_types"] ? props.initialData["property_types"] : Object.keys(propertyTypes),
    };

    const { Formik } = formik;
    const schema = yup.object().shape({
        currency: yup.string(),
    });

    useEffect(() => {
        //remove page blocker
        setIsBlocked(false);

        //load data
        loadData();

    }, []);

    async function loadData() {
        setCurrencies(await fetchCurrencyData());
    }

    async function handleSubmit(values) {
        setWarning(""); // Clear previous warnings

        const sDate = moment(values.check_in_date);
        const eDate = moment(values.check_out_date);

        if(!sDate.isValid()) {
            setWarning("Check-in is required");
            return;
        }
        if(!eDate.isValid()) {
            setWarning("Check-out is required");
            return;
        }
        if(sDate.isBefore(dateNow)) {
            setWarning("Check-in Date must not be before today's date");
            return;
        }
        if(eDate.isBefore(sDate)) {
            setWarning("Check-out Date must not be before Check-in Date");
            return;
        }

        //check if there is at least one passenger
        if(values.adults + values.children < 1) {
            setWarning("Must have at least one guest");
            return;
        }
        else if(values.adults === 0 && values.children > 0) {
            setWarning("Children must be accompanied by at least one adult");
            return;
        }

        //check if max price is valid
        if(values.max_price < 0) {
            setWarning("Max price must be greater than or equal to 0");
            return;
        }
        
        const formattedSDate = sDate.format('YYYY-MM-DD');
        const formattedEDate = eDate.format('YYYY-MM-DD');

        const data = {
            check_in_date : formattedSDate,
            check_out_date : formattedEDate,
            adults: values.adults,
            children: values.children,
            hotel_class: values.hotel_class,
            max_price: values.max_price,
            currency : values.currency,
            property_types : values.property_types,
            all_property_types : propertyTypes,
            all_hotel_classes: hotelClasses,
        }

        console.log(data);

        setIsBlocked(true); //block actions
        props.onNext(data);
    }

    return (
        options ? (
        <Formik
            validationSchema={schema}
            onSubmit={(values)=>{handleSubmit(values)}}
            initialValues={initialValues}
        >
        {({ handleSubmit, handleChange, values, touched, errors, setFieldValue}) => (
        <Form className="mx-sm-2 mx-md-5" onSubmit={handleSubmit} as={formik.Form}>
            <h3 className="text-center">Hotel Details</h3>
            <p className="text-center">Enter the types, dates, and classes of the hotel</p>
            <Card>
                <Card.Body>
                    <Row className="d-flex my-3 px-2 px-md-3 gy-4">
                        <Col xs={12} sm={6} lg={4}>
                            <Form.Label className="fw-bold d-block">Check-in Date</Form.Label>
                            <DatePickerField
                                name="check_in_date"
                                value={values.check_in_date}
                                placeholderText={"Select Check-in date"}
                                onChange={setFieldValue} // Pass Formik's setFieldValue
                            />                            
                        </Col>
                        <Col xs={12} sm={6} lg={4}>
                            <Form.Label className="fw-bold d-block">Check-out Date</Form.Label>
                            <DatePickerField
                                name="check_out_date"
                                value={values.check_out_date}
                                placeholderText={"Select Check-out date"}
                                onChange={setFieldValue} // Pass Formik's setFieldValue
                            />                            
                        </Col>
                        <Col xs={12} sm={6} lg={4}>
                            <Form.Label className="fw-bold d-block">Number of People</Form.Label>
                            <div>
                                <Row className="my-2">
                                    <Col xs={6}>
                                        <label className="d-block">Adults: </label>
                                        <label className="d-block text-sm text-secondary">Ages 18 and up</label>
                                    </Col>
                                    <Col xs={6}>
                                        <BtnCounter theme={theme} name="adults" initialValue={initialValues.adults} onChange={setFieldValue}></BtnCounter>                          
                                    </Col>
                                </Row>
                                <Row className="my-2">
                                    <Col xs={6}>
                                        <label className="d-block">Children: </label>
                                        <label className="d-block text-sm text-secondary">Ages 2 to 17</label>
                                    </Col>
                                    <Col xs={6}>
                                        <BtnCounter theme={theme} name="children" initialValue={initialValues.children} onChange={setFieldValue}></BtnCounter>                          
                                    </Col>
                                </Row>
                            </div>
                            
                        </Col>
                        <Col xs={12} sm={6} lg={4}>
                            <Form.Label className="fw-bold">Hotel Class</Form.Label>
                            <Row className="gy-2">
                            {
                                Object.entries(hotelClasses).map(([val, hotelClass], index) => (
                                    <Col xs={12} sm={6} key={`class_${val}`}>
                                        <Form.Check
                                                className="text-nowrap"
                                                id={`class_${val}`}
                                                label={hotelClass}
                                                name="hotel_class"
                                                type="checkbox"
                                                value={val}
                                                as={formik.Field}
                                            />
                                    </Col>
                                ))
                            }
                            </Row>
                        </Col>
                        <Col xs={12} sm={6} lg={4}>
                            <Form.Label className="d-block"><b>Max Price</b> <label className="text-sm text-secondary">(leave blank for any)</label></Form.Label>
                            <Form.Control
                                id="max_price"
                                name="max_price"
                                type="number"
                                value={values.max_price}
                                onChange={handleChange}
                                min={0}
                                placeholder="Enter Max Price"
                            />                         
                        </Col>
                        <Col xs={12} sm={6} lg={4}>
                            <Form.Group controlId="mySelect">
                                <Form.Label className="fw-bold">Currency</Form.Label>
                                <Form.Select name="currency" value={values.currency} onChange={handleChange}>
                                {Object.entries(currencies).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Form.Label className="fw-bold d-block">Property Type</Form.Label>
                            <Row className="gy-2">
                            {
                                Object.entries(propertyTypes).map(([val, propertyType], index) => (
                                    <Col key={`hotel_${val}`} sm={6} md={4}>
                                        <Form.Check
                                            id={`hotel_${val}`}
                                            label={propertyType}
                                            name="property_types"
                                            type="checkbox"
                                            value={val}
                                            as={formik.Field}
                                        />
                                    </Col>
                                ))
                            }
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card> 
            {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}                     
            <br />
            <Row className="d-flex justify-content-between align-items-center g-2 mx-5">
                <Col className="text-center text-sm-end">
                    <Button variant="outline-primary" size="lg" className="rounded" type="button" onClick={handleSubmit}>Next</Button>
                </Col>
            </Row>
            <br />
        </Form>
        )}
        </Formik>
        ) : (
            <></>
        )
    )
}