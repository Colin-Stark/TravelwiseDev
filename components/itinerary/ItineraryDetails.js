import { Alert, Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { formatMinutes, formatCurrency, getCityList } from '@/lib/airportData';
import { DatePickerField } from '../DatePickerField';
import { useEffect, useRef, useState } from 'react';
import * as formik from 'formik';
import * as yup from 'yup';
import { useAtom } from 'jotai';
import { userAtom } from '@/store';
import { getUser, getUserFlights } from '@/lib/userData';
import { Typeahead } from 'react-bootstrap-typeahead';

export default function ItineraryDetails({show, handleModalClose, handleAction, itineraryObj, status, action, countryOptions, theme}) {
    const [user, setUser] = useAtom(userAtom);
    
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
        departure_country : action === "add" ? "" : itineraryObj.country,
        departure_city : action === "add" ? "" : itineraryObj.city,
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

    return (
    <Modal show={show} onHide={handleModalClose} data-bs-theme={theme}>
        <Modal.Header closeButton>
            <Modal.Title>{action === "add" ? "Create New Itinerary" : "Edit Itinerary"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Formik
                validationSchema={schema}
                onSubmit={(values)=>{handleSubmit(values)}}
                initialValues={initialValues}
            >
            {({ handleSubmit, handleChange, values, touched, errors, setFieldValue}) => (
            <Form onSubmit={handleSubmit} as={formik.Form}>
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
                                return <option key={`user_flight_${index}`} value={flight.departure_token}>{`${flight.city}, ${flight.country} (${flight.departure_date} - ${flight.return_date})`}</option>
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
                                            defaultSelected={[initialValues.departure_country]}
                                            onChange={(newVal) => {
                                                values.departure_country = newVal[0];
                                                loadCityData(newVal[0]);
                                                setCountry(newVal[0]);

                                                values.departure_city = "";
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
                                            defaultSelected={[initialValues.departure_city]}
                                            ref={inputRef}
                                            onChange={(newVal) => {
                                                values.departure_city = newVal[0];

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
            </Form>
            )}
            </Formik>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
            Close
            </Button>
            <Button variant={action === "add" ? "info" : "warning"} className='text-light' onClick={()=>{
                handleAction(itineraryObj, status); 
                handleModalClose();
            }}>
            {action === "add" ? "Create Itinerary" : "Edit Itinerary"}
            </Button>
        </Modal.Footer>
    </Modal>
    )
}
