/* istanbul ignore file */
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

interface AlertProps {
  show: boolean;
  message: string;
  variant: string;
  onClose: () => void;
}

const CustomAlert: React.FC<AlertProps> = ({ show, message, variant, onClose }) => {
  const [visible, setVisible] = useState(show);

  /* istanbul ignore next */
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 4000); // 4 seconds 
    }
    return () => {
      clearTimeout(timer); 
    };
  }, [show]);

  if (!visible) {
    return null;
  }

  return (
    <Alert variant={variant} onClose={() => setVisible(false)} dismissible>
      {message}
    </Alert>
  );
};

export default CustomAlert;
