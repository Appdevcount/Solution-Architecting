import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { UpdateEscalate} from "../../services/RequestService";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store/store";
import CustomAlert from '../CustomAlert';
import { useFormik } from "formik";
import { ResponseAddTagsModel } from "../../types/ResponseAddTagsModel";

interface ConfirmationModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
    title: string;
    body: React.ReactNode;
}


const Escalate: React.FC<ConfirmationModalProps> = ({ show, onHide, onSuccess, title, body }) => {

    const UserEmail: any = useSelector((state: RootState) => state.auth?.user?.email);
    const request: any = useSelector((state: RootState) => state.request);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
    
        const Escalateformik = useFormik({
            initialValues: {           
              
            },
     onSubmit: async (values) => {
            
                try {

                    const response : ResponseAddTagsModel = await UpdateEscalate(request?.RequestId, UserEmail);
                    if (response.apiResp) {
                        onSuccess();

                        setAlert({ show: true, message: 'Request Updated Successfully!', variant: 'success' });
                        
                    }
                    else {
                        setAlert({ show: true, message: 'Request is not updated!', variant: 'danger' });

                    }
                } catch (error) {
                    if (error instanceof Error) {
                        setAlert({ show: true, message: error.message, variant: 'danger' });
                    } else {
                        setAlert({ show: true, message: 'An unknown error occurred', variant: 'danger' });
                    }
                } 
            }
});


    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-3">
                
                <Form>
                    <Row>
                        <Col>
                        <CustomAlert
                        show={alert.show}
                        message={alert.message}
                        variant={alert.variant as 'success' | 'danger'}
                        onClose={() => setAlert({ ...alert, show: false })}
                    />
                            <Form.Group controlId="formReason">                          
                                <Form.Label className="bold">{body}</Form.Label>                    
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Control type="hidden" name="hiddenField" value="hiddenValue" />
                </Form>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-end">
                <Button variant="dark" onClick={onHide}>
                    No
                </Button>             
                <Button
                    variant="dark"
                    type="button"
                    className="ms-2"
                    onClick={() => {
                        Escalateformik.handleSubmit(); 
                      }}
                >
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Escalate;
