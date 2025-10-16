import { Card, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../_app";
import { useAtom } from "jotai";
import { isBlockedAtom } from "@/store";
import SearchHotelStep1 from "@/components/hotel/SearchHotelStep1";
import SearchHotelStep2 from "@/components/hotel/SearchHotelStep2";
import SearchHotelStep3 from "@/components/hotel/SearchHotelStep3";

export default function SearchHotel() {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    const { theme } = useContext(ThemeContext);
    const router = useRouter();
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

    const handleBookHotel = (hotelData) => {
        const allData = { ...formData, ...hotelData };

        // Only pass serializable fields in query
        const queryData = {
            flightPrice: allData.flightPrice,
            flightName: allData.flightName,
            hotelPrice: allData.hotelPrice,
            hotelName: allData.hotelName,
            // Include other primitive fields from formData if needed
            departure_city: allData.departure_city,
            arrival_city: allData.arrival_city,
            outbound_date: allData.outbound_date,
            return_date: allData.return_date,
            check_in_date: allData.check_in_date,
            check_out_date: allData.check_out_date,
            adults: allData.adults,
            children: allData.children,
            currency: allData.currency,
        };

        // Check if both flightPrice and hotelPrice exist
        if (allData.flightPrice && allData.hotelPrice) {
            router.push({
                pathname: '/payment/payment',
                query: queryData,
            });
        } else {
            router.push({
                pathname: '/search/flight',
                query: queryData,
            });
        }
    };

    const handleNext = (data) => {
        setFormData(prev => ({ ...prev, ...data }));
        setPageCount(prev => prev + 1);
    };

    const handlePrevious = () => setPageCount(prev => prev - 1);

    const renderStep = () => {
        switch (pageCount) {
            case 1: return <SearchHotelStep1 onNext={handleNext} initialData={formData} />;
            case 2: return <SearchHotelStep2 onNext={handleNext} onPrevious={handlePrevious} initialData={formData} />;
            case 3: return <SearchHotelStep3 onBookHotel={handleBookHotel} onPrevious={handlePrevious} initialData={formData} />;
            default: return null;
        }
    };

    return (
        <div>
            <Row className="mt-2">
                <Card className="bg-dark text-white m-0 p-0">
                    <Card.Img className="img-title rounded-0" src="/images/search_hotels_title.png" alt="Card image" />
                    <Card.ImgOverlay className="d-flex align-items-center px-4 px-md-5">
                        <Card.Title><h1>Search Hotels</h1></Card.Title>
                    </Card.ImgOverlay>
                </Card>
            </Row>
            <hr /><br />
            {renderStep()}
        </div>
    );
}