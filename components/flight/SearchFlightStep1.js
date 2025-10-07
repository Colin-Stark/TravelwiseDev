import { ThemeContext } from "@/pages/_app";
import { isBlockedAtom } from "@/store";
import { useAtom } from "jotai";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import {DatePickerField} from "@/components/DatePickerField";
import { fetchCountryCsv, getCountryList } from "@/lib/airportData";
import { Typeahead } from "react-bootstrap-typeahead";
import * as formik from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import { fetchCurrencyData } from "@/lib/currencyData";

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
        if(eDate.isBefore(sDate)) {
            setWarning("Return Date must not be before Departure Date");
            return;
        }
        
        const formattedSDate = moment(values.outbound_date).format('YYYY-MM-DD');
        const formattedEDate = moment(values.return_date).format('YYYY-MM-DD');

        const data = {
            type : values.type,
            outbound_date : formattedSDate,
            return_date : formattedEDate,
            travel_class : values.travel_class,
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
            {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
            <Card>
                <Card.Body>
                    <Row className="d-flex my-3 px-2 px-md-3 gy-4">
                        <Col sm={12} md={6} lg={4}>
                            <Form.Label className="fw-bold d-block">Departure Date</Form.Label>
                            <DatePickerField
                                name="outbound_date"
                                value={values.outbound_date}
                                onChange={setFieldValue} // Pass Formik's setFieldValue
                            />                            
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            <Form.Label className="fw-bold d-block">Return Date</Form.Label>
                            <DatePickerField
                                name="return_date"
                                value={values.return_date}
                                onChange={setFieldValue} // Pass Formik's setFieldValue
                            />                            
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            <Form.Label className="fw-bold d-block">Flight Type</Form.Label>
                            <fieldset>
                                <Form.Check
                                    inline
                                    id="trip_1"
                                    label="Round trip"
                                    name="type"
                                    type="radio"
                                    value="1"
                                    checked={values.type === "1"}
                                    as={formik.Field}
                                />
                                <Form.Check
                                    inline
                                    id="trip_2"
                                    label="One Way"
                                    name="type"
                                    type="radio"
                                    value="2"
                                    checked={values.type === "2"}
                                    as={formik.Field}
                                />
                            </fieldset>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            <Form.Label className="fw-bold">Flight Type</Form.Label>
                            <fieldset>
                                <Form.Check
                                    id="class_1"
                                    label="Economy"
                                    name="travel_class"
                                    type="radio"
                                    value="1"
                                    checked={values.travel_class === "1"}
                                    as={formik.Field}
                                />
                                <Form.Check
                                    id="class_2"
                                    label="Premium Economy"
                                    name="travel_class"
                                    type="radio"
                                    value="2"
                                    checked={values.travel_class === "2"}
                                    as={formik.Field}
                                />
                                <Form.Check
                                    id="class_3"
                                    label="Business"
                                    name="travel_class"
                                    type="radio"
                                    value="3"
                                    checked={values.travel_class === "3"}
                                    as={formik.Field}
                                />
                                <Form.Check
                                    id="class_4"
                                    label="First"
                                    name="travel_class"
                                    type="radio"
                                    value="4"
                                    checked={values.travel_class === "4"}
                                    as={formik.Field}
                                />
                            </fieldset>

                            {/* <Form.Control.Feedback type="invalid">
                            {"Country is required"}
                            </Form.Control.Feedback> */}
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            <Form.Group controlId="mySelect">
                                <Form.Label className="fw-bold">Currency</Form.Label>
                                <Form.Select name="currency" value={values.currency} onChange={handleChange}>
                                {Object.entries(currencies).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                                </Form.Select>

                                {/* <Form.Control.Feedback type="invalid">
                                {"Country is required"}
                                </Form.Control.Feedback> */}
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>                      
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