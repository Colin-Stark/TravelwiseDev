import { Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function ConfirmLocationDelete({show, handleModalClose, handleDelete, day, locationObj, theme}) {
    return (
    <Modal show={show} onHide={handleModalClose} data-bs-theme={theme}>
        <Modal.Header closeButton>
            <Modal.Title>Confirm Delete Itinerary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Are you sure you wish to delete the following location in this itinerary:</p>
            <p><label className='fw-bold'>Title:</label> {locationObj.title}</p>
            <p><label className='fw-bold'>Time:</label> {locationObj.time}</p>
            <p><label className='fw-bold'>Duration:</label> {locationObj.duration}</p>
            <Alert variant='danger'>This action cannot be undone!</Alert> 
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
            Close
            </Button>
            <Button variant="danger" onClick={()=>{
                handleDelete(locationObj, day); 
                handleModalClose();
            }}>
            Delete Location
            </Button>
        </Modal.Footer>
    </Modal>
    )
}
