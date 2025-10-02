import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  body: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, onHide, onConfirm, title, body }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body > <strong className='text-center'>{body}</strong></Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="dark" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
