import React from 'react';
import {  Button, Form, Col, Row } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import config from '../../config/config';

interface QuickCreateMemberFormProps {
    setShowQuickCreate: (show: boolean) => void;
    RequestId:string ;
    handleQuickCreateMemberDetails:(data:any)=>void;
    handleCancel:()=>void;
    setAlert:(data:any)=>void;
}


const MemberQuickCreateForm : React.FC<QuickCreateMemberFormProps> = ({ setShowQuickCreate,RequestId,handleQuickCreateMemberDetails ,handleCancel,setAlert}) => {
    let states = config.USstates;

    const QuickCreateMemberValidationSchema = Yup.object({
        MemberId: Yup.string().required('Member Id is required'),
        FirstName: Yup.string().required('First Name is required'),
        LastName: Yup.string().required('Last Name is required'),
        Dob: Yup.string().required('Date of Birth is required'),
        Gender: Yup.string().required('Gender is required'),
        StreetAddress: Yup.string().required('Street Address is required'),
        City: Yup.string().required('City is required'),
        Zip: Yup.string().matches(/^\d{5}(-\d{4})?$/, 'Only numbers allowed. 5/9 character length').required('Zip is required'),
        State: Yup.string().required('State is required')
    });
    const QuickCreateMemberformik = useFormik({
        initialValues: {
            MemberId: '',
            FirstName: '',
            LastName: '',
            Dob: '',
            Gender: '',
            StreetAddress: '',
            City: '',
            State: '',
            Zip: '',
        },
        validationSchema: QuickCreateMemberValidationSchema,
        onSubmit: async (values) => {
            let errors: { [key: string]: string } = {};
            handleQuickCreateMemberDetails(values);
        },
    });

    const QuickCreateMemberformValidation =()=>{
        let errors: { [key: string]: string } = {};
            if (!QuickCreateMemberformik.values.MemberId  || QuickCreateMemberformik.values.MemberId.length === 0) {
                errors.MemberId = 'MemberId is required';
            }
            if (!QuickCreateMemberformik.values.FirstName  || QuickCreateMemberformik.values.FirstName.length === 0) {
                errors.FirstName = 'Please enter the Name';
            }
            if (!QuickCreateMemberformik.values.LastName  || QuickCreateMemberformik.values.LastName.length === 0) {
                errors.LastName = 'Please enter the Name';
            }
            if (!QuickCreateMemberformik.values.Dob  || QuickCreateMemberformik.values.Dob.length === 0) {
                errors.Dob = 'Date Of Birth is required';
            }
            if (!QuickCreateMemberformik.values.Gender  || QuickCreateMemberformik.values.Gender.length === 0) {
                errors.Gender = 'Gender is required';
            }
            if (!QuickCreateMemberformik.values.StreetAddress  || QuickCreateMemberformik.values.StreetAddress.length === 0) {
                errors.StreetAddress = 'Street Address is required';
            }
            if (!QuickCreateMemberformik.values.City  || QuickCreateMemberformik.values.City.length === 0) {
                errors.City = 'City is required';
            }
            if (!QuickCreateMemberformik.values.State  || QuickCreateMemberformik.values.State.length === 0) {
                errors.State = 'State is required';
            }
            if (!QuickCreateMemberformik.values.Zip  || QuickCreateMemberformik.values.Zip.length === 0 || !QuickCreateMemberformik.values.Zip.match(/^\d{5}(-\d{4})?$/)) {
                errors.Zip = 'Zip is required, Only numbers are allowed with 5/9 character length';
            }
            if (Object.keys(errors).length > 0) {
                QuickCreateMemberformik.setErrors(errors);
                QuickCreateMemberformik.setTouched(Object.fromEntries(Object.keys(errors).map(key=>[key,true])));
                console.error(errors)
                console.error(QuickCreateMemberformik.errors)
                return;
            }
            else{
                handleQuickCreateMemberDetails(QuickCreateMemberformik.values);
            QuickCreateMemberformik.resetForm();
            setShowQuickCreate(false) 
            }
    }
    /* istanbul ignore next */
    return (
        <Form onSubmit={(e) => {
            e.preventDefault();
            QuickCreateMemberformik.handleSubmit(e);
          }}>
            <Row>
                <Col md={6}>
                    <Form.Group controlId="MemberId">
                        <Form.Label>Member ID *</Form.Label>
                        <Form.Control
                            type="text"
                            name="MemberId"
                            size="sm"
                            onChange={QuickCreateMemberformik.handleChange}
                            onBlur={QuickCreateMemberformik.handleBlur}
                            value={QuickCreateMemberformik.values.MemberId}
                            isInvalid={QuickCreateMemberformik.touched.MemberId && !!QuickCreateMemberformik.errors.MemberId}
                        />
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateMemberformik.errors.MemberId}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="FirstName">
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control
                            type="text"
                            name="FirstName"
                            placeholder='FirstName'
                            size="sm"
                            onChange={QuickCreateMemberformik.handleChange}
                            onBlur={QuickCreateMemberformik.handleBlur}
                            value={QuickCreateMemberformik.values.FirstName}
                            isInvalid={QuickCreateMemberformik.touched.FirstName && !!QuickCreateMemberformik.errors.FirstName}
                        />
                         <Form.Control.Feedback type="invalid">
                            {QuickCreateMemberformik.errors.FirstName}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="LastName">
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control
                            type="text"
                            name="LastName"
                            placeholder='LastName'
                            size="sm"
                            onChange={QuickCreateMemberformik.handleChange}
                            onBlur={QuickCreateMemberformik.handleBlur}
                            value={QuickCreateMemberformik.values.LastName}
                            isInvalid={QuickCreateMemberformik.touched.LastName && !!QuickCreateMemberformik.errors.LastName}
                        />
                        {((QuickCreateMemberformik.touched.FirstName && QuickCreateMemberformik.errors.FirstName ) || (QuickCreateMemberformik.touched.LastName && QuickCreateMemberformik.errors.LastName )) ? (
                            <div className="invalid-feedback d-block">
                            {QuickCreateMemberformik.errors.LastName}
                            </div>
                        ) : null}
                    </Form.Group>
                </Col>
                <Col md={6}>

                    <Form.Group controlId="Dob">
                        <Form.Label>Date Of Birth *</Form.Label>
                        <Form.Control
                            type="date"
                            name="Dob"
                            size="sm"
                            onChange={QuickCreateMemberformik.handleChange}
                            onBlur={QuickCreateMemberformik.handleBlur}
                            value={QuickCreateMemberformik.values.Dob}
                            isInvalid={QuickCreateMemberformik.touched.Dob && !!QuickCreateMemberformik.errors.Dob}
                        />
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateMemberformik.errors.Dob}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    
                    <Form.Group controlId="Gender">
                        <Form.Label>Gender *</Form.Label>
                        <Form.Control
                            as="select"
                            name="Gender"
                            size="sm"
                            onChange={QuickCreateMemberformik.handleChange}
                            onBlur={QuickCreateMemberformik.handleBlur}
                            value={QuickCreateMemberformik.values.Gender}
                            isInvalid={QuickCreateMemberformik.touched.Gender && !!QuickCreateMemberformik.errors.Gender}
                        >
                            <option value="">Please Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateMemberformik.errors.Gender} 
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>

                    <Form.Group controlId="StreetAddress">
                        <Form.Label>StreetAddress *</Form.Label>
                        <Form.Control
                            type="text"
                            name="StreetAddress"
                            size="sm"
                            onChange={QuickCreateMemberformik.handleChange}
                            onBlur={QuickCreateMemberformik.handleBlur}
                            value={QuickCreateMemberformik.values.StreetAddress}
                            isInvalid={QuickCreateMemberformik.touched.StreetAddress && !!QuickCreateMemberformik.errors.StreetAddress}
                        />
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateMemberformik.errors.StreetAddress}
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
                            onChange={QuickCreateMemberformik.handleChange}
                            onBlur={QuickCreateMemberformik.handleBlur}
                            value={QuickCreateMemberformik.values.City}
                            isInvalid={QuickCreateMemberformik.touched.City && !!QuickCreateMemberformik.errors.City}
                        />
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateMemberformik.errors.City}
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
                            onChange={QuickCreateMemberformik.handleChange}
                            onBlur={QuickCreateMemberformik.handleBlur}
                            value={QuickCreateMemberformik.values.Zip}
                            isInvalid={QuickCreateMemberformik.touched.Zip && !!QuickCreateMemberformik.errors.Zip}
                        />
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateMemberformik.errors.Zip}
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
                            onChange={QuickCreateMemberformik.handleChange}
                            onBlur={QuickCreateMemberformik.handleBlur}
                            value={QuickCreateMemberformik.values.State}
                            isInvalid={QuickCreateMemberformik.touched.State && !!QuickCreateMemberformik.errors.State}
                        >
                            <option value="">Please Select</option>
                            {states.map(state => (
                                <option key={state.value} value={state.value}>{state.label}</option>
                            ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {QuickCreateMemberformik.errors.State}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={12}>

                    <Button type="button" variant='dark'  onClick={() => {
        QuickCreateMemberformValidation() }}>Save</Button>
                    <Button type="button" variant='dark' onClick={() => {
        QuickCreateMemberformik.resetForm();
        setShowQuickCreate(false) }}>Cancel</Button>
                </Col>
            </Row>
        </Form>
    );
};

export default MemberQuickCreateForm;
