import { Button, Card, Navbar, Row, Col, Image } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { getUserCookie, checkValidLogin } from "@/lib/cookies";
import { useAtom } from "jotai";
import { isBlockedAtom } from "@/store";

export default function Home() {
  const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
  const [step, setStep] = useState(1);
  
  useEffect(() => {
      //remove page blocker
      setIsBlocked(false);

      //checkValidLogin();

  }, []);

  return (
    <Row className="m-0">
      {/* <Col md={3} className="p-0">
        <DashboardSidebar />
      </Col> */}

      <Col md={9} className="p-4 bg-black text-white">
        <h2 className="mb-4">Welcome back, Marc</h2>

        {/* Upcoming Trips */}
        <h5>Upcoming Trips</h5>
        <Row className="mb-4">
          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Img src="/placeholder.png" alt="Trip 1" />
              <Card.Body>
                <Card.Title>Image 1</Card.Title>
                <Card.Text>Start date - End date</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Img src="/placeholder.png" alt="Trip 2" />
              <Card.Body>
                <Card.Title>Image 2</Card.Title>
                <Card.Text>Start date - End date</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Img src="/placeholder.png" alt="Trip 3" />
              <Card.Body>
                <Card.Title>Image 3</Card.Title>
                <Card.Text>Start date - End date</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Expense Tracking */}
        <h5>Expense Tracking</h5>
        <Card className="bg-dark text-white p-4 mb-4">
          <h3>Amount</h3>
          <p>Duration <span className="text-success">Increment</span></p>
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
              <Card.Img src="/placeholder.png" alt="City 1" />
              <Card.Body>
                <Card.Title>Recommendation 1</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Img src="/placeholder.png" alt="City 2" />
              <Card.Body>
                <Card.Title>Recommendation 2</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Img src="/placeholder.png" alt="City 3" />
              <Card.Body>
                <Card.Title>Recommendation 3</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
  
}
