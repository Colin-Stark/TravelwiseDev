import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Image, Accordion, ListGroup, Button } from 'react-bootstrap';
import { formatMinutes, formatUTCDate } from '@/lib/airportData';
import ConfirmItineraryDelete from './ConfirmItineraryDelete';
import ItineraryDetails from './ItineraryDetails';
import { getUpcomingLocation } from '@/lib/locationData';

const SavedItineraryCard = ({itinerary, status, handleEdit, handleDelete, handleSummary, handleSchedule, countryObj, countryOptions, userFlights, flightMap, userHotels, hotelMap, theme}) => {
    const startDate = moment(formatUTCDate(itinerary.start_date));
    const formattedSDate = startDate.format('ddd, MMMM DD, YYYY');
    const endDate = moment(formatUTCDate(itinerary.end_date));
    const formattedEDate = endDate.format('ddd, MMMM DD, YYYY');
    const duration = endDate.diff(startDate, 'days');

    const [showEditModal, setShowEditModal] = useState(false);    
    const [showDeleteModal, setShowDeleteModal] = useState(false);    
    const [showSummaryModal, setShowSummaryModal] = useState(false); 
    const [upcomingLoc, setUpcomingLoc] = useState(null);
    
    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const tmpLoc = await getUpcomingLocation(itinerary);
        setUpcomingLoc(tmpLoc);

        console.log(itinerary);
    }

    const img = itinerary?.schedules?.length > 0 && 
        itinerary.schedules[0].locations?.length > 0 && 
        itinerary.schedules[0].locations[0]?.serpapi_thumbnail ?
            itinerary.schedules[0].locations[0]?.serpapi_thumbnail : "/images/location_default.png";

    const handleModalShow = (event, action) => {

        if(event.target.className.includes('action-btn') && action === "summary") {
            return;
        }

        if(action === "edit") {
            setShowEditModal(true);
        }
        else if(action === "delete") {
            setShowDeleteModal(true);
        }
        else if(action === "summary") {
            handleSummary(itinerary);
            return;
            setShowSummaryModal(true);
        }
    };
    const handleModalClose = (action) => {
        if(action === "edit") {
            setShowEditModal(false);
        }
        else if(action === "delete") {
            setShowDeleteModal(false);
        }
        else if(action === "summary") {
            setShowSummaryModal(false);
        }
    }

  return (
    <div>
        <Card className="rounded-4 mb-4 main-shadow card-selectable" onClick={(e)=>handleModalShow(e, "summary")} role='button'>
            <Card.Header className="bg-main-tertiary rounded-top-4 text-center">
                <h4 className="mb-0 text-light">{itinerary.title}</h4>
            </Card.Header>
            <Card.Body>
                <h5 className='text-main-tertiary pb-2'><label className='text-nowrap'>{formattedSDate}</label> - <label className='text-nowrap'>{formattedEDate}</label></h5>
                <Row className='justify-content-center align-items-center gy-2'>
                    <Col sm={6}>
                        <p><strong>Duration:</strong> {duration} {duration > 1 ? "days" : "day"}</p>
                        <p><strong>Destination:</strong> {`${itinerary.country}, ${itinerary.city}`}</p>
                        <p>{itinerary.description}</p>
                    </Col>
                    <Col sm={6}>
                        <Row className='justify-content-center align-items-center g-3'>
                            <Col sm={12} md={8}>
                                <div className='d-flex justify-content-center align-items-center gap-3'>
                                    <Image 
                                        className="location-img" 
                                        src={itinerary.img} 
                                        alt="destination img" 
                                        title={`Destination: ${itinerary?.city}, ${itinerary?.country}`} 
                                        fluid
                                    />
                                    <Image 
                                        className="location-img" 
                                        src={upcomingLoc?.serpapi_thumbnail ? 
                                            upcomingLoc.serpapi_thumbnail : 
                                            "/images/location_default.png"} 
                                        alt="upcoming img" 
                                        title={upcomingLoc ?
                                            `Upcoming Location: ${upcomingLoc?.title} (${upcomingLoc?.time})` :
                                            "No upcoming location"
                                        } 
                                        fluid
                                    />
                                </div>
                            </Col>
                            <Col sm={12} md={4}>
                                <Row className='g-2'>
                                    { status === "upcoming" && (
                                        <Button className='btn-primary action-btn'  onClick={()=>handleSchedule(itinerary)} title='Manage Schedules'><label className='text-nowrap'><i className='bi bi-calendar-week me-2'></i>Manage Schedules</label></Button>
                                    ) }
                                    <Button className='btn-warning text-light action-btn'  onClick={(e)=>handleModalShow(e, "edit")} title='Edit Trip'><label className='text-nowrap'><i className='bi bi-pencil me-2'></i>Edit Trip</label></Button>
                                    <Button className='btn-danger action-btn max-w-sm' onClick={(e)=>handleModalShow(e, "delete")} title='Delete Trip'><label className='text-nowrap'><i className='bi bi-trash me-2'></i>Delete Trip</label></Button>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                
            </Card.Body>
        </Card>

        <ConfirmItineraryDelete
            show={showDeleteModal}
            handleModalClose={()=>handleModalClose("delete")}
            handleDelete={handleDelete}
            itineraryObj={itinerary}
            status={status}
            theme={theme}
        />

        <ItineraryDetails
            show={showEditModal}
            handleModalClose={()=>handleModalClose("edit")}
            handleAction={handleEdit}
            itineraryObj={itinerary}
            status={status}
            action="edit"
            countryObj={countryObj}
            countryOptions={countryOptions}
            userFlights={userFlights}
            flightMap={flightMap}
            userHotels={userHotels}
            hotelMap={hotelMap}
            theme={theme}
        />
    </div>
  );
};

export default SavedItineraryCard;
