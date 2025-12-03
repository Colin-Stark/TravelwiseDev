import moment from 'moment';
import { Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function ConfirmItineraryDelete({show, handleModalClose, handleDelete, itineraryObj, status, theme}) {
    const dateFmt = "YYYY-MM-DD";
    return (
    <Modal show={show} onHide={handleModalClose} data-bs-theme={theme}>
        <Modal.Header closeButton>
            <Modal.Title>Confirm Delete Itinerary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Are you sure you wish to delete the itinerary:</p>
            <p><label className='fw-bold'>Title:</label> {itineraryObj.title}</p>
            <p><label className='fw-bold'>Start Date:</label> {moment(itineraryObj.start_date).format(dateFmt)}</p>
            <p><label className='fw-bold'>End Date:</label> {moment(itineraryObj.end_date).format(dateFmt)}</p>
            <p><label className='fw-bold'>Description:</label> {itineraryObj.description}</p>
            <Alert variant='danger'>This action cannot be undone!</Alert> 
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
            Close
            </Button>
            <Button variant="danger" onClick={()=>{
                handleDelete(itineraryObj, status); 
                handleModalClose();
            }}>
            Delete Itinerary
            </Button>
        </Modal.Footer>
    </Modal>
    )
}
