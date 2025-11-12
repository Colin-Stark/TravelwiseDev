import { Alert, Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { formatMinutes, formatCurrency, getCityList } from '@/lib/airportData';
import { DatePickerField } from '../DatePickerField';
import { useEffect, useRef, useState } from 'react';
import * as formik from 'formik';
import * as yup from 'yup';
import { useAtom } from 'jotai';
import { isBlockedAtom, userAtom } from '@/store';
import { getUser, getUserFlights } from '@/lib/userData';
import { Typeahead } from 'react-bootstrap-typeahead';
import moment from 'moment';

export default function ItineraryDetails({show, handleModalClose, handleAction, itineraryObj, status, action, countryObj, countryOptions, theme}) {
    const [user, setUser] = useAtom(userAtom);
    
    const [warning, setWarning] = useState("");
    const [customFlight, setCustomFlight] = useState(action === "add" ? false : !itineraryObj.flight?.departure_token);
    const [country, setCountry] = useState(action === "add" ? "" : itineraryObj.country);
    const [city, setCity] = useState(action === "add" ? "" : itineraryObj.city);
    const [userFlights, setUserFlights] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const inputRef = useRef(null);

    const initialValues = {
        title : action === "add" ? "" : itineraryObj.title,
        description : action === "add" ? "" : itineraryObj.description,
        start_date : action === "add" ? "" : itineraryObj.start_date,
        end_date : action === "add" ? "" : itineraryObj.end_date,
        country : action === "add" ? "" : itineraryObj.country,
        city : action === "add" ? "" : itineraryObj.city,
        flight : action === "add" ? "" : itineraryObj.flight?.departure_token,
    };

    const { Formik } = formik;
    const schema = yup.object().shape({
        title: yup.string(),
        description: yup.string(),
    });

    useEffect(() => {
        setCustomFlight(action === "add" ? false : !itineraryObj.flight?.departure_token);

        if(show === true) {
            
            //load data
            loadData();

            if(itineraryObj?.country) {
                loadCityData(itineraryObj.country);
            }
        }

    }, [show]);

     async function loadCityData(countryVal) {
        if(!countryVal) {
            setCityOptions([]);
            return false;
        }

        const cities = await getCityList(countryVal);
        setCityOptions(cities);

        return true;

    }

    async function loadData() {
        const data = await getUser();
        setUser(data);

        setUserFlights(await getUserFlights(data?.id));
    }

     const handleSubmit = (values) => {
        setWarning("");
        
        var country = customFlight ? values.country : "";
        var city = customFlight ? values.city : "";
        var start_date = customFlight ? values.start_date : "";
        var end_date = customFlight ? values.end_date : "";

        //change start date and end date format
        if(customFlight) {
            start_date = start_date ? moment(start_date).format('YYYY-MM-DD') : "";
            end_date = end_date ? moment(end_date).format('YYYY-MM-DD') : "";
        }

        //retrieve data from flight if selected
        if(values.flight) {
            for(const flight of userFlights) {
                if(flight.departure_token == values.flight) {
                    country = flight.arrival_country;
                    city = flight.arrival_city;
                    start_date = flight.outbound_date;
                    end_date = flight.return_date;
                    break;
                }
            }
        }

        if(!values.title) {
            setWarning("Title must not be empty");
            return;
        }
        if(!start_date) {
            if(!customFlight) {
                setWarning("Select a Flight or create a custom flight");
                return;
            }
            setWarning("Start Date must not be empty");
            return;
        }
        if(!end_date) {
            if(!customFlight) {
                setWarning("Select a Flight or create a custom flight");
                return;
            }
            setWarning("End Date must not be empty");
            return;
        }
        if(!country) {
            if(!customFlight) {
                setWarning("Select a Flight or create a custom flight");
                return;
            }
            setWarning("Country must not be empty");
            return;
        }
        if(!city) {
            if(!customFlight) {
                setWarning("Select a Flight or create a custom flight");
                return;
            }
            setWarning("City must not be empty");
            return;
        }
        const now = new Date();
        if(moment(start_date).isBefore(moment(now.toDateString()))) {
            setWarning("Start Date cannot be a past date");
            return;
        }
        if(moment(start_date).isAfter(moment(end_date))) {
            setWarning("End Date must not be before Start Date");
            return;
        }

        //determine country code
        var gl = null;
        for(const cObj of countryObj) {
            if(cObj.country_name === country) {
                gl = cObj.country_code;
                break;
            }
        }
        
        if(!gl) {
            setWarning("Error determining country");
            return;
        }

        const formData = {
            title : values.title,
            description : values.description,
            country : country,
            city : city,
            start_date : start_date,
            end_date : end_date,
            gl: gl,
            departure_token: values.flight,
        }

        handleAction(itineraryObj, formData);
        handleModalClose();
    };

    return (
    <Modal show={show} onHide={handleModalClose} data-bs-theme={theme}>
        <Modal.Header closeButton>
            <Modal.Title>{action === "add" ? "Create New Itinerary" : "Edit Itinerary"}</Modal.Title>
        </Modal.Header>

        <Formik
            validationSchema={schema}
            onSubmit={(values)=>{handleSubmit(values)}}
            initialValues={initialValues}
        >
        {({ handleSubmit, handleChange, values, touched, errors, setFieldValue}) => (
        <Form onSubmit={handleSubmit} as={formik.Form}>

        <Modal.Body>
                <Row className='gy-3 align-items-center'>
                    <Col xs={12}>
                        <Form.Label className="fw-bold d-block">Trip Title <label className='text-danger'>*</label></Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter Itinerary Title" 
                            name="title" 
                            value={values.title}
                            onChange={handleChange}
                            isInvalid={!!errors.title}
                        />
                        <Form.Control.Feedback type="invalid">
                        {errors.title}
                        </Form.Control.Feedback>                          
                    </Col>
                    <Col xs={12}>
                        <Form.Label className="fw-bold d-block">Trip Description</Form.Label>
                        <Form.Control 
                            as="textarea"
                            rows={3}
                            placeholder="Enter Itinerary Description" 
                            name="description" 
                            value={values.description}
                            onChange={handleChange}
                            isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                        {errors.description}
                        </Form.Control.Feedback>                          
                    </Col>
                    <Col xs={12}>
                        <Form.Group controlId="flightSelect">
                            <Form.Label className="fw-bold">Flight</Form.Label>
                            <Form.Select name="flight" value={values.flight} onChange={handleChange} disabled={customFlight}>
                                <option className='text-secondary' value={""}>{"-- Select a Saved Flight --"}</option>
                            {userFlights.map((flight, index) => {
                                return <option key={`user_flight_${index}`} value={flight.departure_token}>{`${flight.arrival_city}, ${flight.arrival_country} (${flight.outbound_date} - ${flight.return_date})`}</option>
                            })}
                            </Form.Select>
                        </Form.Group>                         
                    </Col>
                    <Col xs={12}>
                        <Form.Check
                            id='customFlight'
                            label="Custom Flight Details"
                            type="checkbox"
                            defaultChecked={customFlight}
                            onChange={()=>{
                                const isChecked = !customFlight;
                                setCustomFlight(isChecked);

                                if(isChecked) {
                                    values.flight = "";
                                }
                            }}
                        />                        
                    </Col>
                    {
                        customFlight ?
                        (
                            <Row className='gy-2'>
                                <Col xs={12} sm={6}>
                                    <Form.Label className="fw-bold d-block">Start Date <label className='text-danger'>*</label></Form.Label>
                                    <DatePickerField
                                        name="start_date"
                                        value={values.start_date}
                                        placeholderText={"Select Trip Start date"}
                                        onChange={setFieldValue} // Pass Formik's setFieldValue
                                    />                            
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Form.Label className="fw-bold d-block">End Date <label className='text-danger'>*</label></Form.Label>
                                    <DatePickerField
                                        name="end_date"
                                        value={values.end_date}
                                        placeholderText={"Select Trip End date"}
                                        onChange={setFieldValue} // Pass Formik's setFieldValue
                                    />                            
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold d-block">Country <label className='text-danger'>*</label></Form.Label>
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
                                <Col xs={12} sm={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold d-block">City <label className='text-danger'>*</label></Form.Label>
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
                        )
                        :
                        (
                            <></>
                        )
                    }
                    
{/* 
                    <formik.FieldArray name="friends">
                    {({ push, remove }) => (
                        <div>
                        {values.friends.map((friend, index) => (
                            <div key={index}>
                            <DatePickerField
                                name={`friends[${index}]`}
                                value={values.friends[index]}
                                placeholderText={"Select Trip End date"}
                                onChange={setFieldValue} // Pass Formik's setFieldValue
                            /> 
                            <button type="button" onClick={() => remove(index)}>
                                -
                            </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => push('')}>
                            +
                        </button>
                        </div>
                    )}
                    </formik.FieldArray> */}
                </Row>
        </Modal.Body>
        <Modal.Footer>
            {warning &&
                <div className='d-flex justify-content-center me-auto ms-auto'>
                    <Alert variant='danger'>{warning}</Alert>
                </div>
            }
            <Row className='m-0 p-0'>
                <div className='d-flex justify-content-end gap-2'>
                    <Button variant="secondary" onClick={handleModalClose}>
                    Close
                    </Button>
                    <Button variant={action === "add" ? "info" : "warning"} className='text-light' onClick={handleSubmit}>
                    {action === "add" ? "Create Itinerary" : "Edit Itinerary"}
                    </Button>
                </div>
            </Row>
        </Modal.Footer>

        </Form>
        )}
        </Formik>
    </Modal>
    )
}
