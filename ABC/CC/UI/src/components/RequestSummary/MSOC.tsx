import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { UpdateMSOC } from "../../services/RequestService";
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

const dropdownOptions = [
    { value: "1", label: "Select Reason" },
    { value: "Urgent 48hrs", label: "Urgent 48hrs" },
    { value: "Non Urgent 5d", label: "Non Urgent 5d" },
    { value: "Private Duty Nursing", label: "Private Duty Nursing" },
    { value: "Custom Needs", label: "Custom Needs" },
    { value: "All Other Reasons", label: "All Other Reasons" },
    { value: "Insufficient Lead Time", label: "Insufficient Lead Time" },
    { value: "Referral Source", label: "Referral Source" },
    { value: "Provider Not Available", label: "Provider Not Available" },
    { value: "eviCore Error", label: "eviCore Error" },
];


const MSOC: React.FC<ConfirmationModalProps> = ({ show, onHide, onSuccess, title, body }) => {

    const UserEmail: any = useSelector((state: RootState) => state.auth?.user?.email);
    const [msocTag, setMSOCFlag] = useState(false);
    const request: any = useSelector((state: RootState) => state.request);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
    
    useEffect(() => {
        if (request.RequestInformation) {
            setMSOCFlag(request.msocTag);
        }
    }, [request]);
       
        const MSOCformik = useFormik({
            initialValues: {
              Reason: '', 
              
            },
     onSubmit: async (values) => {
                const formElement = document.querySelector("form"); // Explicitly target the form element
                /* istanbul ignore next */
                if (!formElement) {
                    console.error("Form element not found");
                    return;
                }

                const formData = new FormData(formElement); // Use the form element directly

                const data = {
                    reason: formData.get("reason"),
                    hiddenField: formData.get("hiddenField"),
                };
                try {

                    const response : ResponseAddTagsModel = await UpdateMSOC(values.Reason, request?.RequestId, UserEmail);
                    /* istanbul ignore next */
                    if (response.apiResp) {
                        onSuccess();                       
                    }
                    else {
                        setAlert({ show: true, message: 'MSOC tag can not be added!', variant: 'danger' });

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

    /* istanbul ignore next */
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4">
                {body}
                <Form>
                    <Row className="mb-3">
                        <Col>
                        <CustomAlert
                        show={alert.show}
                        message={alert.message}
                        variant={alert.variant as 'success' | 'danger'}
                        onClose={() => setAlert({ ...alert, show: false })}
                    />
                            <Form.Group controlId="formReason">                          
                                <Form.Label className="fw-semibold">Reason</Form.Label>
                                <Form.Control as="select" name="Reason" size="sm" required value = {MSOCformik.values.Reason} onChange = {MSOCformik.handleChange}>                   
                                    {dropdownOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                       
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Control type="hidden" name="hiddenField" value="hiddenValue" />
                </Form>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-end">
                <Button variant="dark" onClick={onHide}>
                    Cancel
                </Button>             
                <Button
                    variant="dark"
                    type="button"
                    className="ms-2"
                    onClick={() => {
                        MSOCformik.handleSubmit(); 
                      }}
                >
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MSOC;
