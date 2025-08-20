import { Card, Form, Alert, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { registerUser } from "@/lib/authenticate";
import { useState } from "react";

export default function Register(props){
    const router = useRouter();
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [warning, setWarning] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await registerUser(user, password, password2);
            router.push('/login');
        } catch (err) {
            setWarning(err.message);
        }
    }

    return (
    <>
        {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
        <Card bg="light">
            <Card.Body><h2>Register</h2>Register for an account</Card.Body>
        </Card>
        <br />
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>User:</Form.Label><Form.Control type="text" placeholder="Enter User Name" id="userName" name="userName" onChange={e => setUser(e.target.value)} />
            </Form.Group>
            <br />
            <Form.Group>
                <Form.Label>Password:</Form.Label><Form.Control type="password" placeholder="Enter Password" id="password" name="password" onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <br />
            <Form.Group>
                <Form.Label>Confirm Password:</Form.Label><Form.Control type="password" placeholder="Re-enter Password" id="password2" name="password2" onChange={e => setPassword2(e.target.value)} />
            </Form.Group>
            <br />
            <Button variant="primary" className="pull-right" type="submit">Register</Button>
        </Form>
    </>
    );
}