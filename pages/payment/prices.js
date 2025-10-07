import {Card} from 'react-bootstrap';
import styles from '@/styles/paymentPage.module.css'
export default function price(){
    var i = 0;
    const cards = [];
    while (i < 3){
        cards.push(
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                    <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the content.
                    </Card.Text>
                    <Card.Link href="#">Card Link</Card.Link>
                    <Card.Link href="#">Another Link</Card.Link>
                </Card.Body>
            </Card>
        )
        i++;
    }
    return (
      <div className={styles.container}>{cards}</div>
    );
}