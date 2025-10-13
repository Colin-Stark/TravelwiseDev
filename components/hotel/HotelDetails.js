import { Alert, Carousel, Col, Row, Tab, Tabs, Image, Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { formatCurrency } from '@/lib/airportData';
import { getMatchingIcon } from '@/lib/iconData';

function imageExists(image_url){

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;

}

export default function FlightDetails({show, handleModalClose, handleSubmit, hotelObj, currency, theme}) {
  return hotelObj?.name ? 
  (
    <Modal show={show} onHide={handleModalClose} data-bs-theme={theme} size='lg'>
        <Modal.Header closeButton>
            <Modal.Title>Hotel Details</Modal.Title>
        </Modal.Header>
    <Modal.Body>
        <Tabs defaultActiveKey="general" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="general" title="General">
                <Row className='g-2'>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Hotel Name: </label>
                        <label>{hotelObj.name}</label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Type: </label>
                        <label>{hotelObj.type}</label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Check-in Time: </label>
                        <label>{hotelObj.check_in_time}</label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Check-out Time: </label>
                        <label>{hotelObj.check_out_time}</label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Price: </label>
                        <label>{formatCurrency(hotelObj.rate_per_night.extracted_lowest, "en-us", currency)}</label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Rating: </label>
                        <label>{hotelObj.overall_rating}<i className="bi bi-star-fill text-yellow-300 ms-2"></i></label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Total Reviews: </label>
                        <label>{hotelObj.reviews}</label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Location Rating: </label>
                        <label>{hotelObj.location_rating}<i className="bi bi-star-fill text-blue-300 ms-2"></i></label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>GPS Latitude: </label>
                        <label>{hotelObj.gps_coordinates?.latitude}</label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>GPS Longitude: </label>
                        <label>{hotelObj.gps_coordinates?.longitude}</label>
                    </Col>
                    <Col xs={6}>
                        <label className='fw-bold me-2'>Site Link: </label>
                        <a href={hotelObj.link} target='_blank'>{hotelObj.link}</a>
                    </Col>
                    {
                        hotelObj.amenities?.length > 0 ? 
                        (
                            <Col xs={12}>
                                <label className='fw-bold me-2'>Amenities</label>
                                <Row className='p-3'>
                                {
                                    hotelObj.amenities?.map((amenity, index)=>{
                                        const icon = getMatchingIcon(amenity);
                                        return (
                                            <Col xs={12} sm={6} md={4} lg={3} key={`amenity_${index}`} className='border p-2 text-center'>
                                                <i className={`bi bi-${icon} me-2`}></i>
                                                <label>{amenity}</label>
                                            </Col>
                                        )
                                    })
                                }
                                </Row>
                            </Col>
                        )
                        :
                        (
                            <></>
                        )
                    }
                    
                </Row>
            </Tab>
            <Tab eventKey="Images" title="Images">
            {
                hotelObj?.images?.length > 0 ?
                (
                    <Carousel data-bs-theme={theme === "dark" ? "light" : "dark"}>
                    {
                        hotelObj?.images?.map((image, index) => (
                            <Carousel.Item key={`img_${index}`}>
                                <Row className="justify-content-center align-items-center">
                                    <Image className="carousel fluid" src={image.original_image} onError={(e)=>{e.target.src = image.thumbnail}} alt="hotel-img" />
                                </Row>
                            </Carousel.Item>
                        ))
                    }
                    </Carousel>
                )
                :
                (
                    <Alert className="w-100 text-center bg-main-tertiary">No images available</Alert>
                )
            }
            </Tab>
            <Tab eventKey="Reviews" title="Review Breakdowns">
                <label className='fw-bold d-block'>Ratings Count Breakdown</label>
                <Row className='gx-0 mt-2'>
            {
                hotelObj.ratings?.map((rating, index) => {
                    var icon = "star-fill";
                    if(rating.stars > 1 && rating.stars <= 3) {
                        icon = "star-half";
                    }
                    else if(rating.stars <= 1) {
                        icon = "star";
                    }

                    return (
                    <Col key={`rate_${index}`} className='text-center'>
                        <label className='d-block border'>{rating.stars}<i className={`bi bi-${icon} text-yellow-300 ms-2`}></i></label>
                        <label className='d-block border'>{rating.count}</label>
                    </Col>)
                })
            }
                </Row>
                <label className='fw-bold mt-2 ms-2 me-2'>Total Count: </label>
                <label>{hotelObj.reviews}</label>
                <label className='fw-bold mt-4 d-block'>Reviews Breakdown</label>
                <Row className='g-2 mt-3'>
            {
                hotelObj?.reviews_breakdown?.map((review, index) => (
                    <Col sm={12} md={6} key={`review_${index}`}>
                        <Card>
                            <Card.Header className='bg-main-tertiary'><Card.Title>{review.name}</Card.Title></Card.Header>
                            <Card.Body>
                                <label className='fw-bold me-2'>Description: </label>
                                <label>{review.description}</label>
                                <br/>                                
                                <label className='fw-bold d-block'>Count Breakdown</label>
                                <Row className='gx-0 mt-2'>
                                    <Col xs={4} className='text-center'>
                                        <label className='d-block border'><i className={`bi bi-emoji-smile-fill text-yellow-300`}></i></label>
                                        <label className='d-block border'>{review.positive}</label>
                                    </Col>
                                    <Col xs={4} className='text-center'>
                                        <label className='d-block border'><i className={`bi bi-emoji-neutral-fill text-blue-300`}></i></label>
                                        <label className='d-block border'>{review.neutral}</label>
                                    </Col>
                                    <Col xs={4} className='text-center'>
                                        <label className='d-block border'><i className={`bi bi-emoji-frown-fill text-red-400`}></i></label>
                                        <label className='d-block border'>{review.negative}</label>
                                    </Col>
                                </Row>
                                <label className='fw-bold mt-2 ms-2 me-2'>Total Count: </label>
                                <label>{review.total_mentioned}</label>
                            </Card.Body>
                        </Card>
                    </Col>
                ))
            }
                </Row>
            </Tab>
          </Tabs>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
            Close
        </Button>
        <Button variant="primary" onClick={()=>handleSubmit(hotelObj)}>
            Book Hotel
        </Button>
    </Modal.Footer>
    </Modal>
  ) :
  (
    <Modal show={show} onHide={handleModalClose}>
        <Modal.Header closeButton>
            <Modal.Title>Hotel Details</Modal.Title>
        </Modal.Header>
        <Modal.Body><Alert variant='danger'>Error retrieving hotel data!</Alert></Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
            Close
            </Button>
        </Modal.Footer>
    </Modal>
  )
}
