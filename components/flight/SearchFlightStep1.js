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

const travelTypes = {
    "1" : "Round Trip",
    "2" : "One Way",
};

const travelClasses = {
    "1" : "Economy",
    "2" : "Premium Economy",
    "3" : "Business",
    "4" : "First",
};

const dateNow = moment();
dateNow.set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
});

export default function SearchFlightStep1(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    const { theme } = useContext(ThemeContext);
    const [warning, setWarning] = useState("");
    const [options, setOptions] = useState({});
    const [currencies, setCurrencies] = useState({});

    const initialValues = {
        type : props.initialData["type"] ? props.initialData["type"] : "1",
        outbound_date : props.initialData["outbound_date"] ? props.initialData["outbound_date"] : "",
        return_date : props.initialData["return_date"] ? props.initialData["return_date"] : "",
        travel_class : props.initialData["travel_class"] ? props.initialData["travel_class"] : "1",
        adults: props.initialData["adults"] ? props.initialData["adults"] : 1,
        children: props.initialData["children"] ? props.initialData["children"] : 0,
        infants_in_seat: props.initialData["infants_in_seat"] ? props.initialData["infants_in_seat"] : 0,
        infants_on_lap: props.initialData["infants_on_lap"] ? props.initialData["infants_on_lap"] : 0,
        currency : props.initialData["currency"] ? props.initialData["currency"] : "CAD",
    };

    const { Formik } = formik;
    const schema = yup.object().shape({
        type: yup.string(),
        travel_class: yup.string(),
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

        const sDate = moment(values.outbound_date);
        const eDate = moment(values.return_date);

        if(!sDate.isValid()) {
            setWarning("Departure Date is required");
            return;
        }
        if(!eDate.isValid()) {
            setWarning("Return Date is required");
            return;
        }
        if(sDate.isBefore(dateNow)) {
            setWarning("Check-in Date must not be before today's date");
            return;
        }
        if(eDate.isBefore(sDate)) {
            setWarning("Return Date must not be before Departure Date");
            return;
        }

        //check if there is at least one passenger
        if(values.adults + values.children + values.infants_in_seat + values.infants_on_lap < 1) {
            setWarning("Must have at least one passenger");
            return;
        }
        else if(values.adults === 0 && values.infants_in_seat + values.infants_on_lap > 0) {
            setWarning("Infants must be accompanied by at least one adult");
            return;
        }
        
        const formattedSDate = moment(values.outbound_date).format('YYYY-MM-DD');
        const formattedEDate = moment(values.return_date).format('YYYY-MM-DD');

        const data = {
            type : values.type,
            type_name : travelTypes[values.type],
            outbound_date : formattedSDate,
            return_date : formattedEDate,
            travel_class : values.travel_class,
            travel_class_name : travelClasses[values.travel_class],
            adults: values.adults,
            children: values.children,
            infants_in_seat: values.infants_in_seat,
            infants_on_lap: values.infants_on_lap,
            currency : values.currency,
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
            <h3 className="text-center">Flight Details</h3>
            <p className="text-center">Enter the type, dates, and class of the flight</p>
            <Card className="main-shadow">
                <Card.Body>
                    <Row className="d-flex my-3 px-2 px-md-3 gy-4">
                        <Col xs={12} sm={6} lg={4}>
                            <Form.Label className="fw-bold d-block">Departure Date</Form.Label>
                            <DatePickerField
                                name="outbound_date"
                                value={values.outbound_date}
                                placeholderText={"Select Departure date"}
                                onChange={setFieldValue} // Pass Formik's setFieldValue
                            />                            
                        </Col>
                        <Col xs={12} sm={6} lg={4}>
                            <Form.Label className="fw-bold d-block">Return Date</Form.Label>
                            <DatePickerField
                                name="return_date"
                                value={values.return_date}
                                placeholderText={"Select Return date"}
                                onChange={setFieldValue} // Pass Formik's setFieldValue
                            />                            
                        </Col>
                        <Col xs={12} sm={6} lg={4}>
                            <Form.Label className="fw-bold d-block">Number of Passengers</Form.Label>
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
                                <Row className="my-2">
                                    <Col xs={6}>
                                        <label className="d-block">Infants (in seat): </label>
                                        <label className="d-block text-sm text-secondary">Younger than 2</label>
                                    </Col>
                                    <Col xs={6}>
                                        <BtnCounter theme={theme} name="infants_in_seat" initialValue={initialValues.infants_in_seat} onChange={setFieldValue}></BtnCounter>                          
                                    </Col>
                                </Row>
                                <Row className="my-2">
                                    <Col xs={6}>
                                        <label className="d-block">Infants (on lap): </label>
                                        <label className="d-block text-sm text-secondary">Younger than 2</label>
                                    </Col>
                                    <Col xs={6}>
                                        <BtnCounter theme={theme} name="infants_on_lap" initialValue={initialValues.infants_on_lap} onChange={setFieldValue}></BtnCounter>                          
                                    </Col>
                                </Row>
                            </div>
                            
                        </Col>
                        <Col xs={12} sm={6} lg={4}>
                            <Form.Label className="fw-bold d-block">Flight Type</Form.Label>
                            <fieldset>
                            {
                                Object.entries(travelTypes).map(([val, travelType], index) => (
                                    <Form.Check
                                        key={`trip_${val}`}
                                        id={`trip_${val}`}
                                        label={travelType}
                                        name="type"
                                        type="radio"
                                        value={val}
                                        checked={values.type === val}
                                        as={formik.Field}
                                    />
                                ))
                            }
                            </fieldset>
                        </Col>
                        <Col xs={12} sm={6} lg={4}>
                            <Form.Label className="fw-bold">Flight Class</Form.Label>
                            <fieldset>
                            {
                                Object.entries(travelClasses).map(([val, travelClass], index) => (
                                    <Form.Check
                                        key={`class_${val}`}
                                        id={`class_${val}`}
                                        label={travelClass}
                                        name="travel_class"
                                        type="radio"
                                        value={val}
                                        checked={values.travel_class === val}
                                        as={formik.Field}
                                    />
                                ))
                            }
                            </fieldset>
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