import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

interface AlertProps {
  show: boolean;
  message: string;
  discription: string;
  variant: string;
  onClose: () => void;
}

const RequestCustomAlert: React.FC<AlertProps> = ({ show, message, discription,variant, onClose }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (show) {
      setVisible(true);
    }
    return () => {
    };
  }, [show]);

  if (!visible) {
    return null;
  }

  return (
    <Alert variant={variant} onClose={() => setVisible(false)} dismissible>
      <h6>{message}</h6>
      <br />
      <p>{discription}</p>
    </Alert>
  );
};

export default RequestCustomAlert;
