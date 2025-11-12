import { Alert, Col, Row, Tab, Tabs } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FlightCard from './FlightCard';
import { formatMinutes, formatCurrency } from '@/lib/airportData';

export default function FlightDetails({show, handleModalClose, handleSubmit, flightObj, currency, theme}) {
  return flightObj?.airline_logo ? 
  (
    <Modal show={show} onHide={handleModalClose} data-bs-theme={theme}>
        <Modal.Header closeButton>
            <Modal.Title>Flight Details</Modal.Title>
        </Modal.Header>
    <Modal.Body>
        <Tabs defaultActiveKey="general" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="general" title="General">
                <Row className='g-2'>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Airline Name: </label>
                        <label>{flightObj.airline_name}</label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Flight Type: </label>
                        <label>{flightObj.type}</label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Total Duration: </label>
                        <label>{formatMinutes(flightObj.total_duration)}</label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Price: </label>
                        <label>{formatCurrency(flightObj.price, "en-us", currency)}</label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Layovers: </label>
                        <label>{flightObj.layovers?.length}</label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Emissions: </label>
                        <label>{(flightObj.carbon_emissions?.this_flight / 1000.0)} kg CO<sub>2</sub></label>
                    </Col>
                </Row>
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
        <Button variant="primary" onClick={()=>handleSubmit(flightObj)}>
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
