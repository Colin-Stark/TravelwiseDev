import { Card, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../_app";
import { useAtom } from "jotai";
import { isBlockedAtom, selectedFlightAtom } from "@/store";
import SearchFlightStep1 from "@/components/flight/SearchFlightStep1";
import SearchFlightStep2 from "@/components/flight/SearchFlightStep2";
import SearchFlightStep3 from "@/components/flight/SearchFlightStep3";
import SearchFlightStep4 from "@/components/flight/SearchFlightStep4";
import Payment from "../payment/payment";

export default function SearchFlight() {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    const [selectedFlight, setSelectedFlight] = useAtom(selectedFlightAtom);
    const { theme } = useContext(ThemeContext);
    const router = useRouter();
    const [warning, setWarning] = useState("");
    const [pageCount, setPageCount] = useState(1);
    const [formData, setFormData] = useState({});

    // Initialize formData with query parameters
    useEffect(() => {
        if (router.query && Object.keys(router.query).length > 0) {
            const parsedQuery = {};
            Object.keys(router.query).forEach(key => {
                // Convert stringified numbers to actual numbers
                parsedQuery[key] = !isNaN(router.query[key]) ? Number(router.query[key]) : router.query[key];
            });
            setFormData(prev => ({ ...prev, ...parsedQuery }));
        }
        setIsBlocked(false);
    }, [router.query, setIsBlocked]);

    useEffect(() => {
        if (warning !== "") setIsBlocked(false);
    }, [warning]);

    const handleBookFlight = (flightData) => {
        // const allData = { ...formData, ...flightData };

        // // Only pass serializable fields in query
        // const queryData = {
        //     flightPrice: allData.flightPrice,
        //     flightName: allData.flightName,
        //     hotelPrice: allData.hotelPrice,
        //     hotelName: allData.hotelName,
        //     // Include other primitive fields from formData if needed (e.g., city, dates)
        //     departure_city: allData.departure_city,
        //     arrival_city: allData.arrival_city,
        //     outbound_date: allData.outbound_date,
        //     return_date: allData.return_date,
        //     check_in_date: allData.check_in_date,
        //     check_out_date: allData.check_out_date,
        //     adults: allData.adults,
        //     children: allData.children,
        //     currency: allData.currency,
        // };

        setSelectedFlight(flightData);

        router.push({
            pathname: '/payment/payment',
        });
        
        // if (allData.flightPrice && allData.hotelPrice) {
        //     router.push({
        //         pathname: '/payment/payment',
        //         query: queryData,
        //     });
        // } else {
        //     router.push({
        //         pathname: '/search/hotel',
        //         query: queryData,
        //     });
        // }
    };

    function handleNext(data) {
        setFormData((prevData) => ({ ...prevData, ...data }));

        setPageCount((prevCount) => prevCount + 1);

    }

    function handlePrevious() {
        setPageCount((prevCount) => prevCount - 1);
    }

    const renderStep = () => {
        switch (pageCount) {
            case 1:
                return <SearchFlightStep1 onNext={handleNext} initialData={formData} />;
            case 2:
                return <SearchFlightStep2 onNext={handleNext} onPrevious={handlePrevious} initialData={formData} />;
            case 3:
                return <SearchFlightStep3 onNext={handleNext} onPrevious={handlePrevious} initialData={formData} />;
            case 4:
                return <SearchFlightStep4 onNext={handleNext} onPrevious={handlePrevious} initialData={formData} onBookFlight={handleBookFlight} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <Row className="mt-2">
                <Card className="bg-dark text-white m-0 p-0">
                    <Card.Img className="img-title rounded-0" src="/images/search_flights_title.jpg" alt="Card image" />
                    <Card.ImgOverlay className="d-flex align-items-center px-4 px-md-5">
                        <Card.Title><h1>Search Flights</h1></Card.Title>
                    </Card.ImgOverlay>
                </Card>
            </Row>
            <hr />
            <br />
            {renderStep()}
        </div>
    );
}