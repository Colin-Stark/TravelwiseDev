import moment from 'moment';
import React from 'react';
import { Card, Row, Col, Badge, Image } from 'react-bootstrap';
import { FaPlaneDeparture, FaPlaneArrival, FaClock } from 'react-icons/fa';
import { formatMinutes } from '@/lib/airportData';

const FlightCard = ({ flight, index, numFlights, layovers }) => {

    const departureDate = moment(flight?.departure_airport?.time);
    const formattedSTime = departureDate.format('hh:mm A');
    const formattedSDate = departureDate.format('MMMM DD, YYYY');
    const arrivalDate = moment(flight?.arrival_airport?.time);
    const formattedETime = arrivalDate.format('hh:mm A');
    const formattedEDate = arrivalDate.format('MMMM DD, YYYY');

  return (
    <div>
        <Card className="shadow-lg rounded-4 mb-4">
        <Card.Header className="bg-primary rounded-top-4">
            <h5 className="mb-0 text-light">Flight {index+1} of {numFlights} : <label className='text-nowrap'>{flight?.airline} ({flight?.flight_number})</label></h5>
        </Card.Header>
        <Card.Body>
            <Row className='justify-content-center align-items-center gy-2'>
                <Col sm={2}>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <Image className="cell-logo" src={flight?.airline_logo} alt="airline logo" fluid />
                    </div>
                </Col>
                <Col sm={10}>
                    <Row>
                        <Col md={12}>
                            <Row className='justify-content-start align-items-center'>
                                <Col xs={2} className='text-center'>
                                    <FaPlaneDeparture size={30} className="text-info" />
                                </Col>
                                <Col xs={10}>
                                    <div className='d-flex gap-2'>
                                        <label className='text-2xl'>{formattedSTime}</label>
                                        <label className='text-sm text-secondary'>{formattedSDate}</label>
                                    </div>
                                    <label>{flight?.departure_airport?.name} ({flight?.departure_airport?.id})</label>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={12}>
                            <Row className='justify-content-start align-items-center'>
                                <Col xs={2} className='text-center'>
                                    <label className='line-connect bg-secondary'></label>                    
                                </Col>
                                <Col xs={10}>
                                    <div className='d-flex gap-2'>
                                        <label className='text-sm text-secondary'>{formatMinutes(flight?.duration)}</label>
                                        {
                                            flight?.overnight ? (
                                                <i className='text-sm bi bi-exclamation-triangle-fill text-danger'> Overnight</i>
                                            )
                                            : (<></>)
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={12}>
                            <Row className='justify-content-start align-items-center'>
                                <Col xs={2} className='text-center'>
                                    <FaPlaneArrival size={30} className="text-success" />
                                </Col>
                                <Col xs={10}>
                                    <div className='d-flex gap-2'>
                                        <label className='text-2xl'>{formattedETime}</label>
                                        <label className='text-sm text-secondary'>{formattedEDate}</label>
                                    </div>
                                    <label>{flight?.arrival_airport?.name} ({flight?.arrival_airport?.id})</label>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            
        </Card.Body>
        </Card>

        {
            layovers[index] ? (
                <Row className='border border-secondary rounded mb-3 p-2 text-center justify-content-center align-items-center mx-2'>
                    <Col xs={2}>
                        <FaClock size={30} className="text-secondary" />
                    </Col>
                    <Col xs={10}>
                        <div className='d-flex gap-2 justify-content-center align-items-center'>
                            <label className='text-secondary'>{formatMinutes(layovers[index]?.duration)} layover</label>
                            {
                                layovers[index]?.overnight ? (
                                    <i className='bi bi-exclamation-triangle-fill text-danger'> Overnight layover</i>
                                )
                                : (<></>)
                            }
                        </div>
                        <label className='text-secondary'>{layovers[index]?.name} ({layovers[index]?.id})</label>
                    </Col>
                </Row>
            )
            : 
            (
                <></>
            )
        }

    </div>
  );
};

export default FlightCard;
