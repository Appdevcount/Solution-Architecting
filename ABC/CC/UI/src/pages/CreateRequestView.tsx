import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RequesterInfo from '../components/RequestCreation/RequesterInfo';
import Insurer from '../components/RequestCreation/InsurerInfo';
import CareCoordinationInfo from '../components/RequestCreation/CareCoordination';
import PatientInfo from '../components/RequestCreation/PatientInfo';
import { useNavigate } from 'react-router-dom';
import CCRequest from '../types/Request';
import * as RequestService from '../services/RequestService';
import { Button, Card, CardBody, CardHeader, Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setRequestDetails } from '../state/reducers/requestSlice';
import ConfirmationModal from '../components/ConfirmationModal';
import CustomAlert from '../components/CustomAlert';
import { RootState } from '../state/store/store';

const CreateRequest: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const initialValues: CCRequest = {
    RequestId: '',
    RequesterFirstName: '',
    RequesterLastName: '',
    RequesterEmail: '',
    RequesterFaxNumber: '',
    RequesterPhoneNumber: '',
    RequesterExtension: '',
    RequesterFacility: '',
    Insurer: '',
    InsurerName: '',
    CareCoordinationType: '',
    CareCoordinationSubType: '',
    Reason: '',
    StartOfCare: '',
    isEscalated: false,
    Notes: '',
    MemberId: '',
    MemberIdSearchterm: '',
    MemberFirstNameSearchterm: '',
    MemberLastNameSearchterm: '',
    MemberDOBSearchterm: '',
    MemberFirstName: '',
    MemberLastName: '',
    MemberDOB: '',
    MemberAddress: '',
    MemberPhoneNumber: '',
    MemberPrimaryLanguage: '',
    MemberPrimaryCarePhysician: '',
    MemberInsuranceCategory: '',
    MemberPlanType: '',
    MemberTPA: '',
    MemberGroupId: '',
    MemberGroupName: '',
    MemberLOBCode: '',
    MemberFullName: '',
    MemberAddress1: '',
    MemberAddress2: '',
    MemberCity: '',
    MemberState: '',
    MemberZip: '',
    MemberGender: '',
    MemberOaoSubNo: '',
    MemberOaoPerNo: '',
    MemberCode: '',
    MemberEntity: '',
    MemberCategory: '',
    MemberIPACode: '',
    MemberIdent: 0,
    MemberEmail: '',
    MemberCellPhone: '',
    MemberJurisdictionState: '',
    MemberTiT19: '',
    MemberPPlanType: '',
    MembercaseFactor: 0,
    MemberPusrdf: '',
    MemberErisa: '',
    MemberExtId: '',
    MemberFundingType: '',
    MemberEffectiveDate: '',
    IsQuickCreate: false,
    PatientSearchTerm: '',
    SiteSearchTerm: '',
    SiteId: '',
    SiteName: '',
    SiteAddress: '',
    SiteNPI: '',
    SiteTIN: '',
    SitePhoneNumber: '',
    SiteDistance: '',
    MemberEligibilityDates: '',
    IsRestrictedMember: false,
    IsStaffingRequest: false
  };


  const validationSchema = Yup.object().shape({
    RequesterFirstName: Yup.string()
      .required('First Name is required')
      .max(50, 'First Name must be at most 50 characters')
      .matches(/^\s*$|^[a-zA-Z'`-\s\.]+$/g, 'Invalid character'),
    RequesterLastName: Yup.string()
      .max(50, 'Last Name must be at most 50 characters')
      .matches(/^\s*$|^[a-zA-Z'`-\s\.]+$/g, 'Invalid character'),
    RequesterPhoneNumber: Yup.string()
      .matches(/^\d{10}$/, 'Must be a valid phone number'),
    RequesterExtension: Yup.string()
      .matches(/^\d{10}$/, 'Must be a valid Extension number'),
    RequesterFaxNumber: Yup.string()
      .matches(/^\d{10}$/, 'Must be a valid fax number'),
    RequesterEmail: Yup.string()
      .email('Must be a valid email address'),
    RequesterFacility: Yup.string()
      .max(50, 'Facility must be at most 50 characters')
      .matches(/^\s*$|^[a-zA-Z'.-\s]+$/g, 'Invalid character'),
    InsurerName: Yup.string()
      .required('Insurer Name is required'),
    CareCoordinationType: Yup.string()
      .required('Care Coordination Type is required'),
    CareCoordinationSubType: Yup.string(),
    Reason: Yup.string().required('Please select a reason'),
    StartOfCare: Yup.string().when('Reason', {
      is: (val: string) => val === 'Missed/Late Service',
      then: (schema: { required: (arg: string) => any; }) => schema.required('Start of Care is required for Missed/Late Service'),
      otherwise: (schema: any) => schema,
    }),
    Notes: Yup.string().when('Reason', {
      is: (val: string) => val === 'Help finding a serving provider' || val === 'Other',
      then: (schema: { required: (arg: string) => any; }) => schema.required('Notes are required for Help finding a serving provider or Other'),
      otherwise: (schema: any) => schema,
    }),
    IsEscalated: Yup.boolean(),
    MemberId: Yup.string().required('Please Add a Patient'),
    MemberFirstName: Yup.string(),
    MemberLastName: Yup.string(),
    MemberDOB: Yup.string(),
    IsRestrictedMember: Yup.bool(),
    IsStaffingRequest: Yup.boolean()
  });

  const isRestrictedGlobal = useSelector((state: RootState)=> state.restricted.isRestrictedGlobal)

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values: { Reason: string; StartOfCare: any; Notes: any; }) => {
      const errors: { [key: string]: string }= {};
         /* istanbul ignore next */
      if (values.Reason === 'Missed/Late Service' && !values.StartOfCare) {
          errors.StartOfCare = 'Start of Care is required for Missed/Late Service';
      }
         /* istanbul ignore next */
      if ((values.Reason === 'Help finding a serving provider' || values.Reason === 'Other') && !values.Notes) {
          errors.Notes = 'Notes are required for Help finding a serving provider or Other';
      }
         /* istanbul ignore next */
      if (Object.keys(errors).length > 0) {
          formik.setErrors(errors);
          return;
      } 
      setShowModal(true); 
    }
  });
  const OnConfirmation = async () => {
    const values=formik.values;
    const payload = {
      ...values,
      IsRestrictedMember: isRestrictedGlobal
    };
    setShowModal(false);
      setLoading(true);
      try {
        const response: any = await RequestService.CreateRequest(values);
        dispatch(setRequestDetails(response));
        setAlert({ show: true, message: 'Request submitted successfully!', variant: 'success' });
        setTimeout(() => {
          navigate('/viewrequest', { state: { RequestId: response.RequestId } });
        }, 2000);
      } catch (error) {
        if (error instanceof Error) {
          setAlert({ show: true, message: error.message, variant: 'danger' });
        } else {
          setAlert({ show: true, message: 'An unknown error occurred', variant: 'danger' });
        }
      } finally {
        setLoading(false);
      }
  };
  return (
    <Container>
      <h4>Submit a Request for Care Coordination</h4>
      <CustomAlert
        show={alert.show}
        message={alert.message}
        variant={alert.variant as 'success' | 'danger'}
        onClose={() => setAlert({ ...alert, show: false })}
      />
      <Card>
        <CardHeader>Member Search</CardHeader>
        <CardBody>
        <form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={4}>
                  <RequesterInfo formik={formik} />
            </Col>
            <Col md={4}>
                  <Insurer formik={formik} />
            </Col>
            <Col md={4}>
                  <CareCoordinationInfo formik={formik} />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
                  <PatientInfo formik={formik} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button type="submit" className="mt-3" variant="dark" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Col>
          </Row>
        </form></CardBody>
      </Card>
      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={OnConfirmation}
        title="Confirm Submission"
        body={
          <div>
            <p>Are you sure you want to submit the form with the mentioned details?</p>
          </div>
        }
      />

    </Container>
  );
};

export default CreateRequest;
