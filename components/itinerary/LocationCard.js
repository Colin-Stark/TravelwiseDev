import moment, { duration } from 'moment';
import React, { useState } from 'react';
import { Card, Row, Col, Badge, Image, Accordion, ListGroup, Button } from 'react-bootstrap';
import { FaPlaneDeparture, FaPlaneArrival, FaClock } from 'react-icons/fa';
import { formatMinutes } from '@/lib/airportData';
import ConfirmLocationDelete from './ConfirmLocationDelete';
import LocationDetails from './LocationDetails';

const LocationCard = ({ location, day, time, duration, index, transition, handleEdit, handleDelete, handleCancel, handleSelect, selected, country, city, itinerary, countryObj, theme }) => {
    const timeStr = duration ? `Stop #${index+1} ⋅ ${time} ⋅ (${formatMinutes(location?.duration)})` : `Stop #${index+1} ⋅ ${time}`;

    const [showEditModal, setShowEditModal] = useState(false);    
    const [showDeleteModal, setShowDeleteModal] = useState(false);    
    const handleModalShow = (event, action) => {

        if(event.target.className.includes('action-btn') && action === "edit") {
            return;
        }

        if(action === "edit") {
            setShowEditModal(true);
        }
        else if(action === "delete") {
            setShowDeleteModal(true);
        }
    };
    const handleModalClose = (action) => {
        if(action === "edit") {
            setShowEditModal(false);
        }
        else if(action === "delete") {
            setShowDeleteModal(false);
        }
    }

    const cardClass = selected ? "rounded-4 main-shadow" : "rounded-4 main-shadow card-selectable";

  return (
    <div>
        {
            time && index > 0 &&
            <div className='d-flex justify-content-center align-items-center'>
                <label className='line-connect bg-secondary'></label>   
            </div>                 
        }
        <Card className={cardClass} onClick={(e)=> {
                if(selected) {
                    return;
                }
                else if(!time) {
                    handleSelect(location);
                    return;
                }
                handleModalShow(e, "edit")
            }
        } role={selected ? 'default' : 'button'}>
        <Card.Header className="bg-main-tertiary rounded-top-4">
            <h5 className="mb-0 text-light text-center">{time ? timeStr : location?.title}</h5>
        </Card.Header>        
        <Card.Body>
            <Row className='justify-content-center gy-2'>
                <div className='d-flex justify-content-between'>
                    <div>
                        {time ? <h5 className='text-main-tertiary'><label className='text-nowrap'>{location?.title}</label></h5> : <></>}
                        <label className='text-secondary'>{location?.type}{location?.service_options?.onsite_services ? <label className='ms-2'>⋅<i className='bi bi-person-wheelchair ms-2 text-primary'></i></label> : <></>}</label>
                    </div>
                    <div>
                        <label className='text-secondary'>{location?.open_state}</label>
                        {location?.phone && <label className='d-block text-secondary text-end'><strong>Phone:</strong> {location?.phone}</label>}
                    </div>
                </div>
                <Col sm={6}>
                    <label className='d-block'><strong>Address:</strong> {location?.address}</label>
                    <label className='d-block'><strong>Description:</strong> {location?.description}</label>
                    {location?.price && <label className='d-block'><strong>Estimated Price:</strong> {location?.price}</label>}
                    <label className='d-block'><strong>Rating:</strong> {location?.rating}<i className="bi bi-star-fill text-yellow-300 ms-2"></i> <label className='text-secondary'>({location?.reviews})</label></label>
                    {location?.user_review && <label className='d-block'><strong>User Review:</strong> {location?.user_review}</label>}
                </Col>
                <Col sm={6}>
                    <Row className='justify-content-between align-items-center g-3'>
                        <Col sm={12} md={8}>
                            <div className='d-flex justify-content-center align-items-center gap-2'>
                                <Image className="location-img" src={location?.serpapi_thumbnail ? location?.serpapi_thumbnail : (location?.thumbnail ? location?.thumbnail : "/images/location_default.png")} alt="itinerary img" fluid />
                            </div>
                        </Col>
                    {
                        selected ? (
                        <Col sm={12} md={4}>
                            <Row className='g-2'>
                                <Button variant='outline-secondary' onClick={(e)=>handleCancel()}>Deselect</Button>
                            </Row>
                        </Col>
                        )
                        : (
                        <Col sm={12} md={4}>
                            <Row className='g-2'>
                                { !time && <Button variant='outline-primary' className='action-btn' onClick={(e)=>handleSelect(location)}>Select</Button>}
                                { time && <Button className='btn-warning text-light' onClick={(e)=>handleModalShow(e, "edit")}>Edit Schedule</Button>}
                                { time && <Button className='btn-danger action-btn' onClick={(e)=>handleModalShow(e, "delete")}>Remove</Button>}
                            </Row>
                        </Col>
                        )
                    }
                    </Row>
                </Col>
            </Row>
            
        </Card.Body>
        </Card>

        {
            transition ? (
                <Row className='border border-main-tertiary rounded mb-3 p-2 text-center justify-content-center align-items-center mx-2'>
                    <Col xs={2}>
                        <FaClock size={30} className="text-main-tertiary" />
                    </Col>
                    <Col xs={10}>
                        <div className='d-flex gap-2 justify-content-center align-items-center'>
                            <label className='text-main-tertiary'>{transition?.type}</label>
                        </div>
                        <label className='text-main-tertiary'>{transition?.duration}</label>
                    </Col>
                </Row>
            )
            : 
            (
                <></>
            )
        }

        <ConfirmLocationDelete
            show={showDeleteModal}
            handleModalClose={()=>handleModalClose("delete")}
            handleDelete={handleDelete}
            day={day}
            locationObj={location}
            theme={theme}
        />

        <LocationDetails
            show={showEditModal}
            handleModalClose={()=>handleModalClose("edit")}
            handleAction={handleEdit}
            locationObj={location}
            action="edit"
            country={country}
            city={city}
            day={day}
            itinerary={itinerary}
            countryObj={countryObj}
            theme={theme}
        />

    </div>
  );
};

export default LocationCard;
