import { ThemeContext } from "@/pages/_app";
import { isBlockedAtom } from "@/store";
import { useAtom } from "jotai";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { filterObjByCity, filterObjByCountry, getCityList, getCountryList } from "@/lib/airportData";
import { Typeahead } from "react-bootstrap-typeahead";
import * as formik from 'formik';
import * as yup from 'yup';
import { Commet } from "react-loading-indicators";

export default function SearchFlightStep3(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    const { theme } = useContext(ThemeContext);
    const [warning, setWarning] = useState("");
    const [countryOptions, setCountryOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [airports, setAirports] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
            arrival_country : props.initialData["arrival_country"] ? props.initialData["arrival_country"] : "",
            arrival_city : props.initialData["arrival_city"] ? props.initialData["arrival_city"] : "",
            arrival_id : props.initialData["arrival_id"] ? props.initialData["arrival_id"] : "",
        };
    
    const [country, setCountry] = useState(initialValues.arrival_country);
    const [city, setCity] = useState(initialValues.arrival_city);
    const [selectedAirport, setSelectedAirport] = useState(initialValues.arrival_id);

    const { Formik } = formik;
    const schema = yup.object().shape({
        country: yup.string(),
        city: yup.string(),
        arrival_id: yup.string(),
    });

    useEffect(() => {
        //remove page blocker
        setIsBlocked(false);

        //load data
        loadCountryData();

        if(initialValues.arrival_country) {
            loadCityData(initialValues.arrival_country);

            if(initialValues.arrival_city) {
                loadAirportData(initialValues.arrival_city);
            }
        }

    }, []);

    async function loadCountryData() {
        const countries = await getCountryList();
        setCountryOptions(countries);
    }

    async function loadCityData(countryVal) {
        if(!countryVal) {
            setCityOptions([]);
            return false;
        }

        const cities = await getCityList(countryVal);
        setCityOptions(cities);

        return true;

    }

    async function loadAirportData(cityVal) {
        if(!cityVal) {
            setAirports([]);
            return false;
        }
        setIsLoading(true);

        var currentObj = await filterObjByCountry(country);
        currentObj = await filterObjByCity(cityVal, currentObj);
        setAirports(currentObj);

        setIsLoading(false);
    }

    async function handleSubmit(values) {
        setWarning(""); // Clear previous warnings

        if(!values.arrival_id) {
            setWarning("Please select an airport from the list");
            return;
        }

        const data = {
            arrival_country : values.arrival_country,
            arrival_city : values.arrival_city,
            arrival_id : values.arrival_id,
        }

        console.log(data);

        setIsBlocked(true); //block actions
        props.onNext(data);
    }

    return (
        countryOptions ? (
        <Formik
            validationSchema={schema}
            onSubmit={(values)=>{handleSubmit(values)}}
            initialValues={initialValues}
        >
        {({ handleSubmit, handleChange, values, touched, errors, setFieldValue}) => (
        <Form className="mx-sm-2 mx-md-4" onSubmit={handleSubmit} as={formik.Form}>
            <h3 className="text-center">Arrival Details</h3>
            <p className="text-center">Select the airport to arrive to</p>
            {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
            <Row className="d-flex mt-3 px-2 px-md-3 gy-4">
                <Col sm={12} md={4}>
                    <Card>
                        <Card.Body>
                            <Form.Group>
                                <Form.Label className="fw-bold d-block">Country</Form.Label>
                                <Typeahead
                                    id="country"
                                    name="country"
                                    options={countryOptions}
                                    placeholder="Choose a country..."
                                    defaultSelected={[initialValues.arrival_country]}
                                    onChange={(newVal) => {
                                        values.arrival_country = newVal[0];
                                        loadCityData(newVal[0]);
                                        setCountry(newVal[0]);
                                        setAirports([]);
                                        setSelectedAirport("");
                                    }}
                                />
                            </Form.Group>
                            <br/>

                            <Form.Group>
                                <Form.Label className="fw-bold d-block">City</Form.Label>
                                <Typeahead
                                    id="city"
                                    name="city"
                                    options={cityOptions}
                                    placeholder={cityOptions?.length > 0 ? "Choose a city..." : "No available cities found"}
                                    disabled={cityOptions?.length > 0 ? false : true}
                                    defaultSelected={[initialValues.arrival_city]}
                                    onChange={(newVal) => {
                                        values.arrival_city = newVal[0];
                                        if(newVal[0]) {
                                            setCity(newVal[0]);
                                            loadAirportData(newVal[0]);
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>

                <Col sm={12} md={8}>
                    <Card className="min-h-50">
                        <Card.Body>
                            <Form.Label className="fw-bold d-block">Airport List (Arrival)</Form.Label>
                            <Row className="gy-3">
                            {
                                airports?.length > 0 ? airports.map((airport, index) => (
                                    <Col md={12} lg={6} key={index} onClick={()=> {values.arrival_id = airport.IATA; setSelectedAirport(airport.IATA);}}>
                                        <Card className={selectedAirport === airport.IATA ? 'card-selectable active' : 'card-selectable' } role='button'>
                                            <Card.Body>
                                                    <div className='d-flex justify-content-between align-items-center'>
                                                        <Form.Check 
                                                            type="radio"
                                                            id={`check_${index}`}
                                                            name='airport'
                                                            value={airport.IATA}
                                                            checked={selectedAirport === airport.IATA}
                                                            onChange={() => values.arrival_id = airport.IATA}
                                                        />
                                                        <Row className='text-end'>
                                                            <Col xs={12} className='fw-bold'>
                                                                {airport.Name}
                                                            </Col>
                                                            <Col xs={12}>
                                                                {airport.City}
                                                            </Col>
                                                            <Col xs={12}>
                                                                {airport.Country}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                                :
                                (
                                    isLoading ? (
                                        <div className="d-flex justify-content-center align-items-center py-3">
                                            <Commet size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
                                        </div>
                                    ) 
                                    : 
                                    (
                                        <div className="d-flex justify-content-center align-items-center py-3">
                                            <Alert variant="info" className="w-100 text-center">Please select a City first</Alert>
                                        </div>
                                    )
                                )
                            }
                            </Row>                         
                    
                        </Card.Body>
                    </Card>  
                </Col>
            </Row>                    
            <br />
            <Row className="d-flex justify-content-between align-items-center g-2 mx-5">
                <Col className="text-center text-sm-start">
                    <Button variant="outline-secondary" size="lg" className="rounded" type="button" onClick={()=>props.onPrevious()} disabled={isLoading}>Previous</Button>
                </Col>
                <Col className="text-center text-sm-end">
                    <Button variant="outline-primary" size="lg" className="rounded" type="button" onClick={handleSubmit} disabled={isLoading}>Next</Button>
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