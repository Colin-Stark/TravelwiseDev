import { Card } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { getUserCookie, checkValidLogin } from "@/lib/cookies";
import { useAtom } from "jotai";
import { isBlockedAtom } from "@/store";

export default function Home() {
  const [isBlocked, setIsBlocked] = useAtom(isBlockedAtom);
  
  useEffect(() => {
      //remove page blocker
      setIsBlocked(false);

      checkValidLogin();

  }, []);

  return <>
    <Card bg="light">
        <Card.Body>
          <h1>Dashboard</h1>
          <p>User: {getUserCookie()?.email}</p>
        </Card.Body>
    </Card>
  </>;
  
}
