import { ThemeContext } from "@/pages/_app";
import { isBlockedAtom } from "@/store";
import { useAtom } from "jotai";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Image } from "react-bootstrap";
import { formatCurrency } from "@/lib/airportData";
import { getHotelList } from "@/lib/hotelData";
import * as formik from 'formik';
import * as yup from 'yup';
import { Commet } from "react-loading-indicators";
import StyledDataTable from "../StyledDataTable";
import HotelDetails from "./HotelDetails";

export default function SearchFlightStep4(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    const { theme } = useContext(ThemeContext);
    const [warning, setWarning] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hotelsData, setHotelsData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedHotelObj, setSelectedHotelObj] = useState({});

    const initialValues = {
        hotel : props.initialData["hotel"] ? props.initialData["hotel"] : "",
    };

    const tableColumns = [
    {
        cell: (props) => {
            return props?.images?.length > 0 ? 
            (
                <Image className="cell-img" src={props.images[0].thumbnail} alt="hotel img" fluid />
            )
            : (
                <></>
            )
        },
    },
    {
        name: 'Hotel',
        selector: row => row?.name,
        sortable: true,
        cell: (props) => <label className="text-wrap" title={props?.name}>{props?.name}</label>,
    },
    {
        name: 'Type',
        selector: row => row?.type,
        sortable: true,
    },
    {
        name: 'Price',
        selector: row => row?.rate_per_night?.extracted_lowest,
        sortable: true,
        cell: (props) => <label className="text-nowrap">{formatCurrency(props?.rate_per_night?.extracted_lowest, 'en-US', initialValues.currency)}</label>,
    },
    {
        name: 'Rating',
        selector: row => row?.overall_rating,
        sortable: true,
        cell: (props) => <label className="text-nowrap">{props.overall_rating}<i className="bi bi-star-fill text-yellow-300 ms-2 text-sm"></i></label>,
    },
    {
        name: 'Reviews',
        selector: row => row?.reviews,
        sortable: true,
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
        //convert property types to number
        var property_types = [];
        for(const item of props.initialData?.property_types) {
            property_types.push(parseInt(item, 10));
        }

        //convert hotel classes to number
        var hotel_class = [];
        for(const item of props.initialData?.hotel_class) {
            hotel_class.push(parseInt(item, 10));
        }

        //fix some value types in json properties
        const properties = {
            ...props.initialData,
            property_types : property_types.join(","),
            hotel_class : hotel_class.join(","),
        }

        console.log(properties);

        const hotelObj = await getHotelList(properties);
        setHotelsData(hotelObj);

        console.log(hotelObj);

    }

    const handleModalShow = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);
    async function handleRowClick(hotelObj) {
        setSelectedHotelObj(hotelObj);
        handleModalShow();
    }

    const handleSubmit = (hotelObj) => {
            if (!hotelObj) return alert("Please select a hotel first");

            const hotelPrice = hotelObj.rate_per_night?.extracted_lowest
                ? parseFloat(hotelObj.rate_per_night.extracted_lowest)
                : 0;

            const hotelData = {
                ...props.initialData,
                hotelObj,
                hotelName: hotelObj.name,
                hotelPrice
            };

            props.onBookHotel(hotelData);
        };



    return (
        hotelsData?.length > 0 ? (
        <Formik
            validationSchema={schema}
            initialValues={initialValues}
        >
        {({ handleChange, values, touched, errors, setFieldValue}) => (
        <Form className="mx-sm-2 mx-md-5" onSubmit={()=>handleSubmit(selectedHotelObj)} as={formik.Form}>
            <h3 className="text-center">Hotel Results</h3>
            <p className="text-center">View available hotels to book</p>
            {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
            <Card className="main-shadow">
                <Card.Body>
                    <Row className="d-flex gy-2">
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Check-in Date</Form.Label>
                            <Form.Label className="d-block">{props.initialData.check_in_date}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Check-out Date</Form.Label>
                            <Form.Label className="d-block">{props.initialData.check_out_date}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Number of Adults</Form.Label>
                            <Form.Label className="d-block">{props.initialData.adults}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Number of Children</Form.Label>
                            <Form.Label className="d-block">{props.initialData.children}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Location</Form.Label>
                            <Form.Label className="d-block">{`${props.initialData.city}, ${props.initialData.country}`}</Form.Label>                
                        </Col>
                        <Col sm={6} md={4}>
                            <Form.Label className="fw-bold d-block">Max Price</Form.Label>
                            <Form.Label className="d-block">{props.initialData.max_price !== "" ? formatCurrency(props.initialData.max_price, 'us-en', props.initialData.currency) : "Any Price"}</Form.Label>                
                        </Col>
                    </Row>
                </Card.Body>
            </Card> 
            <br/>
            <StyledDataTable
                columns={tableColumns}
                data={hotelsData}
                onRowClicked={handleRowClick}
            />
            <HotelDetails 
                show={showModal}
                handleModalClose={handleModalClose}
                handleSubmit={handleSubmit}
                hotelObj={selectedHotelObj}
                currency={initialValues.currency}
                theme={theme}
            >
            </HotelDetails>                   
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