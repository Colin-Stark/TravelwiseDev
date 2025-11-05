import moment from 'moment';
import React, { useState } from 'react';
import { Card, Row, Col, Badge, Image, Accordion, ListGroup, Button } from 'react-bootstrap';
import { formatMinutes } from '@/lib/airportData';
import ConfirmItineraryDelete from './ConfirmItineraryDelete';
import ItineraryDetails from './ItineraryDetails';

const SavedItineraryCard = ({itinerary, status, handleEdit, handleDelete, handleSummary, handleSchedule, countryOptions, theme}) => {

    const startDate = moment(itinerary.start_date);
    const formattedSDate = startDate.format('ddd, MMMM DD, YYYY');
    const endDate = moment(itinerary.end_date);
    const formattedEDate = endDate.format('ddd, MMMM DD, YYYY');
    const duration = endDate.diff(startDate, 'days');

    const [showAddModal, setShowAddModal] = useState(false);    
    const [showEditModal, setShowEditModal] = useState(false);    
    const [showDeleteModal, setShowDeleteModal] = useState(false);    
    const [showSummaryModal, setShowSummaryModal] = useState(false);    
    const handleModalShow = (event, action) => {

        if(event.target.className.includes('action-btn') && action === "summary") {
            return;
        }

        if(action === "add") {
            setShowAddModal(true);
        }
        else if(action === "edit") {
            setShowEditModal(true);
        }
        else if(action === "delete") {
            setShowDeleteModal(true);
        }
        else if(action === "summary") {
            setShowSummaryModal(true);
        }
    };
    const handleModalClose = (action) => {
        if(action === "add") {
            setShowAddModal(false);
        }
        else if(action === "edit") {
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
                                <div className='d-flex justify-content-center align-items-center gap-2'>
                                    <Image className="itinerary-img" src={itinerary.img} alt="itinerary img" fluid />
                                </div>
                            </Col>
                            <Col sm={12} md={4}>
                                <Row className='g-2'>
                                    { status === "upcoming" && (<Button className='btn-primary action-btn'  onClick={()=>handleSchedule(itinerary)}>Manage Schedules</Button>) }
                                    <Button className='btn-warning text-light action-btn'  onClick={(e)=>handleModalShow(e, "edit")}>Edit Trip</Button>
                                    <Button className='btn-danger action-btn' onClick={(e)=>handleModalShow(e, "delete")}>Delete Trip</Button>
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
            countryOptions={countryOptions}
            theme={theme}
        />
    </div>
  );
};

export default SavedItineraryCard;
