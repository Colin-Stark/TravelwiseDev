import { Button, Card, Navbar, Row, Col, Image, Alert } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { getUserCookie, checkValidLogin } from "@/lib/cookies";
import { useAtom } from "jotai";
import { isBlockedAtom } from "@/store";
import { getUser } from "@/lib/userData";
import { Commet } from 'react-loading-indicators';
import moment from "moment";
import { Link } from "react-router-dom";
import { formatCurrency, formatUTCDate } from "@/lib/airportData";

export default function Home() {
  const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
  const [isLoading, setIsLoading] = useState(false)
  const [warning, setWarning] = useState('')
  const [step, setStep] = useState(1);
  const [currentUser, setCurrentUser] = useState('')
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [expenseTracking, setExpenseTracking] = useState({});

  const dateFmt = "MMMM DD, YYYY";
  
  useEffect(() => {
      //remove page blocker
      setIsBlocked(false);

      //checkValidLogin();
      loadData();

  }, []);

  async function loadData() {
    setIsLoading(true); //show loading

    const user = await getUser();
    console.log(user);
    setCurrentUser(user);

    //load user trips
    await loadTrips("upcoming", user);

    setIsLoading(false); //show loading
  }

  async function loadTrips(status, dataUser=null) {
      setWarning("");
      // setIsLoading(true); //show loading

      const tmpUser = dataUser ? dataUser : user;
      try {
          const res = await fetch("/api/itinerary/get-itineraries", {  // Changed to same-origin API route
              method: 'POST',
              headers: {
                  'content-type': 'application/json',
              },
              body: JSON.stringify({
                  email: tmpUser?.email,
              }),
          });

          const data = await res.json();
          if (!res.ok) {
              // Try to parse error message from server
              let errorMsg = "Error loading trips";
              try {
                  errorMsg = data.message || errorMsg;
              } catch (e) { }
              setWarning(errorMsg);
              setIsLoading(false); //hide loading
              return;
          }

          if(data.success) {
              const userTrips = data.data;
              var userUpcomingTrips = [];
              //var userPastTrips = [];
              const dateNow = moment().format("YYYY-MM-DD");
              for(const userTrip of userTrips) {

                  if(moment(dateNow).isAfter(moment(formatUTCDate(userTrip.end_date)))) {
                      //userPastTrips.push(userTrip);
                  }
                  else {
                      userUpcomingTrips.push(userTrip);
                  }
              }

              console.log(userUpcomingTrips);
              //sort by date
              userUpcomingTrips.sort((a,b)=>new Date(a.start_date) - new Date(b.start_date));

              const maxShown = 3;
              if(userUpcomingTrips.length >= maxShown) {
                userUpcomingTrips = userUpcomingTrips.slice(0, maxShown);
              }

              //compute expenses for upcoming
              if(userUpcomingTrips?.length > 0) {
                const trip = userUpcomingTrips[0];

                const flightCost = trip.flight?.price;
                const hotelCost = trip.hotel?.price;

                var totalCost = flightCost + hotelCost;

                console.log(trip);
                //cost per day
                var dayArr = [];
                for(const schedule of trip.schedules) {
                  var dayCost = 0;
                  for(const loc of schedule.locations) {
                    if(loc.price && loc.price > 0) {
                      dayCost += loc.price;
                    } 
                  }
                  totalCost += dayCost;

                  dayArr.push({
                    "day": moment(formatUTCDate(schedule.day)).format(dateFmt),
                    "cost": dayCost,
                    "stops": schedule.locations?.length ? schedule.locations?.length : 0,
                  });
                }

                const properties = {
                  itinerary: trip,
                  flightCost: flightCost,
                  hotelCost: hotelCost,
                  days: dayArr,
                  totalCost: totalCost,
                };
                console.log(properties);
                setExpenseTracking(properties);
              }

              setUpcomingTrips(userUpcomingTrips);
              //setPastTrips(userPastTrips);
          }

      } catch (err) {
          setWarning("Network error: " + err.message);
      }

      // setIsLoading(false); //hide loading
  
  }

  const handleSchedule = async (itinerary) => {
      window.open(`/itinerary/manage-schedule?id=${itinerary._id}`, "_blank");
  };

  return (
    <Row className="m-0">
      {/* <Col md={3} className="p-0">
        <DashboardSidebar />
      </Col> */}

      <Col md={12} className="p-4 bg-black text-white">
        <h2 className="mb-4">Welcome back, {currentUser?.firstName ? currentUser.firstName : ""}</h2>

        {/* Upcoming Trips */}
        <h5>Upcoming Trips</h5>
        <Row className="mb-4 gy-4">
          {
            isLoading ? (
              <div className="d-flex justify-content-center align-items-center py-3">
                  <Commet size='large' color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
              </div>
            )
            :
            upcomingTrips?.length > 0 ?
              (
                upcomingTrips?.map((trip, index) => (
                <Col md={4} key={`upcoming_${index}`} onClick={()=>handleSchedule(trip)}>
                  <Card className="bg-dark text-white card-selectable">
                    <Card.Img src={trip.img} className="dashboard-img" alt={`Trip ${index+1}`}/>
                    <Card.Body>
                      <Card.Title>{`${trip.city}, ${trip.country}`}</Card.Title>
                      <Card.Text>{`${moment(formatUTCDate(trip.start_date)).format(dateFmt)} - ${moment(formatUTCDate(trip.end_date)).format(dateFmt)}`}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                ))
              )
              :
              (
                <div className="d-flex justify-content-center align-items-center py-3">
                    <Alert className="w-100 text-center bg-main-tertiary">
                      <Row>
                        <label>No upcoming trips found</label>
                        <div className="d-flex justify-content-center align-items-center mt-3">
                          <a href="./itinerary" className="text-light">
                            <Button size="lg" variant="info" className="text-light">
                              Create New Trip
                            </Button>
                          </a>
                        </div>        
                      </Row>
                    </Alert>
                </div>
              )
          }
        </Row>

        {/* Expense Tracking */}
        <h5>Expense Tracking</h5>
        {
          upcomingTrips?.length > 0 ?
          <Card className="bg-dark text-white p-4 mb-4 main-shadow">
            <h3 className="text-center text-main-tertiary">{`${expenseTracking.itinerary.title} (${expenseTracking.itinerary.city}, ${expenseTracking.itinerary.country})`}</h3>
            <h3 className="text-center">Total Cost: {`${formatCurrency(expenseTracking.totalCost, 'us-en', currentUser.preferences.currency)}`}</h3>

            <div className="d-sm-flex justify-content-center gap-3 m-2">
              <label>{`Flight Cost: ${formatCurrency(expenseTracking.flightCost, 'us-en', currentUser.preferences.currency)}`}</label>
              <label>{`Hotel Cost: ${formatCurrency(expenseTracking.hotelCost, 'us-en', currentUser.preferences.currency)}`}</label>
            </div>
            
            {/* Placeholder for chart */}
            <Row className="justify-content-between align-items-center gy-2 mt-3">
              {
                expenseTracking.days.map((dayObj, index)=> (
                  <Col key={`day_cost_${index}`}>
                    <div className="border rounded border-main-tertiary p-3">
                      <h5 className="text-main-tertiary">{`${dayObj.day}`}</h5>
                      <div className="d-md-flex justify-content-start align-items-center gap-2">
                        <p>{`# of Stops: ${dayObj.stops}`}</p>
                        <p>{`Cost: ${formatCurrency(dayObj.cost, 'us-en', currentUser.preferences.currency)}`}</p>
                      </div>
                    </div>
                  </Col>
                ))
              }
            </Row>
          </Card>
          :
          (
            <div className="d-flex justify-content-center align-items-center py-3">
                <Alert className="w-100 text-center bg-main-tertiary">No upcoming trip to display expenses</Alert>
            </div>
          )
        }

        {/* Personalized Recommendations */}
        {/* <h5>Personalized Recommendations</h5>
        <Row>
          <Col md={4}>
            <Card className="bg-dark text-white card-selectable">
              <Card.Img src="/images/placeholder4.jpg" className="recommend-img" alt="City 1"/>
              <Card.Body>
                <Card.Title>Grand Canyon, US</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-dark text-white card-selectable">
              <Card.Img src="/images/placeholder5.jpg" className="recommend-img" alt="City 2"/>
              <Card.Body>
                <Card.Title>El Nido, PH</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-dark text-white card-selectable">
              <Card.Img src="/images/placeholder6.jpg" className="recommend-img" alt="City 3"/>
              <Card.Body>
                <Card.Title>Kyoto, JP</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row> */}

      </Col>
    </Row>
  );
  
}
