
import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Form, Col, CardHeader } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store/store';
import { UpdateCareCoordination } from '../../services/RequestService';
import CustomAlert from '../CustomAlert';
import { CareCoordinationResponseModel, ResponseCareCoordinationModel } from '../../types/UpdateCareCoordinationModel';
import Loader from '../Loader';


const CareCoordinationInfo: React.FC = () => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [careCoordinationInfo, setCareCoordinationInfo] = useState< CareCoordinationResponseModel | null>(
        null);
    

    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

    const request: any = useSelector((state: RootState) => state.request);
    const [IsSupervisor, setIsSupervisor] = useState(false);
    const [IsOwnedRequest, setIsOwnedRequest] = useState(false);
    const authState: any = useSelector((state: RootState) => state.auth);
    const [isLoadingData, setIsLoadingData] = useState(false);
    
    

    useEffect(() => {
        console.log("CareCoordinationInformation", request);
        if (request.CareCoordinationInformation) {
            setCareCoordinationInfo(request.CareCoordinationInformation);
        }
        if(request?.AssignToId === authState?.user?.email)
            {
               setIsOwnedRequest(true);
        }

        if(authState?.user?.roles.includes("CCCordSup","NCCCordSup") )
            {
                setIsSupervisor(true);
        }
    }, [request]);

    const formik = useFormik({
        initialValues: {
            ServiceType: request.CareCoordinationInformation ? request.CareCoordinationInformation.ServiceType : '',
            ServiceSubType: request.CareCoordinationInformation ? request.CareCoordinationInformation.ServiceSubType : '',
            Reason: request.CareCoordinationInformation ? request.CareCoordinationInformation.Reason : '',
            StartOfCare:  '',
        },
        validationSchema: Yup.object({
            StartOfCare: Yup.string().required('Start of Care date is required'),
        }),
        onSubmit: async (values) => {

            try {
                setIsLoadingData(true);
                const response: ResponseCareCoordinationModel = await UpdateCareCoordination(values.StartOfCare, request?.RequestId, authState?.user?.email);

                setIsEditing(false);
                if(response.apiResp){
                setCareCoordinationInfo(values)
                setAlert({ show: true, message: 'Success!', variant: 'success' });
                }
                else {
                    setAlert({ show: true, message: 'CareCoordination Information can not be updated!', variant: 'danger' });

                }
            } catch (error) {
                if (error instanceof Error) {
                    setAlert({ show: true, message: error.message, variant: 'danger' });
                } else {
                    setAlert({ show: true, message: 'An unknown error occurred', variant: 'danger' });
                }
            } finally {
                setIsLoadingData(false);
            }

        },
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    let hideActionButton :boolean = (!IsOwnedRequest || !IsSupervisor) && request?.RequestInformation?.Status === "Closed"
    return (
        <Col md={12}>
            <Card className="mb-1">
                <CardHeader>
                    Care Coordination Information
                    {careCoordinationInfo && !isEditing && !hideActionButton && (
                        <Button variant="dark" size="sm" style={{ float: 'right' }} disabled = {(!IsOwnedRequest || !IsSupervisor) && request?.RequestInformation?.Status === "Closed"} onClick={handleEdit}>
                            Edit
                        </Button>
                    )}
                </CardHeader>
                <Card.Body className="p-2">
                <CustomAlert
                        show={alert.show}
                        message={alert.message}
                        variant={alert.variant as 'success' | 'danger'}
                        onClose={() => setAlert({ ...alert, show: false })}
                    />
                    {careCoordinationInfo && !isEditing ? (
                        <Table bordered size="sm">
                            <tbody>
                                <tr>
                                    <td style={{ width: '50%' }}>Service Type:</td>
                                    <td>{careCoordinationInfo.ServiceType}</td>
                                </tr>
                                {careCoordinationInfo.ServiceSubType &&
                                <tr>
                                    <td style={{ width: '50%' }}>Service Sub Type:</td>
                                    <td>{careCoordinationInfo.ServiceSubType}</td>
                                </tr>
}
                                <tr>
                                    <td>Reason:</td>
                                    <td>{careCoordinationInfo.Reason}</td>
                                </tr>
                                <tr>
                                    <td>Start of Care:</td>
                                    <td>{careCoordinationInfo.StartOfCare}</td>
                                </tr>
                            </tbody>
                        </Table>
                    ) : (
                        <Form onSubmit={formik.handleSubmit}>
                            <Form.Group controlId="formServiceType">
                                <Form.Label>Service Type</Form.Label>
                                <Form.Control
                                    name="ServiceType"
                                    type="text"
                                    size="sm"
                                    value={careCoordinationInfo?.ServiceType}
                                    readOnly
                                    plaintext
                                />
                            </Form.Group>
                            <Form.Group controlId="formServiceSubType">
                                <Form.Label>Service Sub Type</Form.Label>
                                <Form.Control
                                    name="ServiceSubType"
                                    type="text"
                                    size="sm"
                                    value={careCoordinationInfo?.ServiceSubType}
                                    readOnly
                                    plaintext
                                />
                            </Form.Group>

                            <Form.Group controlId="formReason">
                                <Form.Label>Reason</Form.Label>
                                <Form.Control
                                    name="Reason"
                                    type="text"
                                    size="sm"
                                    value={careCoordinationInfo?.Reason}
                                    readOnly
                                    plaintext
                                />
                            </Form.Group>

                            <Form.Group controlId="formStartOfCare">
                                <Form.Label>Start of Care</Form.Label>
                                <Form.Control
                                    name="StartOfCare"
                                    type="date"
                                    size="sm"
                                    value={formik.values.StartOfCare}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.StartOfCare && formik.errors.StartOfCare)}
                                />
                                <Form.Control.Feedback type="invalid">
                                     {formik.errors.StartOfCare}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="dark" type="submit" style={{ float: 'right' }} className="mr-2"disabled={isLoadingData}>  {isLoadingData ? <Loader /> : 'Save'} </Button>
                            <Button variant="dark" style={{ float: 'right' }} onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default CareCoordinationInfo;
