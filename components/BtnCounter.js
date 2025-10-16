import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

export default function BtnCounter(props) {
  const [count, setCount] = useState(props.initialValue ? parseInt(props.initialValue, 10) : 0);

  const handleIncrease = () => {
    const maxCount = props.maxCount ? props.maxCount : null;
    if(maxCount !== null && count + 1 > maxCount) {
        return;
    }

    props.onChange(props.name, count+1);
    setCount(prevCount => prevCount + 1);
  };

  const handleDecrease = () => {
    const minCount = props.minCount ? props.minCount : 0;
    if(minCount !== null && count - 1 < minCount) {
        return;
    }

    props.onChange(props.name, count-1);
    setCount(prevCount => prevCount - 1);
  };

  return (
    <div className="d-flex">
      <Button onClick={handleDecrease} className="rounded-circle round-btn me-2 d-flex justify-content-center align-items-center">
        <label className='text-3xl d-block pb-1' role='button'>-</label>
      </Button>
      <h4>{count}</h4>
      <Button onClick={handleIncrease} className="rounded-circle round-btn ms-2 d-flex justify-content-center align-items-center">
        <label className='text-2xl d-block' role='button'>+</label>
      </Button>
    </div>
  );
}
