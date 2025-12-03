import { Alert, Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { DatePickerField } from '../DatePickerField';
import { useEffect, useRef, useState } from 'react';
import * as formik from 'formik';
import * as yup from 'yup';
import { useAtom } from 'jotai';
import { isBlockedAtom, userAtom } from '@/store';
import { getUser } from '@/lib/userData';
import { getDirections, getLocationList } from '@/lib/locationData';
import LocationCard from './LocationCard';
import { Commet } from 'react-loading-indicators';
import moment from 'moment';
import { formatUTCDate } from '@/lib/airportData';

const travelTypes = {
    "0": "Drive",
    "3": "Transit",
    "2": "Walk",
}

export default function LocationDetails({show, handleModalClose, handleAction, locationObj, action, country, city, day, itinerary, countryObj, theme}) {
    const [user, setUser] = useAtom(userAtom);
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    const mainLoc = country ? `${city}, ${country}` : '';
    
    const [warning, setWarning] = useState("");
    const [computeWarning, setComputeWarning] = useState("");
    const [selectLoc, setSelectLoc] = useState(null);
    const [selectFormType, setSelectFormType] = useState(action === "add" ? 1 : locationObj?.form_type);
    const [cityOnly, setCityOnly] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [gl, setGl] = useState("");
    const [startSearch, setStartSearch] = useState(false);
    const [startRecommended, setStartRecommended] = useState(false);
    const [recLocations, setRecLocations] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectIsLoading, setSelectIsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);
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
        cost : action === "add" ? "" : locationObj.cost,
        travel_mode : action === "add" ? "0" : locationObj.travel_mode,
        travel_time : action === "add" ? "" : locationObj.travel_time,
    };

    const { Formik } = formik;
    const schema = yup.object().shape({
        time: yup.date(),
        duration: yup.number(),
        cost: yup.number(),
    });

    useEffect(() => {
        if(show === true) {
            setWarning("");
            setComputeWarning("");
            setSelectLoc(locationObj);
            
            //load data
            loadData();
        }

    }, [show]);

    async function loadData() {
        setSelectIsLoading(true);

        const data = await getUser();
        setUser(data);

        setSelectLoc(locationObj);

        //determine country code
        var tmpGl = gl;
        if(!tmpGl) {
            for(const cObj of countryObj) {
                if(cObj.country_name === country) {
                    tmpGl = cObj.country_code;
                    setGl(tmpGl);
                    break;
                }
            }
        }

        setSelectIsLoading(false);

        if(recLocations.length <= 0) {
            await handleRecommended();
        }

    }

    async function handleSearch() {
        setWarning("");

        if(!searchQuery?.trim()) {
            setWarning("Search Query must not be empty");
            setStartSearch(false);
            return;
        }

        setIsLoading(true); //show loading
        setStartSearch(true);

        const location = cityOnly ? mainLoc : country;
        const q = searchQuery + " in " + location;
        const properties = {
            q: q,
            // location: location,
            gl: gl,
        }
        const data = await getLocationList(properties);
        setLocations(data);

        setIsLoading(false); //hide loading
    }

    async function handleRecommended() {
        setWarning("");

        setIsLoadingRecommended(true); //show loading
        setStartRecommended(true);

        const q = "recommended places to visit in " + mainLoc;
        const properties = {
            q: q,
            // location: location,
            gl: gl,
        }
        const data = await getLocationList(properties);
        setRecLocations(data);

        setIsLoadingRecommended(false); //hide loading
    }

    async function handleSelect(selectedLoc) {
        setSelectLoc(selectedLoc);
        scrollToTarget();
    }

    async function handleCompute(values) {
        setComputeWarning("");

        if(!values.travel_mode) {
            setComputeWarning("Select a travel mode");
            return;
        }
        if(!selectLoc) {
            setComputeWarning("Must select a location");
            return;
        }

        const currTime = values.time ? 
            moment(`2025-12-12 ${values.time.getHours()}:${values.time.getMinutes()}`)
            : moment(`2025-12-12 11:59 PM`);
        //determine the previous location
        var prevLoc = null;
        var prevTime = null;

        var allLocations = [];
        //load all locations
        for(const schedule of itinerary?.schedules) {
            if(moment(formatUTCDate(schedule?.day)).isSame(moment(day))) {
                allLocations = schedule?.locations;
                break;
            }
        }

        for(const loc of allLocations) {
            if(action !== "add" && loc.data_id === selectLoc.data_id) {
                continue;
            }

            const tmpTime = moment(`2025-12-12 ${loc.time}`);
            if(tmpTime.isBefore(currTime)) {
                if(prevTime === null || tmpTime.isAfter(prevTime)) {
                    prevTime = tmpTime;
                    prevLoc = loc;
                }
            }
        }
        
        if(prevLoc === null) {
            setComputeWarning("Cannot compute travel time of starting location");
            return;
        }

        const start_addr = prevLoc?.address;
        const end_addr = selectLoc?.address;
        // const start_addr = prevLoc?.gps_coordinates?.latitude + "," + prevLoc?.gps_coordinates?.longitude;
        // const end_addr = selectLoc?.gps_coordinates?.latitude + "," + selectLoc?.gps_coordinates?.longitude;

        if(start_addr === end_addr) {
            setComputeWarning("No travel time for same location");
            return;
        }

        const properties = {
            start_addr : start_addr,
            end_addr : end_addr,
            travel_mode : parseInt(values.travel_mode),
            gl : gl,
        }

        setIsBlocked(true);
        const data = await getDirections(properties);

        if(data?.directions?.length > 0) {
            values.travel_time = Math.ceil(data.directions[0].duration/60.0)

            if(!values.time) {
                var tmpTime = prevLoc.duration ? prevTime.add(prevLoc.duration, "minutes") : prevTime;
                tmpTime.add(values.travel_time, "minutes");
                values.time = new Date('2025-12-12 '+tmpTime.format("h:mm A"));
            }
        } 
        setIsBlocked(false);

    }

    const handleSubmit = (values) => {
        setWarning("");

        if(!values.time) {
            setWarning("Start Time must not be empty");
            return;
        }
        if(!(values.time instanceof Date)) {
            setWarning("Start Time must be a valid date");
            return;
        }
        if(values.duration && values.duration < 15) {
            setWarning("Duration must be at least 15 minutes");
            return;
        }
        if(values.travel_time && !values.travel_mode) {
            setWarning("Must select a travel mode");
            return;
        }
        if(!selectLoc) {
            setWarning("Must select a location");
            return;
        }

        //check if duration is valid
        if(values.duration) {
            const currTime = moment(`2025-12-12 ${values.time.getHours()}:${values.time.getMinutes()}`);
            //determine the previous location
            var nextLoc = null;
            var nextTime = null;

            var allLocations = [];
            //load all locations
            for(const schedule of itinerary?.schedules) {
                if(moment(formatUTCDate(schedule?.day)).isSame(moment(day))) {
                    allLocations = schedule?.locations;
                    break;
                }
            }

            for(const loc of allLocations) {
                const tmpTime = moment(`2025-12-12 ${loc.time}`);
                if(tmpTime.isAfter(currTime)) {
                    if(nextTime === null || tmpTime.isBefore(nextTime)) {
                        nextTime = tmpTime;
                        nextLoc = loc;
                    }
                }
            }
            if(nextLoc) {
                const newTime = currTime.add(values.duration, "minutes");
                if(newTime.isAfter(nextTime)) {
                    setWarning("Duration goes over the time of next location");
                    return;
                }
            }
        }        

        const dateTime = moment(values.time.toString());
        const formValues = {
            day: day,
            time: dateTime.format("h:mm A"),
            prevTime: locationObj?.time,
            duration: values.duration,
            price: values.cost,
            travel_mode: values.travel_mode,
            travel_time: values.travel_time,
        }

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
                <Col xs={12} sm={4}>
                    <Form.Label className="fw-bold d-block">Start Time <label className='text-danger'>*</label></Form.Label>
                    <DatePickerField
                        name="time"
                        value={values.time}
                        placeholderText={"Select starting/arrival time"}
                        onChange={setFieldValue} // Pass Formik's setFieldValue
                        timeOnly={1}
                    />                            
                </Col>
                <Col xs={12} sm={4}>
                    <Form.Label className="fw-bold d-block">Stay Duration (minutes)</Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="Enter estimated duration of stay in location" 
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
                <Col xs={12} sm={4}>
                    <Form.Label className="fw-bold d-block">Estimated Cost {user && `(${user?.preferences.currency})`}</Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="Enter estimated cost" 
                        name="cost" 
                        value={values.cost}
                        onChange={handleChange}
                        isInvalid={!!errors.cost}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.cost}
                    </Form.Control.Feedback>                          
                </Col>
                <Col xs={12} sm={6}>
                    <Form.Label className="fw-bold d-block">Travel Mode</Form.Label>
                    <fieldset>
                    {
                        Object.entries(travelTypes).map(([val, travelMode], index) => (
                            <Form.Check
                                key={`travel_mode_${val}`}
                                id={`travel_mode_${val}`}
                                label={travelMode}
                                name="travel_mode"
                                type="radio"
                                value={val}
                                checked={values.travel_mode === val}
                                as={formik.Field}
                            />
                        ))
                    }
                    </fieldset>                           
                </Col>
                <Col xs={12} sm={6}>
                    <Row className='justify-content-end align-items-end'>
                        <Col sm={10}>
                            <Form.Label className="fw-bold d-block">Travel Time (minutes)</Form.Label>
                            {
                                computeWarning && <Alert variant='danger'>{computeWarning}</Alert>
                            }
                            <Form.Control 
                                type="number" 
                                placeholder="Enter estimated travel time" 
                                name="travel_time" 
                                value={values.travel_time}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col sm={2}>
                            <Button variant='success' className='mb-1' title='Calculate estimated travel time' onClick={(e)=>handleCompute(values)}><i className='bi bi-calculator'></i></Button> 
                        </Col>
                    </Row>                     
                </Col>
                <Col xs={12}>
                    <Form.Label className="fw-bold d-block">Selected Location <label className='text-danger'>*</label></Form.Label>
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
                            transition={0}
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
            <Tabs defaultActiveKey="recommended_loc" id="recommended-loc-tab" className="mb-3">
                <Tab eventKey="recommended_loc" title="Recommended Locations">
                {
                    startRecommended &&  (
                        <>
                        {
                            isLoadingRecommended ?
                            (
                                <div className="d-flex justify-content-center align-items-center py-3">
                                    <Commet size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
                                </div>
                            )
                            :
                            (
                                <div>
                                    <br/>
                                    <h6>Recommended Places in {mainLoc}</h6>
                                    <br/>
                                    <Row className='gy-3 modal-result-container'>
                                {
                                    recLocations ?
                                    recLocations.map((loc, index)=>(
                                        <LocationCard 
                                            key={`rec_loc_${index}`}
                                            location={loc}
                                            index={index}
                                            country={country}
                                            city={city}
                                            handleSelect={handleSelect}
                                            transition={0}
                                            theme={theme}
                                        />
                                    ))
                                    :
                                    (
                                        <div className="d-flex justify-content-center align-items-center py-3">
                                            <Alert className="w-100 text-center bg-main-tertiary">No locations recommendations found</Alert>
                                        </div>
                                    )
                                }
                                    </Row>
                                </div>
                            )
                        }
                        </>
                    )
                }
                </Tab>
                
                <Tab eventKey="search_loc" title="Search Locations">
                    <Row className='align-items-end'>
                        <h5>Search Locations</h5>
                        <hr/>
                        <Col xs={12}>
                        <Form.Check
                            id='cityOnly'
                            label={`Search within ${city} only`}
                            type="checkbox"
                            defaultChecked={cityOnly}
                            onChange={()=>{
                                const isChecked = !cityOnly;
                                setCityOnly(isChecked);
                            }}
                        />                        
                    </Col>
                        <Col xs={12} sm={9}>
                            <Form.Label className="fw-bold d-block mt-2">Search Query</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder={`i.e. tourist spots in ${city}`}
                                value={searchQuery}
                                onChange={(e)=>{setSearchQuery(e.target.value)}}
                            />                         
                        </Col>
                        <Col xs={12} sm={3}>
                            <Button onClick={handleSearch}>Search</Button>                        
                        </Col>
                        
                        {
                            startSearch &&  (
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
                                            locations ?
                                            locations.map((loc, index)=>(
                                                <LocationCard 
                                                    key={`search_loc_${index}`}
                                                    location={loc}
                                                    index={index}
                                                    country={country}
                                                    city={city}
                                                    handleSelect={handleSelect}
                                                    transition={0}
                                                    theme={theme}
                                                />
                                            ))
                                            :
                                            (
                                                <div className="d-flex justify-content-center align-items-center py-3">
                                                    <Alert className="w-100 text-center bg-main-tertiary">No locations found</Alert>
                                                </div>
                                            )
                                        }
                                            </Row>
                                        </div>
                                    )
                                }
                                </>
                            )
                        }

                    </Row>
                </Tab>

            </Tabs>
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
