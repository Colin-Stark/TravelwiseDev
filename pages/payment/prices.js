import { Card, Button, Badge } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from '@/styles/paymentPage.module.css';

export default function Price() {
  const router = useRouter();

  const plans = [
    {
      name: 'Basic',
      price: 0, // numeric
      displayPrice: 'Free',
      per: '/month',
      features: ['Access to basic features', 'Plan up to 3 trips', 'Community support'],
      highlight: '',
    },
    {
      name: 'Premium',
      price: 9.99, // numeric
      displayPrice: '$9.99',
      per: '/month',
      features: ['Unlimited trip planning', 'Advanced AI recommendations', 'Priority support', 'Expense tracking'],
      highlight: 'Most Popular',
    },
    {
      name: 'Pro',
      price: 19.99, // numeric
      displayPrice: '$19.99',
      per: '/month',
      features: ['All Premium features', 'Personalized travel concierge', 'Exclusive discounts', 'Early access to new features'],
      highlight: 'Best Value',
    },
  ];

  const handleSelect = (plan) => {
    router.push(`/payment/payment?plan=${plan.name}&planPrice=${plan.price}`);
  };

  return (
    <div className={styles.pricingContainer}>
      <h2 className={styles.title}>Choose your plan</h2>
      <div className={styles.cardRow}>
        {plans.map((plan, i) => (
          <Card key={i} className={`${styles.planCard} card-selectable`}>
            <Card.Body>
              <div className={styles.cardHeader}>
                <Card.Title className={styles.planName}>{plan.name}</Card.Title>
                {plan.highlight && (
                  <Badge bg={plan.name === 'Pro' ? 'info' : 'primary'} className={styles.badge}>
                    {plan.highlight}
                  </Badge>
                )}
              </div>

              <h2 className={styles.priceText}>
                {plan.displayPrice} <span className={styles.per}>{plan.per}</span>
              </h2>

              <Button className={styles.selectBtn} onClick={() => handleSelect(plan)}>
                Select
              </Button>

              <ul className={styles.featureList}>
                {plan.features.map((f, j) => (
                  <li key={j}>✓ {f}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        ))}
      </div>
      <p className={styles.cancelText}>Cancel anytime. No hidden fees.</p>
    </div>
  );
}
