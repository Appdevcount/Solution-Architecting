import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Form, Col, CardHeader } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store/store';
import { UpdateFollowUpInfo } from '../../services/RequestService';
import CustomAlert from '../CustomAlert';
import {UpdateFollowUpInfoResponse, ResponseFollowUpInfoModel} from '../../types/UpdateFollowUpInfoModel';
import Loader from '../Loader';

const FollowUpInfo: React.FC = () => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [followUpInfo, setFollowUpInfo] = useState<UpdateFollowUpInfoResponse | null>(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

    const request: any = useSelector((state: RootState) => state.request);
    const [IsSupervisor, setIsSupervisor] = useState(false);
    const [IsOwnedRequest, setIsOwnedRequest] = useState(false);
    const authState: any = useSelector((state: RootState) => state.auth);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const initaldate =request?.FollowUpInformation?.Date;
    

    useEffect(() => {
        if (request.FollowUpInformation) {
            if(initaldate !== "12/31/1969"){
                setFollowUpInfo(request.FollowUpInformation);
               }
        }
        console.log(request.FollowUpInformation)
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
            Date: followUpInfo ? followUpInfo.Date : '',
            Details: followUpInfo ? followUpInfo.Details : '',
        },
        validationSchema: Yup.object({
            Date: Yup.date().min(new Date(),'Please select a date from today onwards').max(new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
             'Please enter a date that is not greater than 45 days from the current date').required('Date is required'),
            Details: Yup.string().required('Details is required'),
        }),
        onSubmit: async (values) => {
            try {
                setIsLoadingData(true);
                const response: ResponseFollowUpInfoModel = await UpdateFollowUpInfo(values.Date, values.Details,request?.RequestId, authState?.user?.email);               
                setIsEditing(false);
                if(response.apiResp){
                setFollowUpInfo(values);              
                setAlert({ show: true, message: 'FollowUp detail has been updated', variant: 'success' });
                }
                else{
                setAlert({ show: true, message: 'FollowUp detail can not be updated', variant: 'danger' });
                }
            } catch (error) {
                if (error instanceof Error) {
                    setAlert({ show: true, message: error.message, variant: 'danger' });
                } else {
                    setAlert({ show: true, message: 'An unknown error occurred', variant: 'danger' });
                }
            }finally{
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

                    Follow-Up Information
                    { (!isEditing && !hideActionButton) && (

                        <Button variant="dark" size="sm" style={{ float: 'right' }}  onClick={handleEdit}>
                            {followUpInfo ? "Edit" : "Add"}
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
                    {!isEditing ? (
                        followUpInfo ?
                            <Table bordered size="sm">
                                <tbody>
                                    <tr>
                                        <td style={{ width: '50%' }}>Date:</td>
                                        <td>{followUpInfo.Date}</td>
                                    </tr>
                                    <tr>
                                        <td>Details:</td>
                                        <td>{followUpInfo.Details}</td>
                                    </tr>
                                </tbody>
                            </Table> : <div>Please Add follow-up Info</div>
                    ) : (
                        <Form onSubmit={formik.handleSubmit}>
                            <Form.Group controlId="formDate">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    name="Date"
                                    type="Date"
                                    size="sm"
                                    value={formik.values.Date}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.Date && formik.errors.Date)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.Date}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formDetails">
                                <Form.Label>Details</Form.Label>
                                <Form.Control
                                    name="Details"
                                    as="textarea"
                                    size="sm"
                                    rows={3}
                                    maxLength={250}
                                    value={formik.values.Details}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.Details && formik.errors.Details)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.Details}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="dark" style={{ float: 'right' }} type="submit" className="mr-2" disabled={isLoadingData}>  {isLoadingData ? <Loader /> : 'Save'} </Button>
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

export default FollowUpInfo;
