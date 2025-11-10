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
import { getLocation, getLocationList } from '@/lib/locationData';
import LocationCard from './LocationCard';
import { Commet } from 'react-loading-indicators';
import moment from 'moment';

export default function LocationDetails({show, handleModalClose, handleAction, locationObj, action, country, city, day, theme}) {
    const [user, setUser] = useAtom(userAtom);
    const mainLoc = country ? `${city}, ${country}` : '';
    
    const [warning, setWarning] = useState("");
    const [selectLoc, setSelectLoc] = useState(null);
    const [selectFormType, setSelectFormType] = useState(action === "add" ? 1 : locationObj?.form_type);
    const [searchQuery, setSearchQuery] = useState("");
    const [startSearch, setStartSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [selectIsLoading, setSelectIsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const targetRef = useRef(null); // Create a ref to attach to the target element

    const scrollToTarget = () => {
        if (targetRef.current) {
        targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const initDate = locationObj?.time ? new Date('2025-12-12 '+locationObj?.time) : null;

    const initialValues = {
        time : action === "add" ? "" : initDate,
        duration : action === "add" ? "" : locationObj.duration,
    };

    const { Formik } = formik;
    const schema = yup.object().shape({
        time: yup.date(),
        duration: yup.number(),
    });

    useEffect(() => {
        if(show === true) {
            setSelectLoc(locationObj);
            
            //load data
            loadData();
        }

    }, [show]);

    async function loadData() {
        setSelectIsLoading(true);

        const data = await getUser();
        setUser(data);

        // const data_loc = await getLocation(locationObj.place_id);
        setSelectLoc(locationObj);

        setSelectIsLoading(false);

    }

    async function handleSearch() {
        setWarning("");
        setIsLoading(true); //show loading
        setStartSearch(false);

        if(!searchQuery?.trim()) {
            setWarning("Search Query must not be empty");
            return;
        }

        const properties = {
            q: searchQuery,
            location: mainLoc,
        }
        setLocations(await getLocationList(properties));

        setIsLoading(false); //hide loading
        setStartSearch(true);
    }

    async function handleSelect(selectedLoc) {
        setSelectLoc(selectedLoc);
        scrollToTarget();
    }

    const handleSubmit = (values) => {
        setWarning("");

        if(!values.time) {
            setWarning("Arrival Time must not be empty");
            return;
        }
        if(!(values.time instanceof Date)) {
            setWarning("Arrival Time must be a valid date");
            return;
        }
        if(!values.duration) {
            setWarning("Duration must not be empty");
            return;
        }
        if(values.duration < 15) {
            setWarning("Duration must be at least 15 minutes");
            return;
        }
        if(!selectLoc) {
            setWarning("Must select a location");
            return;
        }

        const dateTime = moment(values.time.toString());
        const formValues = {
            day: day,
            time: dateTime.format("h:mm A"),
            prevTime: locationObj?.time,
            duration: values.duration,
        }
        console.log(formValues);

        handleAction(selectLoc, formValues);
        handleModalClose();
    };

    return (
    <Modal show={show} onHide={handleModalClose} data-bs-theme={theme} size='lg'>
        <Modal.Header closeButton>
            <Modal.Title>{action === "add" ? "Add Location to Schedule" : "Edit Schedule"}</Modal.Title>
        </Modal.Header>
        <Formik
            validationSchema={schema}
            onSubmit={(values)=>{handleSubmit(values)}}
            initialValues={initialValues}
        >
        {({ handleSubmit, handleChange, values, touched, errors, setFieldValue}) => (
        <Form onSubmit={()=>handleSubmit(values)} as={formik.Form}>
        <Modal.Body>
            <Row className='gy-3 align-items-center'>
                <Col xs={12} sm={6}>
                    <Form.Label className="fw-bold d-block">Arrival Time<label className='text-danger'>*</label></Form.Label>
                    <DatePickerField
                        name="time"
                        value={values.time}
                        placeholderText={"Select Arrival Time"}
                        onChange={setFieldValue} // Pass Formik's setFieldValue
                        timeOnly={1}
                    />                            
                </Col>
                <Col xs={12} sm={6}>
                    <Form.Label className="fw-bold d-block">Duration (hours)<label className='text-danger'>*</label></Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="Enter duration of stay in location" 
                        name="duration" 
                        value={values.duration}
                        onChange={handleChange}
                        min={15}
                        isInvalid={!!errors.duration}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.duration}
                    </Form.Control.Feedback>                          
                </Col>
                <Col xs={12}>
                    <Form.Label className="fw-bold d-block">Selected Location<label className='text-danger'>*</label></Form.Label>
                    {
                        selectIsLoading ? (
                            <div className="d-flex justify-content-center align-items-center py-3">
                                <Commet size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
                            </div>
                        )
                        : (
                        <div ref={targetRef}>
                        {
                        selectLoc ?
                        <LocationCard
                            location={selectLoc}
                            index={0}
                            theme={theme}
                            selected={1}
                            handleCancel={()=>setSelectLoc(null)}
                        />  
                        :
                        <div className="d-flex justify-content-center align-items-center py-3">
                            <Alert className="w-100 text-center bg-main-tertiary">No location selected</Alert>
                        </div>
                        }
                        </div>
                        )
                    }                         
                </Col>
            </Row>
            <br/>
            <Row className='align-items-end'>
                <h5>Search Locations</h5>
                <hr/>
                <Col xs={12} sm={9}>
                    <Form.Label className="fw-bold d-block">Search Query</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="i.e. tourist spots" 
                        value={searchQuery}
                        onChange={(e)=>{setSearchQuery(e.target.value)}}
                    />                         
                </Col>
                <Col xs={12} sm={3}>
                    <Button onClick={handleSearch}>Search</Button>                        
                </Col>
                
                {
                    startSearch && (
                        <>
                        {
                            isLoading ?
                            (
                                <div className="d-flex justify-content-center align-items-center py-3">
                                    <Commet size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
                                </div>
                            )
                            :
                            (
                                <div>
                                    <br/>
                                    <h6>Search Results</h6>
                                    <br/>
                                    <Row className='gy-3 modal-result-container'>
                                {
                                    locations.map((loc, index)=>(
                                        <LocationCard 
                                            key={`search_loc_${index}`}
                                            location={loc}
                                            index={index}
                                            country={country}
                                            city={city}
                                            handleSelect={handleSelect}
                                            theme={theme}
                                        />
                                    ))
                                }
                                    </Row>
                                </div>
                            )
                        }
                        </>
                    )
                }

            </Row>
        </Modal.Body>
        
        <Modal.Footer>
            {warning &&
            <div className='d-flex justify-content-start me-auto'>
                <Alert variant='danger'>{warning}</Alert>
            </div>}
            <Button variant="secondary" onClick={handleModalClose}>
            Close
            </Button>
            <Button variant={action === "add" ? "info" : "warning"} className='text-light' onClick={handleSubmit}>
            {action === "add" ? "Add to Schedule" : "Edit Schedule"}
            </Button>
        </Modal.Footer>

        </Form>
        )}
        </Formik>
    </Modal>
    )
}
