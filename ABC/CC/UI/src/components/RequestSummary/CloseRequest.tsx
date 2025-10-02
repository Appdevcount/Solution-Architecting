import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store/store';
import { CloseRequest } from '../../services/RequestService';
import CustomAlert from '../CustomAlert';
import { ResponseCloseRequestModel } from '../../types/ResponseCloseRequestModel';

interface CloseRequestModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    onSuccess: () => void;
    title: string;
    body: React.ReactNode;
    RequestId: string;
}

const CloseRequestForm: React.FC<CloseRequestModalProps> = ({ show,  onHide, onConfirm, onSuccess,title,  body,RequestId}) => {

  const UserEmail: any = useSelector((state: RootState) => state.auth?.user?.email);
  const [caseStatus, setCaseStatus] = useState<string>("")
  const request: any = useSelector((state: RootState) => state.request);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  
  
  
 useEffect(() => {
        if (request.RequestInformation) {
            setCaseStatus(request.RequestInformation.Status);
        }
    }, [request]);
   
    const CloseRequestformik = useFormik({
        initialValues: {
          Reason: '', 
          Status: caseStatus ? caseStatus: 'Closed'
        },
        onSubmit: async (values) => {
            try {
            
              let errors: { [key: string]: string } = {};
              if (!CloseRequestformik.values.Reason || CloseRequestformik.values.Reason.trim().length === 0) {
                errors.Reason = 'Reason cannot consist of only spaces.';
              } else if (CloseRequestformik.values.Reason.trim().length < 5) {
                errors.Reason = 'Reason must be at least 5 characters long.';
              } else if (CloseRequestformik.values.Reason.trim().length > 500) {
                errors.Reason = 'Reason cannot exceed 500 characters.';
              } else if (/^[0-9]*$/.test(CloseRequestformik.values.Reason)) {
                errors.Reason = 'Reason cannot be numeric-only.';
              }             
              
              if (Object.keys(errors).length > 0) {
                CloseRequestformik.setErrors(errors);
                return; 
              }
              
                const response: ResponseCloseRequestModel = await CloseRequest(values.Reason, values.Status,  request?.RequestId, UserEmail);
                if(response.apiResp) {                         
                onSuccess();                  
                onConfirm();  
              }
              else {
                  setAlert({ show: true, message: 'Request  can not be Closed!', variant: 'danger' });

              }
          } catch (error) {
              if (error instanceof Error) {
                  setAlert({ show: true, message: error.message, variant: 'danger' });
              } else {
                  setAlert({ show: true, message: 'An unknown error occurred', variant: 'danger' });
              }
          } 
        },
    });

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-3">
            <CustomAlert
                     show={alert.show}
                     message={alert.message}
                     variant={alert.variant as 'success' | 'danger'}
                     onClose={() => setAlert({ ...alert, show: false })}
                    />
                {body}
                <Form onSubmit={CloseRequestformik.handleSubmit}>
                   
                    <Form.Group controlId="formReason">
                        <Form.Label><div className='fw-normal' style={{fontSize:"14px"}}>Reason</div></Form.Label>
                        <Form.Control
                            as="textarea"
                            name="Reason"
                            size="sm"
                            value={CloseRequestformik.values.Reason}
                            onChange={CloseRequestformik.handleChange}
                            placeholder="Enter your reason here..."
                            required
                        />
                        {CloseRequestformik.touched.Reason && CloseRequestformik.errors.Reason ? (
                        <div className="text-danger">{CloseRequestformik.errors.Reason}</div>
                      ) : null}
                    </Form.Group>                   
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button data-testid= "cancel-button" variant="dark" onClick={onHide}>
                    Cancel
                </Button>
                <Button data-testid= "closed-button" variant="dark"onClick={() => {
                      CloseRequestformik.handleSubmit(); 
                    }}>
                    Close Request
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CloseRequestForm;
