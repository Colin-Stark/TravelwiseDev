import { ThemeContext } from "@/pages/_app";
import { isBlockedAtom } from "@/store";
import { useAtom } from "jotai";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { fetchCountryCsv, getCityList, getCountryList } from "@/lib/airportData";
import { Typeahead } from "react-bootstrap-typeahead";

export default function SearchFlightStep2(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    const { theme } = useContext(ThemeContext);
    const [warning, setWarning] = useState("");
    const [options, setOptions] = useState({});

    const initialSelection = props.initialData["city"] ? props.initialData.city : "";
    const [city, setCity] = useState(initialSelection);

    useEffect(() => {
        //remove page blocker
        setIsBlocked(false);

        if(!props?.initialData["country"]) {
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
        const cities = await getCityList(props.initialData.country);
        setOptions(cities);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setWarning(""); // Clear previous warnings
        if(!city) {
            setWarning("Please choose from the options provided");
            return;
        }

        setIsBlocked(true); //block actions
        props.onNext({"city": city});
    }

    return (
        options ? (
        <Form className="mt-4" onSubmit={handleSubmit}>
            <Row className="d-flex justify-content-center align-items-center m-0 p-0">
                <Col className="mb-6 px-2 px-md-3 px-lg-5">
                    <h2 className="text-center">Which city in {props.initialData.country} do you want land on?</h2>
                    <p className="text-center">Select one from the available cities</p>
                    {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
                    <Form.Group>
                        <Typeahead
                            id="ity"
                            options={options}
                            placeholder="Choose a city..."
                            defaultSelected={[initialSelection]}
                            onChange={(val)=>setCity(val[0])}
                            onKeyDown={(event) => {
                            if(event.key === 'Enter') {
                                event.preventDefault(); 
                                handleSubmit(event);
                            }
                            }}
                        />
                        {/* <Form.Control.Feedback type="invalid">
                        {"Country is required"}
                        </Form.Control.Feedback> */}
                    </Form.Group>                        
                </Col>
            </Row>
            <br />
            <Row className="d-flex justify-content-between align-items-center g-2 mx-5">
                <Col className="text-center text-sm-start">
                    <Button variant="outline-secondary" size="lg" className="rounded" type="button" onClick={()=>props.onPrevious()}>Previous</Button>
                </Col>
                <Col className="text-center text-sm-end">
                    <Button variant="outline-primary" size="lg" className="rounded" type="button" onClick={handleSubmit}>Next</Button>
                </Col>
            </Row>
            <br />
        </Form>
        ) : (
            <></>
        )
    )
}