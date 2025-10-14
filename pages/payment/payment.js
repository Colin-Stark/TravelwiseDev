import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import styles from '@/styles/paymentPage.module.css';

export default function Payment() {
  const router = useRouter();
  const { plan } = router.query;
  const [planData, setPlanData] = useState(null);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [error, setError] = useState('');

  const plans = {
    Basic: { price: 0, label: 'Free /month' },
    Premium: { price: 9.99, label: '$9.99 /month' },
    Pro: { price: 19.99, label: '$19.99 /month' },
  };

  useEffect(() => {
    if (plan && plans[plan]) {
      setPlanData(plans[plan]);
    }
  }, [plan]);

  if (!planData) return <div className={styles.loading}>Loading...</div>;

  const taxes = planData.price * 0.13;
  const total = planData.price + taxes;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic field validation
    if (!cardNumber || !expiry || !cvc || !nameOnCard || !billingAddress) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    alert(`Payment successful for ${plan} plan!`);
    router.push('/');
  };

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
            <div className={styles.summaryRow}>
              <span>Plan:</span>
              <span>{plan}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>${planData.price.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Taxes:</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <strong>Total:</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>

          <Button type="submit" className={styles.payBtn}>
            Pay Now
          </Button>
        </Form>
      </Card>
    </div>
  );
}
