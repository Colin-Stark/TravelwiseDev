import { ThemeContext } from "@/pages/_app";
import { isBlockedAtom } from "@/store";
import { useAtom } from "jotai";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import {DatePickerField} from "@/components/DatePickerField";
import { fetchCountryCsv, getCountryList, getFlightList } from "@/lib/airportData";
import { Typeahead } from "react-bootstrap-typeahead";
import * as formik from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import { fetchCurrencyData } from "@/lib/currencyData";
import { Commet } from "react-loading-indicators";

const travelTypes = {
    1 : "Round Trip",
    2 : "One Way",
};

const travelClasses = {
    1 : "Economy",
    2 : "Premium Economy",
    3 : "Business",
    4 : "First",
};

export default function SearchFlightStep4(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    const { theme } = useContext(ThemeContext);
    const [warning, setWarning] = useState("");
    const [flights, setFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
            flight : props.initialData["flight"] ? props.initialData["flight"] : "",
        };

    const { Formik } = formik;
    const schema = yup.object().shape({
        flight: yup.string(),
    });

    useEffect(() => {
        //remove page blocker
        setIsBlocked(false);

        //load data
        loadData();

    }, []);

    async function loadData() {
        //fix some value types in json properties
        const properties = {
            ...props.initialData,
            type : parseInt(props.initialData.type, 10),
            travel_class : parseInt(props.initialData.travel_class, 10),
        }

        console.log(properties);
        setFlights(await getFlightList(properties));
    }

    async function handleSubmit(values) {
        setWarning(""); // Clear previous warnings

        // const sDate = moment(values.outbound_date);
        // const eDate = moment(values.return_date);

        // if(!sDate.isValid()) {
        //     setWarning("Departure Date is required");
        //     return;
        // }
        // if(!eDate.isValid()) {
        //     setWarning("Return Date is required");
        //     return;
        // }
        // if(eDate.isBefore(sDate)) {
        //     setWarning("Return Date must not be before Departure Date");
        //     return;
        // }
        
        // const formattedSDate = moment(values.outbound_date).format('YYYY-MM-DD');
        // const formattedEDate = moment(values.return_date).format('YYYY-MM-DD');

        // const data = {
        //     type : values.type,
        //     outbound_date : formattedSDate,
        //     return_date : formattedEDate,
        //     travel_class : values.travel_class,
        //     currency : values.currency,
        // }

        // console.log(data);

        // setIsBlocked(true); //block actions
        // props.onNext(data);
    }

    return (
        flights?.length > 0 ? (
        <Formik
            validationSchema={schema}
            onSubmit={(values)=>{handleSubmit(values)}}
            initialValues={initialValues}
        >
        {({ handleSubmit, handleChange, values, touched, errors, setFieldValue}) => (
        <Form className="mx-sm-2 mx-md-5" onSubmit={handleSubmit} as={formik.Form}>
            <h3 className="text-center">Available Flights</h3>
            <p className="text-center">Select a flight to book</p>
            {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
            <Card>
                <Card.Body>
                    <Row className="d-flex gy-2">
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Outbound Date</Form.Label>
                            <Form.Label className="d-block">{props.initialData.outbound_date}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Return Date</Form.Label>
                            <Form.Label className="d-block">{props.initialData.return_date}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Travel Type</Form.Label>
                            <Form.Label className="d-block">{travelTypes[props.initialData.type]}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Travel Class</Form.Label>
                            <Form.Label className="d-block">{travelClasses[props.initialData.travel_class]}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Depart</Form.Label>
                            <Form.Label className="d-block">{`${props.initialData.departure_city}, ${props.initialData.departure_country} (${props.initialData.departure_id})`}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Arrive</Form.Label>
                            <Form.Label className="d-block">{`${props.initialData.arrival_city}, ${props.initialData.arrival_country} (${props.initialData.arrival_id})`}</Form.Label>                
                        </Col>
                    </Row>
                </Card.Body>
            </Card> 
            <br/>
            <Table className="table-bordered" responsive>
                <thead>
                    <tr className="text-center">
                        <th>Airline</th>
                        <th>Flight</th>
                        <th>Stops</th>
                        <th>Duration</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </Table>                     
            <br />
            <Row className="d-flex justify-content-between align-items-center g-2 mx-5">
                <Col className="text-center text-sm-start">
                    <Button variant="outline-secondary" size="lg" className="rounded" type="button" onClick={()=>props.onPrevious()} disabled={isLoading}>Previous</Button>
                </Col>
            </Row>
            <br />
        </Form>
        )}
        </Formik>
        ) : (
            <div className="d-flex justify-content-center align-items-center py-3">
                <Commet size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
            </div>
        )
    )
}