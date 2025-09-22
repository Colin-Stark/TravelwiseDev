import { ThemeContext } from "@/pages/_app";
import { isBlockedAtom, objByCityAtom, objByCountryAtom } from "@/store";
import { useAtom } from "jotai";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { fetchCountryCsv, filterObjByCity, filterObjByCountry, getCityList, getCountryList } from "@/lib/airportData";
import { Typeahead } from "react-bootstrap-typeahead";

export default function SearchFlightStep3(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    const { theme } = useContext(ThemeContext);
    const [warning, setWarning] = useState("");
    const [options, setOptions] = useState({});
    const [objByCity, setObjByCity] = useAtom(objByCityAtom);
    const [selectedAirport, setSelectedAirport] = useState(null);

    useEffect(() => {
        //remove page blocker
        setIsBlocked(false);

        if(!props?.initialData["city"]) {
            props.onPrevious();
        }
        else {
            //load city list
            loadData()
        }

    }, []);

    useEffect(() => {
        if(warning !== "") {
            //remove page blocker
            setIsBlocked(false);
        }

    }, [warning]);

    async function loadData() {        
        var currentObj = await filterObjByCountry(props.initialData.country);
        currentObj = await filterObjByCity(props.initialData.city, currentObj);
        setObjByCity(currentObj);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setWarning(""); // Clear previous warnings
        if(!selectedAirport) {
            setWarning("Please choose an airport");
            return;
        }

        console.log(selectedAirport);
        //setIsBlocked(true); //block actions
        //props.onNext({"airport": airport});
    }
    
    const handleCardClick = (value) => {
        setSelectedAirport(value);
    };

    return (
        options ? (
        <Form className="mt-4" onSubmit={handleSubmit}>
            <h2 className="text-center">Which airport will you be arriving from?</h2>
            <p className="text-center">Select one from the available airports</p>
            {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
            <Row className='gy-4 m-3'>
            {
                objByCity ? objByCity.map((airport, index) => (
                    <Col md={4} key={index} onClick={()=>handleCardClick(airport.IATA)}>
                        <Card className={selectedAirport === airport.IATA ? 'card-selectable active' : 'card-selectable' } role='button'>
                            <Card.Body>
                                    <div className='d-flex justify-content-between align-items-center'>
                                            <Form.Check 
                                                type="radio"
                                                id={`check_${index}`}
                                                name='airport'
                                                value={airport.IATA}
                                                checked={selectedAirport === airport.IATA}
                                                onChange={() => setSelectedAirport(airport.IATA)}
                                            />
                                            <Row className='text-end'>
                                                <Col xs={12} className='fw-bold'>
                                                    {airport.Name}
                                                </Col>
                                                <Col xs={12}>
                                                    {airport.City}
                                                </Col>
                                                <Col xs={12}>
                                                    {airport.Country}
                                                </Col>
                                            </Row>
                                    </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )) : []
            }
            </Row>
            <br />
            <Row className="d-flex justify-content-between align-items-center g-2 mx-5">
                <Col className="text-center text-sm-start">
                    <Button variant="outline-secondary" size="lg" className="rounded" type="button" onClick={()=>props.onPrevious()}>Previous</Button>
                </Col>
                <Col className="text-center text-sm-end">
                    <Button variant="outline-primary" size="lg" className="rounded" type="button" onClick={handleSubmit}>Search Flights</Button>
                </Col>
            </Row>
            <br />
        </Form>
        ) : (
            <></>
        )
    )
}