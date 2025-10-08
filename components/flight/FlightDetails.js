import { useState } from 'react';
import { Alert, Tab, Tabs } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FlightCard from './FlightCard';

export default function FlightDetails({show, handleModalClose, handleModalSubmit, flightObj, theme}) {
  return flightObj?.airline_name ? 
  (
    <Modal show={show} onHide={handleModalClose} data-bs-theme={theme}>
        <Modal.Header closeButton>
            <Modal.Title>Flight Details</Modal.Title>
        </Modal.Header>
    <Modal.Body>
        <Tabs defaultActiveKey="general" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="general" title="General">
                <p>Content for General tab</p>
            </Tab>
            <Tab eventKey="Flights" title="Flights">
            {
                flightObj?.flights?.map((flight, index) => (
                    <FlightCard key={index} flight={flight} index={index} numFlights={flightObj?.flights?.length} layovers={flightObj?.layovers} />
                ))
            }
            </Tab>
          </Tabs>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
            Close
        </Button>
        <Button variant="primary" onClick={handleModalSubmit}>
            Book Flight
        </Button>
    </Modal.Footer>
    </Modal>
  ) :
  (
    <Modal show={show} onHide={handleModalClose}>
        <Modal.Header closeButton>
            <Modal.Title>Flight Details</Modal.Title>
        </Modal.Header>
        <Modal.Body><Alert variant='danger'>Error retrieving flight data!</Alert></Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
            Close
            </Button>
        </Modal.Footer>
    </Modal>
  )
}
