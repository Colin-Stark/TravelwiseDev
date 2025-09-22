import { Button, Card, Navbar } from "react-bootstrap";
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

  const handleNext = () => {
        setStep(step + 1);
      };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  return <>
    <Card bg="light">
        <Card.Body>
          <h1>Dashboard</h1>
          <p>User: {getUserCookie()?.email}</p>
        </Card.Body>
    </Card>
  </>;
  
}
