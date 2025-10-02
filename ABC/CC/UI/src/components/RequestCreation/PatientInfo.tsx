import { FormikProps } from "formik";
import CCRequest from "../../types/Request";
import { Button, Card, CardBody, CardHeader, Col, Form, Row } from "react-bootstrap";
import { useMemo, useState } from "react";
import { formatCompactDateToMMDDYYY, formatDateToMMDDYYY, PaitentEligibility, PatientLookupAPI} from "../../services/LookupService";
import { useTable } from "react-table";
import TableComponent from "../TableComponent";
import RequestCustomAlert from "../RequestCreation/RequestCustomAlert";
import MemberQuickCreateForm from "./MemberQuickCreate";
import CustomAlert from "../CustomAlert";
import { ActivityResponse, PatientDetailsResponse } from "../../types/LookupRequest";
import { formatDateDashTOSlash } from "../../services/RequestService";
import { useSelector,useDispatch } from "react-redux";
import { RootState } from "../../state/store/store";
import { setIsRestrictedGlobal } from "../../state/reducers/requestSlice";
import StaffingRequestModal from "./StaffingRequestModal";

interface Props {
  formik: FormikProps<CCRequest>;
}
interface LookupResult {
  MemberId: string;
  MemberName: string;
  Address: string;
  MemberDOB: string;
  InsuranceCategory: string;
  EligibilityDates: string;
  FirstName: string;
  LastName: string;
  StreetAddress: string;
  City: string;
  State: string;
  Zip: string;
  Gender: string;
  Dob: string;
}
const PatientInfo: React.FC<Props> = ({ formik }) => {
  const [lookupResults, setLookupResults] = useState<LookupResult[]>([]);
  const [selectedMember, setselectedMember] = useState<LookupResult | null>(null);
  const [showQuickCreate, setShowQuickCreate] = useState<boolean>(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [RequestId, setRequestId] = useState<string>('');
  const [customalert, setCustomalert] = useState({ show: false, message: '',discription:'', variant: 'success' });
  const [saveSelectedRecord, setSaveSelectedRecord] = useState<any | null>(null);
  const [isQuickCreate, setIsQuickCreate] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedMemberLoading, setSelectedMemberLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const authState: any = useSelector((state: RootState) => state.auth);
  const hasLEA:boolean = authState?.user?.hasLEA;
  const dispatch = useDispatch();

  const handleLookup = async (
    memberId: string | undefined,
    memberFirstName: string,
    memberLastName: string,
    memberDOB: string
  ) => {
    try {
      setIsLoadingData(true);
      let IsRestrictedMember = false;
      console.log(memberId, memberFirstName, memberLastName, memberDOB);
      if (!memberId || !memberFirstName || !memberLastName || !memberDOB) {
        setAlert({ show: true, message: 'Please enter search criteria (MemberId, MemberFirstName, MemberLastName, MemberDOB)', variant: 'success' });
        return;
      }
      var req: any = { memberId, memberFirstName, memberLastName, memberDOB };
      /* istanbul ignore next */
      const response: PatientDetailsResponse = await PatientLookupAPI(req);
      if(response.apiResult != null){
        const result: ActivityResponse[] = response.apiResult;
        result.forEach(activity=>{
          if (activity.isRestrictedMember === true && hasLEA === false){
            dispatch(setIsRestrictedGlobal(true));
            IsRestrictedMember=true;
            return false;
          }
        });
      if(!IsRestrictedMember){
        if (response.apiResult.length <=0){
          setAlert({ show: true, message: 'No Record Found', variant: 'danger' });
        }
        setLookupResults(response.apiResult.map(mapActivityToLookupResult));
        setSaveSelectedRecord(response);
      }
      else{
        setAlert({ show: true, message: 'Its a Restricted Member', variant: 'danger' });
      }

    }
    } catch (error) {
      setAlert({ show: true, message: 'Error fetching lookup data', variant: 'success' });
    }finally{
      setIsLoadingData(false);
    }
  }
  const handleRowClick = async (row: any) => {
    setSelectedMemberLoading(true);
    var memberInScopeValue : string | null;
    const response = await PaitentEligibility(row);
    if (response.apiResult && response.apiResult.length >0){
      const fullItem = saveSelectedRecord?.apiResult.find(item => item.patientID = row.MemberId);
      memberInScopeValue = response.apiResult[0].memberInScope;
      /* istanbul ignore next */
      if(memberInScopeValue === "FALSE"){
        setCustomalert({ show: true, message: 'Member Not Delegated',discription:'Care Coordination cannot be provided through eviCore healthcare at this time . To check Care Coordination requirements and start a request,please call the number on the back of the member ID card', variant: 'danger' });
        setLookupResults([]);
        setSelectedMemberLoading(false);
      }
      else{
        setIsModalOpen(true);
        setIsQuickCreate(false);
        formik.setFieldValue('MemberId', row.MemberId);
        formik.setFieldTouched('MemberId', false, false);
        formik.errors.MemberId = undefined;
        formik.setFieldValue('IsRestrictedMember', fullItem.isRestrictedMember);
        formik.setFieldValue('MemberFirstName', row.MemberName);
        formik.setFieldValue('MemberLastName', row.MemberName);
        formik.setFieldValue('MemberDOB',row.MemberDOB);
        formik.setFieldValue('MemberAddress', row.Address);
        formik.setFieldValue('MemberInsuranceCategory', row.InsuranceCategory);
        formik.setFieldValue('MemberEligibilityDates', formatDateToMMDDYYY(row.EligibilityDates));
        formik.setFieldValue('MemberPhoneNumber', fullItem.patientPhone);
        formik.setFieldValue('MemberIdSearchterm', '');
        formik.setFieldValue('MemberFirstNameSearchterm', '');
        formik.setFieldValue('MemberLastNameSearchterm', '');
        formik.setFieldValue('MemberDOBSearchterm', '');
        formik.setFieldValue('MemberFullName', fullItem.patientName);
        formik.setFieldValue('MemberAddress1', fullItem.patientAddr1);
        formik.setFieldValue('MemberAddress2', fullItem.patientAddr1);
        formik.setFieldValue('MemberCity', fullItem.patientCity);
        formik.setFieldValue('MemberState', fullItem.patientState);
        formik.setFieldValue('MemberZip', fullItem.patientZip);
        formik.setFieldValue('MemberGender', fullItem.patientGender);
        formik.setFieldValue('MemberOaoSubNo', fullItem.oAOSubNo);
        formik.setFieldValue('MemberOaoPerNo', fullItem.oAOPerNo);
        formik.setFieldValue('MemberCode', fullItem.memberCode);
        formik.setFieldValue('MemberPrimaryLanguage', saveSelectedRecord.language);
        formik.setFieldValue('MemberEntity', fullItem.entity);
        formik.setFieldValue('MemberCategory', fullItem.category);
        formik.setFieldValue('MemberIPACode', fullItem.iPACode);
        formik.setFieldValue('MemberGroupId',fullItem.patientGroupNumber);
        formik.setFieldValue('MemberGroupName',fullItem.patientGroupDescription);
        formik.setFieldValue('MemberLOBCode', fullItem.lineOfBusiness);
        formik.setFieldValue('MemberEmail', fullItem.eMAIL);
        formik.setFieldValue('MemberCellPhone', fullItem.patientPhone);
        formik.setFieldValue('MemberJurisdictionState', fullItem.jurisdictionState);
        formik.setFieldValue('MemberTiT19', fullItem.tIT19);
        formik.setFieldValue('MemberPlanType', fullItem.planType);
        formik.setFieldValue('MemberPusrdf', fullItem.patientPUSRDF);
        formik.setFieldValue('MemberErisa', saveSelectedRecord.erisa);
        formik.setFieldValue('MemberExtId', fullItem.extID);
        formik.setFieldValue('MemberFundingType', saveSelectedRecord.funding);
        formik.setFieldValue('IsQuickCreate', false);
        formik.setFieldValue('MemberEffectiveDate', fullItem.patientEffDate);
        setselectedMember(row);
        setLookupResults([]);
        setSelectedMemberLoading(false);
      }
  }
  };

  const handleQuickCreateMemberDetails = async (row: any) => {
        formik.setFieldValue('MemberId', row.MemberId);
        formik.setFieldTouched('MemberId', false, false);
        formik.errors.MemberId = undefined;
        formik.setFieldValue('MemberFirstName', row.FirstName);
        formik.setFieldValue('MemberLastName', row.LastName);
        formik.setFieldValue('MemberDOB',row.Dob);
        formik.setFieldValue('MemberAddress', row.StreetAddress);
        formik.setFieldValue('MemberFullName', `${row.LastName}, ${row.FirstName}`);
        formik.setFieldValue('MemberAddress1', row.StreetAddress);
        formik.setFieldValue('MemberCity', row.City);
        formik.setFieldValue('MemberState', row.State);
        formik.setFieldValue('MemberZip', row.Zip);
        formik.setFieldValue('MemberGender', row.Gender);
        formik.setFieldValue('IsQuickCreate', isQuickCreate);
        setselectedMember(row);
        setLookupResults([]);
  };

  const columns = [
    {
      name: 'Member ID',
      selector: (row: LookupResult) => row.MemberId,
      sortable: true,
    },
    {
      name: 'Member Name',
      selector: (row: LookupResult) => row.MemberName,
      sortable: true,
    },
    {
      name: 'Address',
      selector: (row: LookupResult) => row.Address,
      sortable: true,
    },
    {
      name: 'Date of Birth',
      selector: (row: LookupResult) => row.MemberDOB,
      sortable: true,
    },
    {
      name: 'Eligibility Dates',
      selector: (row: LookupResult) => row.EligibilityDates,
      sortable: true,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "30px",
        cursor: "pointer",
        border: "1px solid #ddd",
      },
    },
    headCells: {
      style: {
        fontSize: "12px", minHeight: "30px", fontWeight: "bold", padding: "4px", border: "1px solid #ddd",
      },
    },
    cells: {
      style: {
        fontSize: "12px", padding: "4px", border: "1px solid #ddd",
      },
    },
  };

  const handleQuickCreate = () => {
    setShowQuickCreate(true);
    setIsQuickCreate(true);
    formik.setFieldValue('MemberId', '');
    formik.setFieldTouched('MemberId', false, false);
    formik.errors.MemberId = undefined;
    formik.setFieldValue('MemberFirstName', '');
    formik.setFieldValue('MemberLastName', '');
    formik.setFieldValue('MemberDOB', '');
    formik.setFieldValue('MemberAddress', '');
    formik.setFieldValue('MemberInsuranceCategory', '');
    formik.setFieldValue('MemberEligibilityDates', '');
    formik.setFieldValue('MemberIdSearchterm', '');
    formik.setFieldValue('MemberFirstNameSearchterm', '');
    formik.setFieldValue('MemberLastNameSearchterm', '');
    formik.setFieldValue('MemberDOBSearchterm', '');
  };
  const handleCancel = () => {
    setShowQuickCreate(false);
    setIsQuickCreate(false);
  };
  /* istanbul ignore next */
  const handleChange = () => {
    setShowQuickCreate(false);
    setIsQuickCreate(false);
    setselectedMember(null);
    formik.setFieldValue('MemberId', '');
    formik.setFieldTouched('MemberId', false, false);
    formik.errors.MemberId = undefined;
    formik.setFieldValue('MemberFirstName', '');
    formik.setFieldValue('MemberLastName', '');
    formik.setFieldValue('MemberDOB', '');
    formik.setFieldValue('MemberAddress', '');
    formik.setFieldValue('MemberInsuranceCategory', '');
    formik.setFieldValue('MemberEligibilityDates', '');
    formik.setFieldValue('MemberIdSearchterm', '');
    formik.setFieldValue('MemberFirstNameSearchterm', '');
    formik.setFieldValue('MemberLastNameSearchterm', '');
    formik.setFieldValue('MemberDOBSearchterm', '');
  };
  const convertedColumns = useMemo(()=>{
    return columns.map(col => ({
      Header: col.name,
      accessor:(row:any)=> col.selector(row), 
    }));
  },[JSON.stringify(columns)]);

  const tableInstance = useTable({
    columns:convertedColumns,
    data: lookupResults
  });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  function mapActivityToLookupResult(activity : ActivityResponse): LookupResult{
    return{
      MemberId: activity.patientID,
      MemberName: `${activity.lastName ?? ''}, ${activity.firstName ?? ''}`.trim(),
      Address: `${activity.patientAddr1 ?? ''}, ${activity.patientAddr2 ?? ''}, ${activity.patientCity ?? ''}`.trim(),
      MemberDOB: formatCompactDateToMMDDYYY(activity.patientDOB),
      InsuranceCategory: activity.category,
      EligibilityDates: `${formatCompactDateToMMDDYYY(activity.patientEffDate) ?? ''} to ${formatCompactDateToMMDDYYY(activity.patientTermDate) ?? ''}`.trim(),
      FirstName: "",
      LastName: "",
      StreetAddress: "",
      City: "",
      State: "",
      Zip: `${activity.patientZip ?? ''}`,
      Gender: activity.patientGender=="M" ? "Male" : "Female",
      Dob: ""
};
  }

  /* istanbul ignore next */
  return (
    <>
    {isModalOpen && (
      <StaffingRequestModal data-testid='staffing-request-modal' onClose={()=> setIsModalOpen(false)}
      onSelectOption={(value: boolean)=>{
        formik.setFieldValue('IsStaffingRequest', value);
        setIsModalOpen(false)
      }}
      />
    )}
  <Card className="mt-3">
    <CardHeader>Member Information
      { selectedMember && (
        <Button
          variant="dark"
          data-testid="change-button"
          size="sm"
          style={{ float: 'right' }}
          onClick={handleChange  }
        >Change
        </Button>)}
    </CardHeader>
    <CardBody>
    <RequestCustomAlert
      show={customalert.show}
      message={customalert.message}
      discription={customalert.discription}
      variant={customalert.variant as 'success' | 'danger'}
      onClose={() => setAlert({ ...alert, show: false })}
    />
      {(!selectedMember && !showQuickCreate) && (
        <Row>
          <Col md={3}>
            <Form.Group controlId="MemberIdSearchterm" className="mb-1">
              <Form.Label>Member ID *</Form.Label>
              <Form.Control
                type="text"
                name="MemberIdSearchterm"
                size="sm"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.MemberIdSearchterm}
                isInvalid={formik.touched.MemberIdSearchterm && !!formik.errors.MemberIdSearchterm}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.MemberIdSearchterm}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="MemberFirstNameSearchterm" className="mb-1">
              <Form.Label>First Name *</Form.Label>
              <Form.Control
                type="text"
                name="MemberFirstNameSearchterm"
                size="sm"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.MemberFirstNameSearchterm}
                isInvalid={formik.touched.MemberFirstNameSearchterm && !!formik.errors.MemberFirstNameSearchterm}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.MemberFirstName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="MemberLastNameSearchterm" className="mb-1">
              <Form.Label>Last Name *</Form.Label>
              <Form.Control
                type="text"
                name="MemberLastNameSearchterm"
                size="sm"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.MemberLastNameSearchterm}
                isInvalid={formik.touched.MemberLastNameSearchterm && !!formik.errors.MemberLastNameSearchterm}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.MemberLastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="MemberDOBSearchterm" className="mb-1">
              <Form.Label>Date of Birth *</Form.Label>
              <Form.Control
                type="date"
                name="MemberDOBSearchterm"
                size="sm"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.MemberDOBSearchterm}
                isInvalid={formik.touched.MemberDOBSearchterm && !!formik.errors.MemberDOBSearchterm}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.MemberDOBSearchterm}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={12}>
            <CustomAlert
              show={alert.show}
              message={alert.message}
              variant={alert.variant as 'success' | 'danger'}
              onClose={() => setAlert({ ...alert, show: false })}
            />
          </Col>


          {formik.touched.MemberId && formik.errors.MemberId && !formik.values.MemberId ? (
            <div className="invalid-feedback d-block">
              {formik.errors.MemberId}
            </div>
          ) : null}
          <Col md={9}>
            <Button type="button" className="mt-3" variant="dark" onClick={() =>
              handleLookup(
                formik.values.MemberIdSearchterm,
                formik.values.MemberFirstNameSearchterm,
                formik.values.MemberLastNameSearchterm,
                formik.values.MemberDOBSearchterm
              )
            }
            disabled={isLoadingData}>
              {isLoadingData ? (
                <>
                 <span className="spinner-border spinner-border-sm me-2"
                 role="status"
                 aria-hidden="true"
                 ></span>
                 Processing...
                </>
              ):(
                'Search Patient'
              )}
               </Button>
          </Col>
          <Col md={3}>
            <Button variant="dark" onClick={handleQuickCreate} className="mt-3">Quick Create Member</Button>
          </Col>
            {lookupResults.length > 0 && (
        <Col md={12}>
              <TableComponent getTableProps={getTableProps} getTableBodyProps={getTableBodyProps} headerGroups={headerGroups}
              rows={rows} prepareRow={prepareRow} handleRowClick={handleRowClick} currentPage={1} rowsPerPage={10} 
              handleRowsPerPageChange={()=> {}} handleChangePage={()=> {}} totalPages={1} />
        </Col>
       )} 
        </Row>)}

      {(!selectedMember && showQuickCreate) && (
        <MemberQuickCreateForm setShowQuickCreate={setShowQuickCreate} RequestId={RequestId} handleQuickCreateMemberDetails={handleQuickCreateMemberDetails} handleCancel={handleCancel} setAlert={setAlert}></MemberQuickCreateForm>
      )}
      {selectedMemberLoading ?(
        <div className="text-center my-3">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
           Processing Member Details...
        </div>
      ):(
      selectedMember && (
        <Col md={12}>
          <Row>
              <Col md={2}>
                <p><strong>Member ID:</strong> {selectedMember.MemberId}</p>
              </Col>
              <Col md={2}>
                <p><strong>Member Name:</strong> {selectedMember.MemberName ? selectedMember.MemberName : `${selectedMember.FirstName}, ${selectedMember.LastName}`}</p> 
              </Col>
              <Col md={2}>
                <p><strong>Member Gender:</strong> {selectedMember.Gender}</p>
              </Col>
              <Col md={2}>
                <p><strong>Member DOB:</strong> {selectedMember.MemberDOB ? selectedMember.MemberDOB : formatDateDashTOSlash(selectedMember.Dob)}</p> 
              </Col>
              <Col md={2}>
                <p><strong>Member Address:</strong> {selectedMember.Address ? selectedMember.Address : `${selectedMember.StreetAddress}, ${selectedMember.City}, ${selectedMember.State}`}</p>
              </Col>
              <Col md={2}>
                <p><strong>Member Zip:</strong> {selectedMember.Zip}</p>
              </Col>
          </Row>
        </Col>
      )
      )}
    </CardBody>
  </Card>
  </>);

};


export default PatientInfo;
