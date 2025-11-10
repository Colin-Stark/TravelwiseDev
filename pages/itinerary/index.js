import SavedItineraryCard from '@/components/itinerary/SavedItineraryCard';
import { getUser } from '@/lib/userData';
import { userAtom } from '@/store';
import { useAtom } from 'jotai';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Card, Row, Tab, Tabs } from 'react-bootstrap';
import { Commet } from 'react-loading-indicators';
import { ThemeContext } from "@/pages/_app";
import { fetchCountryData, getCountryList } from '@/lib/airportData';
import ItineraryDetails from '@/components/itinerary/ItineraryDetails';

//dummy data
const upcomingItineraries = [
  {
    id: 3,
    title: 'Paris Adventure',
    start_date: '2025-11-10',
    end_date: '2025-11-18',
    country: 'France',
    city: 'Paris',
    description: 'Explore the Eiffel Tower, Louvre, and enjoy French cuisine.',
    img: '/images/placeholder1.jpg',
  },
  {
    id: 4,
    title: 'Tokyo Highlights',
    start_date: '2025-12-22',
    end_date: '2025-12-26',
    country: 'Japan',
    city: 'Tokyo',
    description: 'Visit Shibuya, temples, and try sushi at Tsukiji Market.',
    img: '/images/placeholder3.jpg',
  },
  {
    id: 5,
    title: 'New York Weekend',
    start_date: '2026-01-12',
    end_date: '2026-01-15',
    country: 'United States',
    city: 'New York',
    description: 'Broadway show, Central Park stroll, and Times Square lights.',
    img: '/images/placeholder2.jpg',
  },
];

const pastItineraries = [
  {
    id: 1,
    title: 'Boracay Adventure',
    start_date: '2025-08-08',
    end_date: '2025-08-21',
    country: 'Philippines',
    city: 'Boracay',
    description: 'Relax in beach resorts',
    img: '/images/placeholder1.jpg',
  },
  {
    id: 2,
    title: 'Quick Getaway Trip',
    start_date: '2025-09-01',
    end_date: '2025-09-03',
    country: 'Canada',
    city: 'Vancouver',
    description: 'Quick trip',
    img: '/images/placeholder3.jpg',
  },
];

const ItineraryPage = () => {
    const { theme } = useContext(ThemeContext);
    
    const [user, setUser] = useAtom(userAtom);
    const [isLoading, setIsLoading] = useState(false);
    const [upcomingTrips, setUpcomingTrips] = useState([]);
    const [pastTrips, setPastTrips] = useState([]);
    const [warning, setWarning] = useState("");
    const [countryObj, setCountryObj] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);    

    const handleModalShow = (event) => {
        setShowAddModal(true);
    };
    const handleModalClose = (action) => {
        setShowAddModal(false);
    }

    useEffect(() => {
        loadData();

        //load data
        loadCountryData();

    }, []);
    
    async function loadCountryData() {
        var cObj = countryObj;
        console.log(cObj);
        if(cObj.length <= 0) {
            cObj = await fetchCountryData();
            setCountryObj(cObj);
        }
        const countries = await getCountryList(cObj);
        setCountryOptions(countries);
    }

    async function loadData() {
        setIsLoading(true); //show loading

        const data = await getUser();
        setUser(data);

        await loadTrips("upcoming");
    }

    async function loadTrips(status) {
        setWarning("");
        setIsLoading(true); //show loading

        // try {
        //     const res = await fetch("/api/itinerary/get-"+status, {  // Changed to same-origin API route
        //         method: 'POST',
        //         headers: {
        //             'content-type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             user: user?.id,
        //             status:  status,
        //         }),
        //     });

        //     const data = await res.json();
        //     if (!res.ok) {
        //         // Try to parse error message from server
        //         let errorMsg = "Error loading trips";
        //         try {
        //             errorMsg = data.message || errorMsg;
        //         } catch (e) { }
        //         setWarning(errorMsg);
        //         setIsLoading(false); //hide loading
        //         return;
        //     }

        //     if(type === "past") {
        //         setPastTrips(data);
        //     }
        //     else {
        //         setUpcomingTrips(data);
        //     }

        // } catch (err) {
        //     setWarning("Network error: " + err.message);
        // }

        //dummy data
        if(status === "past") {
            setPastTrips(pastItineraries);
        }
        else {
            setUpcomingTrips(upcomingItineraries)
        }

        setIsLoading(false); //hide loading
    
    }

    const handleAdd = async (itinerary, status) => {
        setWarning("");
        setIsLoading(true); //show loading

        // try {
        //     const res = await fetch("/api/itinerary/add-itinerary", {  // Changed to same-origin API route
        //         method: 'POST',
        //         headers: {
        //             'content-type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             itinerary: itinerary?.id,
        //         }),
        //     });

        //     const data = await res.json();
        //     if (!res.ok) {
        //         // Try to parse error message from server
        //         let errorMsg = "Error deleting itinerary";
        //         try {
        //             errorMsg = data.message || errorMsg;
        //         } catch (e) { }
        //         setWarning(errorMsg);
        //         setIsLoading(false); //hide loading
        //         return;
        //     }

        //     if(type === "past") {
        //         setPastTrips(data);
        //     }
        //     else {
        //         setUpcomingTrips(data);
        //     }

        // } catch (err) {
        //     setWarning("Network error: " + err.message);
        // }

        //reload list
        await loadTrips(status);

        //dummy add
        // var tmpTrips = [];
        // if(status === "past") {
        //     for(const trip of pastTrips) {
        //         if(trip.id !== itinerary.id) {
        //             tmpTrips.push(trip);
        //         }
        //     }

        //     setPastTrips(tmpTrips);
        // }
        // else {
        //     for(const trip of upcomingTrips) {
        //         if(trip.id !== itinerary.id) {
        //             tmpTrips.push(trip);
        //         }
        //     }

        //     setUpcomingTrips(tmpTrips);
        // }

        setIsLoading(false); //hide loading
    
    };

    const handleEdit = async (itinerary, status) => {
        setWarning("");
        setIsLoading(true); //show loading

        // try {
        //     const res = await fetch("/api/itinerary/edit-itinerary", {  // Changed to same-origin API route
        //         method: 'POST',
        //         headers: {
        //             'content-type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             itinerary: itinerary?.id,
        //         }),
        //     });

        //     const data = await res.json();
        //     if (!res.ok) {
        //         // Try to parse error message from server
        //         let errorMsg = "Error deleting itinerary";
        //         try {
        //             errorMsg = data.message || errorMsg;
        //         } catch (e) { }
        //         setWarning(errorMsg);
        //         setIsLoading(false); //hide loading
        //         return;
        //     }

        //     if(type === "past") {
        //         setPastTrips(data);
        //     }
        //     else {
        //         setUpcomingTrips(data);
        //     }

        // } catch (err) {
        //     setWarning("Network error: " + err.message);
        // }

        //reload list
        await loadTrips(status);

        setIsLoading(false); //hide loading
    
    };

    
    const handleDelete = async (itinerary, status) => {
        setWarning("");
        setIsLoading(true); //show loading

        // try {
        //     const res = await fetch("/api/itinerary/delete-itinerary", {  // Changed to same-origin API route
        //         method: 'POST',
        //         headers: {
        //             'content-type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             itinerary: itinerary?.id,
        //         }),
        //     });

        //     const data = await res.json();
        //     if (!res.ok) {
        //         // Try to parse error message from server
        //         let errorMsg = "Error deleting itinerary";
        //         try {
        //             errorMsg = data.message || errorMsg;
        //         } catch (e) { }
        //         setWarning(errorMsg);
        //         setIsLoading(false); //hide loading
        //         return;
        //     }

        //     if(type === "past") {
        //         setPastTrips(data);
        //     }
        //     else {
        //         setUpcomingTrips(data);
        //     }

        // } catch (err) {
        //     setWarning("Network error: " + err.message);
        // }

        //reload list
        await loadTrips(status);

        //dummy delete
        var tmpTrips = [];
        if(status === "past") {
            for(const trip of pastTrips) {
                if(trip.id !== itinerary.id) {
                    tmpTrips.push(trip);
                }
            }

            setPastTrips(tmpTrips);
        }
        else {
            for(const trip of upcomingTrips) {
                if(trip.id !== itinerary.id) {
                    tmpTrips.push(trip);
                }
            }

            setUpcomingTrips(tmpTrips);
        }

        setIsLoading(false); //hide loading
    
    };

    const handleSchedule = async (itinerary) => {
        setWarning("");
        setIsLoading(true); //show loading

        // try {
        //     const res = await fetch("/api/itinerary/edit-itinerary", {  // Changed to same-origin API route
        //         method: 'POST',
        //         headers: {
        //             'content-type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             itinerary: itinerary?.id,
        //         }),
        //     });

        //     const data = await res.json();
        //     if (!res.ok) {
        //         // Try to parse error message from server
        //         let errorMsg = "Error deleting itinerary";
        //         try {
        //             errorMsg = data.message || errorMsg;
        //         } catch (e) { }
        //         setWarning(errorMsg);
        //         setIsLoading(false); //hide loading
        //         return;
        //     }

        //     if(type === "past") {
        //         setPastTrips(data);
        //     }
        //     else {
        //         setUpcomingTrips(data);
        //     }

        // } catch (err) {
        //     setWarning("Network error: " + err.message);
        // }

        //reload list
        await loadTrips(status);

        setIsLoading(false); //hide loading
    
    };

    
    const handleSummary = async (itinerary) => {
        setWarning("");
        setIsLoading(true); //show loading

        // try {
        //     const res = await fetch("/api/itinerary/edit-itinerary", {  // Changed to same-origin API route
        //         method: 'POST',
        //         headers: {
        //             'content-type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             itinerary: itinerary?.id,
        //         }),
        //     });

        //     const data = await res.json();
        //     if (!res.ok) {
        //         // Try to parse error message from server
        //         let errorMsg = "Error deleting itinerary";
        //         try {
        //             errorMsg = data.message || errorMsg;
        //         } catch (e) { }
        //         setWarning(errorMsg);
        //         setIsLoading(false); //hide loading
        //         return;
        //     }

        //     if(type === "past") {
        //         setPastTrips(data);
        //     }
        //     else {
        //         setUpcomingTrips(data);
        //     }

        // } catch (err) {
        //     setWarning("Network error: " + err.message);
        // }

        //reload list
        await loadTrips(status);

        setIsLoading(false); //hide loading
    
    };

  return (
    <div>
        <Row className="mt-2">
            <Card className="bg-dark text-white m-0 p-0">
                <Card.Img className="img-title rounded-0" src="/images/search_flights_title.jpg" alt="Card image" />
                <Card.ImgOverlay className="d-flex align-items-center px-4 px-md-5">
                    <Card.Title><h1>My Trips</h1></Card.Title>
                </Card.ImgOverlay>
            </Card>
        </Row>
        <hr />
        <div className="mx-sm-2 mx-md-5">
            <div className='d-flex justify-content-end my-3'>
                <Button className='btn-info text-light' onClick={handleModalShow}>Create New Trip</Button>
            </div>
            <ItineraryDetails
                show={showAddModal}
                handleModalClose={handleModalClose}
                handleAction={handleAdd}
                itineraryObj={null}
                status={null}
                action="add"
                countryOptions={countryOptions}
                theme={theme}
            />
            <Tabs defaultActiveKey="upcoming" id="uncontrolled-tab-example" className="mb-3" onSelect={loadTrips}>
                <Tab eventKey="upcoming" title="Upcoming Trips">
                {
                    isLoading ? (
                        <div className="d-flex justify-content-center align-items-center py-3">
                            <Commet size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
                        </div>
                    ) 
                    :
                    (
                        warning !== "" ?
                        (
                            <Alert variant="danger">{warning}</Alert>
                        )
                        :
                        (
                            <>
                                {
                                    upcomingTrips.length > 0 ?
                                    upcomingTrips.map(itinerary => (
                                        <SavedItineraryCard 
                                            key={itinerary.id} 
                                            itinerary={itinerary} 
                                            status="upcoming"
                                            handleEdit={handleEdit} 
                                            handleDelete={handleDelete} 
                                            handleSummary={handleSummary}
                                            countryOptions={countryOptions}
                                            theme={theme}
                                        />
                                    ))
                                    :
                                    (
                                        <div className="d-flex justify-content-center align-items-center py-3">
                                            <Alert className="w-100 text-center bg-main-tertiary">No upcoming trips found</Alert>
                                        </div>
                                    )
                                }
                            </>
                        )
                    )
                     
                }
               
                </Tab>

                <Tab eventKey="past" title="Past Trips">
                {
                    isLoading ? (
                        <div className="d-flex justify-content-center align-items-center py-3">
                            <Commet size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
                        </div>
                    ) 
                    :
                    (
                        <>
                        {
                            warning !== "" ?
                            (
                                <Alert variant="danger">{warning}</Alert>
                            )
                            :
                            (
                                <>
                                    {
                                        pastTrips.length > 0 ?
                                        pastTrips.map(itinerary => (
                                            <SavedItineraryCard 
                                                key={itinerary.id} 
                                                itinerary={itinerary} 
                                                status="past" 
                                                handleEdit={handleEdit}
                                                handleDelete={handleDelete} 
                                                handleSummary={handleSummary}
                                                countryOptions={countryOptions}
                                                theme={theme}
                                            />
                                        ))
                                        :
                                        (
                                            <div className="d-flex justify-content-center align-items-center py-3">
                                                <Alert className="w-100 text-center bg-main-tertiary">No past trips found</Alert>
                                            </div>
                                        )
                                    }
                                </>
                            )
                        
                        }
                        </>
                    )
                }
                </Tab>
            </Tabs>
        </div>
    </div>
  );
};

export default ItineraryPage;
