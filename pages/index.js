import { Button, Card, Navbar, Row, Col, Image } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { getUserCookie, checkValidLogin } from "@/lib/cookies";
import { useAtom } from "jotai";
import { isBlockedAtom } from "@/store";
import { getUser } from "@/lib/userData";

export default function Home() {
  const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
  const [step, setStep] = useState(1);
  const [currentUser, setCurrentUser] = useState('')
  
  useEffect(() => {
      //remove page blocker
      setIsBlocked(false);

      //checkValidLogin();
      setCurrentUser(getUser())
      console.log(getUser())

  }, []);

  return (
    <Row className="m-0">
      {/* <Col md={3} className="p-0">
        <DashboardSidebar />
      </Col> */}

      <Col md={12} className="p-4 bg-black text-white">
        <h2 className="mb-4">Welcome back, Marc</h2>

        {/* Upcoming Trips */}
        <h5>Upcoming Trips</h5>
        <Row className="mb-4">
          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Img src="/images/placeholder1.jpg" className="dashboard-img" alt="Trip 1"/>
              <Card.Body>
                <Card.Title>Jasper, CA</Card.Title>
                <Card.Text>July 15 - July 22</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Img src="/images/placeholder2.jpg" className="dashboard-img" alt="Trip 2"/>
              <Card.Body>
                <Card.Title>Kalibo, PH</Card.Title>
                <Card.Text>August 5 - September 12</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Img src="/images/placeholder3.jpg" className="dashboard-img" alt="Trip 3" />
              <Card.Body>
                <Card.Title>Tokyo, JP</Card.Title>
                <Card.Text>September 1 - September 10</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Expense Tracking */}
        <h5>Expense Tracking</h5>
        <Card className="bg-dark text-white p-4 mb-4">
          <h3>$2,500</h3>
          <p>Last 30 days <span className="text-success">+15%</span></p>
          {/* Placeholder for chart */}
          <div className="d-flex justify-content-between mt-3">
            <div>Food </div>
            <div>Accommodation </div>
            <div>Activities </div>
            <div>Transport </div>
          </div>
        </Card>

        {/* Personalized Recommendations */}
        <h5>Personalized Recommendations</h5>
        <Row>
          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Img src="/images/placeholder4.jpg" className="recommend-img" alt="City 1"/>
              <Card.Body>
                <Card.Title>Grand Canyon, US</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Img src="/images/placeholder5.jpg" className="recommend-img" alt="City 2"/>
              <Card.Body>
                <Card.Title>El Nido, PH</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Img src="/images/placeholder6.jpg" className="recommend-img" alt="City 3"/>
              <Card.Body>
                <Card.Title>Kyoto, JP</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
  
}
