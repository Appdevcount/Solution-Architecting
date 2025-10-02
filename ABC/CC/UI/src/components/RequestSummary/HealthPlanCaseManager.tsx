import { useEffect, useState } from 'react';
import { Card, Table, Button, Form, Col, CardHeader } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { RootState } from '../../state/store/store';
import { useSelector } from 'react-redux';
import { ManageHealthPlanCaseManager } from '../../services/RequestService';
import CustomAlert from '../CustomAlert';
import { UpdateCaseManagerResponse, ResponseUpdateCaseManagerModel } from '../../types/UpdateCaseManagerModel';
import Loader from '../Loader';

const HealthPlanCaseManager = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [HPCM, setHPCM] = useState<UpdateCaseManagerResponse | null>(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
    const request: any = useSelector((state: RootState) => state.request);
    const [IsSupervisor, setIsSupervisor] = useState(false);
    const [IsOwnedRequest, setIsOwnedRequest] = useState(false);
    const authState: any = useSelector((state: RootState) => state.auth);
    const [isLoadingData, setIsLoadingData] = useState(false);
    

    useEffect(() => {
        if (request.HealthPlanCaseManager) {
            setHPCM(request.HealthPlanCaseManager);
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
            FirstName: HPCM ? HPCM.FirstName : '',
            LastName: HPCM ? HPCM.LastName : '',
            PhoneNumber: HPCM ? HPCM.PhoneNumber : '',
            Extension: HPCM ? HPCM.Extension : '',
            Email: HPCM ? HPCM.Email : ''
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            FirstName: Yup.string()
                .required('First Name is required')
                .max(50, 'First Name must be at most 50 characters')
                .matches(/^\s*$|^[a-zA-Z'`-\s\.]+$/g, 'Invalid character'),
            LastName: Yup.string()
                .required('Last Name is required')
                .max(50, 'Last Name must be at most 50 characters')
                .matches(/^\s*$|^[a-zA-Z'`-\s\.]+$/g, 'Invalid character'),
            PhoneNumber: Yup.string()
                .required('Phone Number is required')
                .matches(/^\d{10}$/, 'Must be a valid phone number'),
            Extension: Yup.string()
                .required('Extension is required')
                .matches(/^\d{10}$/, 'Must be a valid Extension number'),
            Email: Yup.string()
                .required('Email is required')
                .email('Must be a valid email address'),
        }),
        onSubmit: async (values) => {

            try {
                setIsLoadingData(true);
                const response: ResponseUpdateCaseManagerModel = await ManageHealthPlanCaseManager(values.FirstName,values.LastName,values.PhoneNumber,values.Extension,values.Email, request?.RequestId, authState?.user?.email);               
                if (response.apiresp){
                setHPCM(values);
                setIsEditing(false);
                setAlert({ show: true, message: 'Health Plan Case Manager detail has been updated!', variant: 'success' });
                }
                else{
                    setAlert({ show: true, message: 'Health Plan Case Manager detail can not be updated', variant: 'danger' });
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
                    Health Plan Case Manager
                    {HPCM && Object.values(HPCM).some(val => val) ? (
                        !isEditing && !hideActionButton &&
                        <Button variant="dark" size="sm" style={{ float: 'right' }} disabled = {(!IsOwnedRequest || !IsSupervisor) && request?.RequestInformation?.Status === "Closed"} onClick={handleEdit}>
                            Edit
                        </Button>
                    ) : !hideActionButton && <Button variant="dark" size="sm" style={{ float: 'right' }} disabled = {(!IsOwnedRequest || !IsSupervisor) && request?.RequestInformation?.Status == "Closed"} onClick={handleEdit}>
                        Add
                    </Button>}

                </CardHeader>
                {(isEditing||(HPCM && Object.values(HPCM || {}).some(val => val)))&& (
                <Card.Body className="p-2">
                    <CustomAlert
                        show={alert.show}
                        message={alert.message}
                        variant={alert.variant as 'success' | 'danger'}
                        onClose={() => setAlert({ ...alert, show: false })}
                    />
                    {isEditing ? (                      
                        <Form onSubmit={formik.handleSubmit}>
                            <Form.Group controlId="formFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    name="FirstName"
                                    type="text"
                                    size="sm"
                                    value={formik.values.FirstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.FirstName && formik.errors.FirstName)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.FirstName}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    name="LastName"
                                    type="text"
                                    size="sm"
                                    value={formik.values.LastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.LastName && formik.errors.LastName)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.LastName}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formPhoneNumber">
                                <Form.Label>Phone number</Form.Label>
                                <Form.Control
                                    name="PhoneNumber"
                                    type="text"
                                    size="sm"
                                    maxLength={10}
                                    value={formik.values.PhoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.PhoneNumber && formik.errors.PhoneNumber)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.PhoneNumber}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formExtension">
                                <Form.Label>Extension</Form.Label>
                                <Form.Control
                                    name="Extension"
                                    type="text"
                                    size="sm"
                                    maxLength={10}
                                    value={formik.values.Extension}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.Extension && formik.errors.Extension)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.Extension}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    name="Email"
                                    type="email"
                                    size="sm"
                                    value={formik.values.Email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.Email && formik.errors.Email)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.Email}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="dark" type="submit" className="mr-2" disabled={isLoadingData}>  {isLoadingData ? <Loader /> : 'Save'} </Button>
                            <Button variant="dark" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Form>
                        
                    ) : (
                        HPCM &&
                        <Table bordered >
                            <tbody>
                                <tr>
                                    <td>First Name</td>
                                    <td>{HPCM.FirstName}</td>
                                </tr>
                                <tr>
                                    <td>Last Name</td>
                                    <td>{HPCM.LastName}</td>
                                </tr>
                                <tr>
                                    <td>Phone Number</td>
                                    <td>{HPCM.PhoneNumber}</td>
                                </tr>
                                <tr>
                                    <td>Extension</td>
                                    <td>{HPCM.Extension}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{HPCM.Email}</td>
                                </tr>
                            </tbody>
                        </Table>
                    )}
                </Card.Body>

                )}
            </Card>
        </Col>
    );
};

export default HealthPlanCaseManager;
