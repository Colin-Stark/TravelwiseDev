import { Card, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../_app";
import { useAtom } from "jotai";
import { isBlockedAtom } from "@/store";
import SearchHotelStep1 from "@/components/hotel/SearchHotelStep1";
import SearchHotelStep2 from "@/components/hotel/SearchHotelStep2";
import SearchHotelStep3 from "@/components/hotel/SearchHotelStep3";

export default function SearchHotel(props) {
    const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
    
    const { theme } = useContext(ThemeContext);
    const router = useRouter();
    const [warning, setWarning] = useState("");
    const [pageCount, setPageCount] = useState(1);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        //remove page blocker
        setIsBlocked(false);

        // const queryString = window.location.search;
        // const urlParams = new URLSearchParams(queryString);
        // const countryParam = urlParams.get('iso');
        // if(countryParam) {
        //     setFormData((prevDa));
        // }
    }, []);

    useEffect(() => {
        if(warning !== "") {
            //remove page blocker
            setIsBlocked(false);
        }

    }, [warning]);

    function handleNext(data) {
        setFormData((prevData) => ({ ...prevData, ...data }));
        setPageCount((prevCount)=>prevCount+1);
    }

    function handlePrevious() {
        setPageCount((prevCount)=>prevCount-1);
    }

    const renderStep = () => {
        switch (pageCount) {
        case 1:
            return <SearchHotelStep1 onNext={handleNext} initialData={formData} />;
        case 2:
            return <SearchHotelStep2 onNext={handleNext} onPrevious={handlePrevious} initialData={formData} />;
        case 3:
            return <SearchHotelStep3 onNext={handleNext} onPrevious={handlePrevious} initialData={formData} />;
        default:
            return null;
        }
    };

   return (
    <div>
        <Row className="mt-2">
            <Card className="bg-dark text-white m-0 p-0">
                <Card.Img className="img-title rounded-0" src={`/images/search_hotels_title.png`} alt="Card image" />
                <Card.ImgOverlay className="d-flex align-items-center px-4 px-md-5">
                    <Card.Title><h1>Search Hotels</h1></Card.Title>
                </Card.ImgOverlay>
            </Card>
        </Row>
        <hr/>
        <br/>
        {renderStep()}
    </div>
    );
}