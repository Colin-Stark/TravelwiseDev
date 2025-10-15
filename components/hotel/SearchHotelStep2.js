import { ThemeContext } from "@/pages/_app";
import { isBlockedAtom } from "@/store";
import { useAtom } from "jotai";
import { useContext, useEffect, useState, useRef } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { fetchCountryData, getCityList, getCountryCodeObj, getCountryList } from "@/lib/airportData";
import { Typeahead } from "react-bootstrap-typeahead";
import * as formik from 'formik';
import * as yup from 'yup';

export default function SearchHotelStep2(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    const { theme } = useContext(ThemeContext);
    const [warning, setWarning] = useState("");
    const [countryObj, setCountryObj] = useState(props.initialData["countryObj"] ? props.initialData["countryObj"] : []);
    const [countryCodeObj, setCountryCodeObj] = useState({});
    const [countryOptions, setCountryOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

    const initialValues = {
        country : props.initialData["country"] ? props.initialData["country"] : "",
        gl: props.initialData["gl"] ? props.initialData["gl"] : "",
        city : props.initialData["city"] ? props.initialData["city"] : "",
    };
    
    const [country, setCountry] = useState(initialValues.country);
    const [city, setCity] = useState(initialValues.city);

    const { Formik } = formik;
    const schema = yup.object().shape({
        country: yup.string(),
        city: yup.string(),
    });

    useEffect(() => {
        //remove page blocker
        setIsBlocked(false);

        //load data
        loadCountryData();

        if(initialValues.country) {
            loadCityData(initialValues.country);
        }

    }, []);

    async function loadCountryData() {
        var cObj = countryObj;
        if(cObj.length <= 0) {
            cObj = await fetchCountryData();
            setCountryObj(cObj);
        }
        const countries = await getCountryList(cObj);
        setCountryOptions(countries);

        //get list of country codes
        if(Object.keys(countryCodeObj) <= 0) {
            const country_codes = await getCountryCodeObj(cObj);
            setCountryCodeObj(country_codes);
        }
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

    async function handleSubmit(values) {
        setWarning(""); // Clear previous warnings

        if(!values.country) {
            setWarning("Please select a country from the list");
            return;
        }

        if(!values.city) {
            setWarning("Please select a city from the list");
            return;
        }

        //get country code
        const country_code = countryCodeObj.hasOwnProperty(values.country) ? countryCodeObj[values.country] : "";

        const q = `hotels in ${values.city}, ${values.country}`;
        const data = {
            country : values.country,
            gl: country_code,
            city : values.city,
            countryObj : countryObj,
            q : q,
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
            <h3 className="text-center">Hotel Location</h3>
            <p className="text-center">Select the location to search hotels from</p>
            {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
            <Card>
                <Card.Body>
                    <Row className="d-flex mb-3 px-2 px-md-3 gy-4">
                        <Col sm={12} md={6}>
                            <Form.Group>
                                <Form.Label className="fw-bold d-block">Country</Form.Label>
                                <Typeahead
                                    id="country"
                                    name="country"
                                    options={countryOptions}
                                    placeholder="Choose a country..."
                                    defaultSelected={[initialValues.country]}
                                    onChange={(newVal) => {
                                        values.country = newVal[0];
                                        loadCityData(newVal[0]);
                                        setCountry(newVal[0]); 

                                        values.city = "";
                                        inputRef.current.clear();
                                    }}
                                />
                            </Form.Group>
                        </Col>

                        <Col sm={12} md={6}>
                            <Form.Group>
                                <Form.Label className="fw-bold d-block">City</Form.Label>
                                <Typeahead
                                    id="city"
                                    name="city"
                                    options={cityOptions}
                                    placeholder={cityOptions?.length > 0 ? "Choose a city..." : "No available cities found"}
                                    disabled={cityOptions?.length > 0 ? false : true}
                                    defaultSelected={[initialValues.city]}
                                    ref={inputRef}
                                    onChange={(newVal) => {
                                        values.city = newVal[0];
                                        if(newVal[0]) {
                                            setCity(newVal[0]);
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>                  
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