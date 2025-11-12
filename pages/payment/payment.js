import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import styles from '@/styles/paymentPage.module.css';

export default function Payment() {
    const router = useRouter();
    const { query } = router;

    const [total, setTotal] = useState(0);
    const [taxes, setTaxes] = useState(0);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Determine total based on available data
        let subtotal = 0;

        if (query.planPrice) {
            subtotal = parseFloat(query.planPrice);
        } else {
            const flightPrice = parseFloat(query.flightPrice) || 0;
            const hotelPrice = parseFloat(query.hotelPrice) || 0;
            subtotal = flightPrice + hotelPrice;
        }

        const tax = subtotal * 0.13;
        setTaxes(tax);
        setTotal(subtotal + tax);
    }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!cardNumber || !expiry || !cvc || !nameOnCard || !billingAddress) {
            setError('Please fill in all required fields.');
            return;
        }

        //add to user's flight
        

        setError('');
        alert(`Payment successful! Total charged: $${total.toFixed(2)}`);
        router.push('/');
    };

    if (!query) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <h2 className={styles.title}>Payment</h2>
                <Form className={styles.form} onSubmit={handleSubmit}>
                    <h5 className={styles.sectionTitle}>Payment Method</h5>
                    <div className={styles.paymentMethods}>
                        <Button variant="outline-light" className={styles.methodBtn}>Credit Card</Button>
                        <Button variant="outline-light" className={styles.methodBtn}>PayPal</Button>
                        <Button variant="outline-light" className={styles.methodBtn}>Apple Pay</Button>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <Form.Group controlId="cardNumber">
                        <Form.Control
                            type="text"
                            placeholder="Card Number"
                            className={styles.inputField}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                        />
                    </Form.Group>

                    <div className={styles.inputRow}>
                        <Form.Control
                            type="text"
                            placeholder="MM/YY"
                            className={styles.inputHalf}
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                        />
                        <Form.Control
                            type="text"
                            placeholder="CVC"
                            className={styles.inputHalf}
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                        />
                    </div>

                    <Form.Group controlId="nameOnCard">
                        <Form.Control
                            type="text"
                            placeholder="Name on Card"
                            className={styles.inputField}
                            value={nameOnCard}
                            onChange={(e) => setNameOnCard(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="billingAddress">
                        <Form.Control
                            type="text"
                            placeholder="Billing Address"
                            className={styles.inputField}
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                        />
                    </Form.Group>

                    <div className={styles.summary}>
                        {query.planPrice ? (
                            <div className={styles.summaryRow}>
                                <span>Plan:</span>
                                <span>${parseFloat(query.planPrice).toFixed(2)}</span>
                            </div>
                        ) : (
                            <>
                                <div className={styles.summaryRow}>
                                    <span>Flight:</span>
                                    <span>${parseFloat(query.flightPrice || 0).toFixed(2)}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Hotel:</span>
                                    <span>${parseFloat(query.hotelPrice || 0).toFixed(2)}</span>
                                </div>
                            </>
                        )}
                        <div className={styles.summaryRow}>
                            <span>Taxes:</span>
                            <span>${taxes.toFixed(2)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <strong>Total:</strong>
                            <strong>${total.toFixed(2)}</strong>
                        </div>
                    </div>

                    <Button type="submit" className={styles.payBtn} onClick={handleSubmit}>Pay Now</Button>
                </Form>
            </Card>
        </div>
    );
}
