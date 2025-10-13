import { ThemeContext } from "@/pages/_app";
import { isBlockedAtom } from "@/store";
import { useAtom } from "jotai";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Image, Tooltip, OverlayTrigger } from "react-bootstrap";
import { getFlightList, formatMinutes, formatCurrency } from "@/lib/airportData";
import * as formik from 'formik';
import * as yup from 'yup';
import { Commet } from "react-loading-indicators";
import StyledDataTable from "../StyledDataTable";
import FlightDetails from "./FlightDetails";

export default function SearchFlightStep4(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    const { theme } = useContext(ThemeContext);
    const [warning, setWarning] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [flightsData, setFlightsData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedFlightObj, setSelectedFlightObj] = useState({});

    const initialValues = {
        flight : props.initialData["flight"] ? props.initialData["flight"] : "",
    };

    const tableColumns = [
    {
        name: 'Airline',
        selector: row => row?.airline_name,
        sortable: true,
        cell: (props) => {
            return (
                <div className="d-flex gap-2 justify-content-center align-items-center">
                    <Image className="cell-logo" src={props?.airline_logo} alt="airline logo" fluid />
                    <label className="text-nowrap">{props?.airline_name}</label>
                </div>
            )
        },
    },
    {
        name: 'Flight Type',
        selector: row => row?.type,
        sortable: true,
    },
    {
        name: 'Stops',
        selector: row => row?.layovers?.length,
        sortable: true,
        cell: (props) => {

            const renderTooltip = (tProps) => {
                const style = {
                    '--bs-tooltip-max-width': 'auto',
                    '--bs-tooltip-bg': '#1A2433',
                    '--bs-tooltip-border-color': '#1A2433',
                    ...tProps.style,
                };

                return (
                <Tooltip id="button-tooltip" {...tProps} style={style}>
                    {
                        props?.layovers.map((layover, index) => (
                            <p key={index}>
                                {`#${index+1}: ${layover.name} (${layover.id}) => ${formatMinutes(layover.duration)}`}
                            </p>
                        ))
                    }
                </Tooltip>
                )
            };

            return props?.layovers?.length > 0 ? 
            (
                <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
                >
                <label>{props?.layovers?.length}<i className="bi bi-info-circle-fill text-info ms-2"></i></label>
                </OverlayTrigger>
            ) :
            (
                <label>{props?.layovers?.length}</label>
            )
        },
    },
    {
        name: 'Duration',
        selector: row => row?.total_duration,
        sortable: true,
        cell: (props) => formatMinutes(props?.total_duration),
    },
    {
        name: 'Price',
        selector: row => row?.price,
        sortable: true,
        cell: (props) => <label className="text-nowrap">{formatCurrency(props?.price, 'en-US', initialValues.currency)}</label>,
    },
    {
        name: 'Details',
        cell: (props) => <Button variant="success" className="text-nowrap" onClick={()=>{handleRowClick(props)}}>View Details</Button>,
    },
    {
        name: 'Action',
        cell: (props) => <Button onClick={()=>{
            handleSubmit(props);
        }}>Book</Button>,
    },
    ];

    const { Formik } = formik;
    const schema = yup.object().shape({
        flight: yup.string(),
    });

    useEffect(() => {
        //remove page blocker
        setIsBlocked(false);

        //load data
        loadData();

    }, []);

    async function loadData() {
        //fix some value types in json properties
        const properties = {
            ...props.initialData,
            type : parseInt(props.initialData.type, 10),
            travel_class : parseInt(props.initialData.travel_class, 10),
        }

        const flightObj = await getFlightList(properties);
        const allFlights = [
            ...flightObj["best_flights"],
            ...flightObj["other_flights"]
        ];
        setFlightsData(allFlights);
    }

    const handleModalShow = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);
    async function handleRowClick(flightObj) {
        setSelectedFlightObj(flightObj);
        handleModalShow();
    }

    async function handleSubmit(flightObj) 
    {
        if(!flightObj) {
            return;
        }
        console.log(flightObj);
    }

    return (
        flightsData?.length > 0 ? (
        <Formik
            validationSchema={schema}
            initialValues={initialValues}
        >
        {({ handleChange, values, touched, errors, setFieldValue}) => (
        <Form className="mx-sm-2 mx-md-5" onSubmit={() => handleSubmit(selectedFlightObj)} as={formik.Form}>
            <h3 className="text-center">Flight Results</h3>
            <p className="text-center">View available flights to book</p>
            {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
            <Card>
                <Card.Body>
                    <Row className="d-flex gy-2">
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Outbound Date</Form.Label>
                            <Form.Label className="d-block">{props.initialData.outbound_date}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Return Date</Form.Label>
                            <Form.Label className="d-block">{props.initialData.return_date}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Travel Type</Form.Label>
                            <Form.Label className="d-block">{props.initialData.type_name}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Travel Class</Form.Label>
                            <Form.Label className="d-block">{props.initialData.travel_class_name}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Depart</Form.Label>
                            <Form.Label className="d-block">{`${props.initialData.departure_city}, ${props.initialData.departure_country} (${props.initialData.departure_id})`}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Arrive</Form.Label>
                            <Form.Label className="d-block">{`${props.initialData.arrival_city}, ${props.initialData.arrival_country} (${props.initialData.arrival_id})`}</Form.Label>                
                        </Col>
                    </Row>
                </Card.Body>
            </Card> 
            <br/>
            <StyledDataTable
                columns={tableColumns}
                data={flightsData}
                onRowClicked={handleRowClick}
            />
            <FlightDetails 
                show={showModal}
                handleModalClose={handleModalClose}
                handleSubmit={handleSubmit}
                flightObj={selectedFlightObj}
                currency={initialValues.currency}
                theme={theme}
            >
            </FlightDetails>                   
            <br />
            <Row className="d-flex justify-content-between align-items-center g-2 mx-5">
                <Col className="text-center text-sm-start">
                    <Button variant="outline-secondary" size="lg" className="rounded" type="button" onClick={()=>props.onPrevious()} disabled={isLoading}>Previous</Button>
                </Col>
            </Row>
            <br />
        </Form>
        )}
        </Formik>
        ) : (
            <div className="d-flex justify-content-center align-items-center py-3">
                <Commet size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
            </div>
        )
    )
}