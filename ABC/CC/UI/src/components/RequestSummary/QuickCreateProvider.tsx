
import React, { useState } from 'react';
import {  Button, Form, Col, Row } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import config from '../../config/config';
import { QuickCreateProvider } from '../../services/RequestService';
import Loader from '../Loader';

interface QuickCreateProviderFormProps {
    setShowQuickCreate: (show: boolean) => void;
    RequestId:string ;
    setSavedRecord:(data:any)=>void;
    handleCancel:()=>void;
    setAlert:(data:any)=>void;
}

const QuickCreateProviderForm: React.FC<QuickCreateProviderFormProps> = ({ setShowQuickCreate,RequestId,setSavedRecord ,handleCancel,setAlert}) => {
    let states = config.USstates;
    const [loading, setLoading] = useState(false);

    const QuickCreateProvidervalidationSchema = Yup.object({
        SiteName: Yup.string().required('Facility Name is required'),
        NPI: Yup.string(),//.matches(/^\d{10}$/, 'Only numbers allowed. 10 characters length'),
        TIN: Yup.string(),//.matches(/^\d{9,11}$/, 'Only numbers allowed. 9-11 character length'),
        Address: Yup.string().required('Street Address is required'),
        City: Yup.string().required('City is required'),
        Zip: Yup.string().matches(/^\d{5}(-\d{4})?$/, 'Only numbers allowed. 5/9 character length').required('Zip is required'),
        State: Yup.string().required('State is required'),
        Phone: Yup.string().required('Phone is required'),
        Fax: Yup.string().required('Fax is required'),
        Network: Yup.string().required('Network is required'),
        Source: Yup.string().required('Source is required'),
    });
    const QuickCreateProviderformik = useFormik({
        initialValues: {
            SiteName: '',
            NPI: '',
            TIN: '',
            Address: '',
            City: '',
            Zip: '',
            State: '',
            Phone: '',
            Fax: '',
            Network: '',
            Source: '',
        },
        validationSchema: QuickCreateProvidervalidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            let errors: { [key: string]: string } = {};
            if ((!QuickCreateProviderformik.values.NPI || QuickCreateProviderformik.values.NPI.length === 0) && (!QuickCreateProviderformik.values.TIN || QuickCreateProviderformik.values.TIN.length === 0)) {

                errors.TIN = 'Please enter either NPI or TIN details';
                if (Object.keys(errors).length > 0) {
                    QuickCreateProviderformik.setErrors(errors);
                }
                return;
            }
            // Validate NPI
            if (QuickCreateProviderformik.values.NPI && !/^\d{10}$/.test(QuickCreateProviderformik.values.NPI)) {
                errors.TIN = 'Only numbers allowed in NPI. 10 characters length';
                if (Object.keys(errors).length > 0) {
                    QuickCreateProviderformik.setErrors(errors);
                }
                return;
            }

            // Validate TIN
            if (QuickCreateProviderformik.values.TIN && !/^\d{9,11}$/.test(QuickCreateProviderformik.values.TIN)) {
                errors.TIN = 'Only numbers allowed TIN. 9-11 character length';
                if (Object.keys(errors).length > 0) {
                    QuickCreateProviderformik.setErrors(errors);
                }
                return;
            }

            try {
                setLoading(true);
                const req: any = { ...values, RequestId };

                const response = await QuickCreateProvider(req);
                setSavedRecord(response);
                handleCancel();
                setAlert({ show: true, message: 'Provider created successfully!', variant: 'success' });
            } catch (error) {
                if (error instanceof Error) {
                    setAlert({ show: true, message: error.message, variant: 'danger' });
                } else {
                    setAlert({ show: true, message: 'An unknown error occurred', variant: 'danger' });
                }
            }finally{
                setLoading(false);
            }
        },
    });

    return (
        <Form onSubmit={QuickCreateProviderformik.handleSubmit}>
            <Row>
                <Col md={6}>
                    <Form.Group controlId="SiteName">
                        <Form.Label>Facility Name *</Form.Label>
                        <Form.Control
                            type="text"
                            name="SiteName"
                            size="sm"
                            onChange={QuickCreateProviderformik.handleChange}
                            onBlur={QuickCreateProviderformik.handleBlur}
                            value={QuickCreateProviderformik.values.SiteName}
                            isInvalid={QuickCreateProviderformik.touched.SiteName && !!QuickCreateProviderformik.errors.SiteName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateProviderformik.errors.SiteName}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="NPI">
                        <Form.Label>NPI or TIN *</Form.Label>
                        <Form.Control
                            type="text"
                            name="NPI"
                            placeholder='NPI'
                            onChange={QuickCreateProviderformik.handleChange}
                            onBlur={QuickCreateProviderformik.handleBlur}
                            value={QuickCreateProviderformik.values.NPI}
                            isInvalid={QuickCreateProviderformik.touched.TIN && !!QuickCreateProviderformik.errors.TIN}
                        />
                    </Form.Group>

                    <Form.Group controlId="TIN">
                        <Form.Control
                            type="text"
                            name="TIN"
                            size="sm"
                            placeholder='TIN'
                            onChange={QuickCreateProviderformik.handleChange}
                            onBlur={QuickCreateProviderformik.handleBlur}
                            value={QuickCreateProviderformik.values.TIN}
                            isInvalid={QuickCreateProviderformik.touched.TIN && !!QuickCreateProviderformik.errors.TIN}
                        />
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateProviderformik.errors.TIN}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>

                    <Form.Group controlId="Address">
                        <Form.Label>Street Address *</Form.Label>
                        <Form.Control
                            type="text"
                            name="Address"
                            size="sm"
                            onChange={QuickCreateProviderformik.handleChange}
                            onBlur={QuickCreateProviderformik.handleBlur}
                            value={QuickCreateProviderformik.values.Address}
                            isInvalid={QuickCreateProviderformik.touched.Address && !!QuickCreateProviderformik.errors.Address}
                        />
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateProviderformik.errors.Address}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>

                    <Form.Group controlId="City">
                        <Form.Label>City *</Form.Label>
                        <Form.Control
                            type="text"
                            name="City"
                            size="sm"
                            onChange={QuickCreateProviderformik.handleChange}
                            onBlur={QuickCreateProviderformik.handleBlur}
                            value={QuickCreateProviderformik.values.City}
                            isInvalid={QuickCreateProviderformik.touched.City && !!QuickCreateProviderformik.errors.City}
                        />
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateProviderformik.errors.City}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>

                    <Form.Group controlId="Zip">
                        <Form.Label>Zip *</Form.Label>
                        <Form.Control
                            type="text"
                            name="Zip"
                            size="sm"
                            onChange={QuickCreateProviderformik.handleChange}
                            onBlur={QuickCreateProviderformik.handleBlur}
                            value={QuickCreateProviderformik.values.Zip}
                            isInvalid={QuickCreateProviderformik.touched.Zip && !!QuickCreateProviderformik.errors.Zip}
                        />
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateProviderformik.errors.Zip}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>

                    <Form.Group controlId="State">
                        <Form.Label>State *</Form.Label>
                        <Form.Control
                            as="select"
                            name="State"
                            size="sm"
                            onChange={QuickCreateProviderformik.handleChange}
                            onBlur={QuickCreateProviderformik.handleBlur}
                            value={QuickCreateProviderformik.values.State}
                            isInvalid={QuickCreateProviderformik.touched.State && !!QuickCreateProviderformik.errors.State}
                        >
                            <option value="">Please Select</option>
                            {states.map(state => (
                                <option key={state.value} value={state.value}>{state.label}</option>
                            ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateProviderformik.errors.State}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>

                    <Form.Group controlId="Phone">
                        <Form.Label>Phone *</Form.Label>
                        <Form.Control
                            type="text"
                            name="Phone"
                            size="sm"
                            onChange={QuickCreateProviderformik.handleChange}
                            onBlur={QuickCreateProviderformik.handleBlur}
                            value={QuickCreateProviderformik.values.Phone}
                            isInvalid={QuickCreateProviderformik.touched.Phone && !!QuickCreateProviderformik.errors.Phone}
                        />
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateProviderformik.errors.Phone}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>

                    <Form.Group controlId="Fax">
                        <Form.Label>Fax *</Form.Label>
                        <Form.Control
                            type="text"
                            name="Fax"
                            size="sm"
                            onChange={QuickCreateProviderformik.handleChange}
                            onBlur={QuickCreateProviderformik.handleBlur}
                            value={QuickCreateProviderformik.values.Fax}
                            isInvalid={QuickCreateProviderformik.touched.Fax && !!QuickCreateProviderformik.errors.Fax}
                        />
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateProviderformik.errors.Fax}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>

                    <Form.Group controlId="Network">
                        <Form.Label>Network *</Form.Label>
                        <Form.Control
                            as="select"
                            name="Network"
                            size="sm"
                            onChange={QuickCreateProviderformik.handleChange}
                            onBlur={QuickCreateProviderformik.handleBlur}
                            value={QuickCreateProviderformik.values.Network}
                            isInvalid={QuickCreateProviderformik.touched.Network && !!QuickCreateProviderformik.errors.Network}
                        >
                            <option value="">Please Select</option>
                            <option value="PAR-INN">PAR-INN</option>
                            <option value="PAR-OON">PAR-OON</option>
                            <option value="NON-PAR">NON-PAR</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateProviderformik.errors.Network}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>


                    <Form.Group controlId="Source">
                        <Form.Label>Source *</Form.Label>
                        <Form.Control
                            as="select"
                            name="Source"
                            size="sm"
                            onChange={QuickCreateProviderformik.handleChange}
                            onBlur={QuickCreateProviderformik.handleBlur}
                            value={QuickCreateProviderformik.values.Source}
                            isInvalid={QuickCreateProviderformik.touched.Source && !!QuickCreateProviderformik.errors.Source}
                        >
                            <option value="">Please Select</option>
                            <option value="Sites and Services spreadsheet">Sites and Services spreadsheet</option>
                            <option value="Cigna website">Cigna website</option>
                            <option value="Google">Google</option>
                            <option value="Other">Other</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateProviderformik.errors.Source}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>

                    <Button type="submit" variant='dark' disabled={loading}>
                        {loading ? <Loader /> : 'Submit'}
                        </Button>
                    <Button type="button" variant='dark' onClick={() => {
        QuickCreateProviderformik.resetForm(); 
        setShowQuickCreate(false)}}>Cancel</Button>
                </Col>
            </Row>
        </Form>
    );
};

export default QuickCreateProviderForm;
