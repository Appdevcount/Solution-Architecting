import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RequestQuery from '../types/RequestQuery';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import HealthPlanCaseManager from '../components/RequestSummary/HealthPlanCaseManager';
import ServicingProvider from '../components/RequestSummary/ServicingProvider';
import ProcedureCode from '../components/RequestSummary/ProcedureCode';
import Notes from '../components/RequestSummary/Notes';
import FollowUpInfo from '../components/RequestSummary/FollowUpInfo';
import CareCoordinationInfo from '../components/RequestSummary/CareCoordination';
import MemberInformation from '../components/RequestSummary/MemberInformation';
import RequesterInfoSummary from '../components/RequestSummary/RequesterInfoSummary';
import * as RequestService from '../services/RequestService';
import { useDispatch, useSelector } from 'react-redux';
import { RequestState, setRequestDetails } from '../state/reducers/requestSlice';
import Attachments from '../components/RequestSummary/Attachments';
import { GetRequest, UndoEscalate, UndoMSOC, UpdateMSOC } from '../services/RequestService';
import { RootState } from '../state/store/store';
import MSOC from '../components/RequestSummary/MSOC';
import CloseRequest from '../components/RequestSummary/CloseRequest';
import Activity from '../components/RequestSummary/Activity';
import Escalate from '../components/RequestSummary/Escalate';

const ViewRequest: React.FC = () => {
    const location = useLocation();
    const requestQuery = location.state as RequestQuery;
    const dispatch = useDispatch();
    const [request, setRequest] = useState<RequestState | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState(request?.RequestInformation?.Status|| "Open"); // Track the status
    const [showMSOCTag, setShowMSOCTag] = useState(false); 
    const [isUndoMSOCMode, setIsUndoMSOCMode] = useState(false); 

    const [showMSOCModal, setShowMSOCModal] = useState(false); 
    const [showEscalateModal, setShowEscalateModal] = useState(false); 
    const [showEscalateTag, setShowEscalateTag] = useState(false); 
    const [showQuickCreatedMemberTag, setShowQuickCreatedMemberTag] = useState(false); 
    const [IsSupervisor, setIsSupervisor] = useState(false);
    const [IsCaseOwned, setIsCaseOwned] = useState(false);
    const [activityRefreshFlag,setActivityRefreshFlag] = useState(false);


    const authState: any = useSelector((state: RootState) => state.auth);
    // const requestDetail: any = useSelector((state: RootState) => state.request);
    const isStaffedRequest: boolean= request?.StaffedRequest ?? true;
    console.log(isStaffedRequest);

    
        useEffect(() => {
            if (request?.RequestInformation) {
                setStatus(request?.RequestInformation?.Status);
            }
            if(request?.MSOCtag === true){
            setShowMSOCTag(true);
            }
            if(request?.MSOCtag === true){
            setIsUndoMSOCMode(true);
            }
            if(request?.RequestInformation?.isEscalated === true){
                setShowEscalateTag(true);
            }
            if(request?.MemberInformation?.MemberQuickCreate === true){
                setShowQuickCreatedMemberTag(true);
            }
            if(request?.AssignToId == authState?.user?.email)
            {
               setIsCaseOwned(true);
            }
             /* istanbul ignore next */
            if(authState?.user?.roles.includes("CCCordSup","NCCCordSup") )
            {
                setIsSupervisor(true);
             }

        }, [request]);
   

    const handleMSOC = () => {
        setShowMSOCModal(true); 
        setActivityRefreshFlag(true);
    };

     /* istanbul ignore next */
    const handleHideMSOCModal = () => {
        setShowMSOCModal(false); 
    };
     /* istanbul ignore next */
    const handleMSOCSuccess = () => {
        setShowMSOCTag(true); 
        setIsUndoMSOCMode(true); 
        setShowMSOCModal(false); 
    };

      /* istanbul ignore next */
    const handleUndoMSOC = async () => {
        try {
            const response = await UndoMSOC(requestQuery.RequestId,authState?.user?.email);
            if(response.apiResp){
               
            setShowMSOCTag(false); 
            setIsUndoMSOCMode(false);
            } 
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                alert("Undo failed: " + error.message); 
            } else {
                console.error("Unexpected error", error);
            }
        }
    };
      /* istanbul ignore next */
    const handleUndoEscalate= async () => {
        try {
            const response = await UndoEscalate(requestQuery.RequestId,authState?.user?.email);
            if(response.apiResp){
               
            setShowEscalateTag(false); 
            setActivityRefreshFlag(true);
            
            } 
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                alert("Undo failed: " + error.message); 
            } else {
                console.error("Unexpected error", error);
            }
        }
    };

    const handleEscalate = () => {
        setShowEscalateModal(true); 
        setActivityRefreshFlag(true);
        

    };
    /* istanbul ignore next */
    const handleHideEscalateModal = () => {
        setShowEscalateModal(false); 
    };
     /* istanbul ignore next */
    const handleEscalateSuccess = () => {
        setShowEscalateTag(true);  
        setShowEscalateModal(false); 
    };

    useEffect(() => {
        const fetchRequestDetails = async () => {
            try {
                const response = await RequestService.GetRequest(requestQuery.RequestId);
                setRequest(response);
                if(response){
                dispatch(setRequestDetails(response));
                }
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(String(error));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRequestDetails();
    }, [dispatch, requestQuery]);

    const followUpRef = useRef<HTMLDivElement>(null);
    const careCoordinationRef = useRef<HTMLDivElement>(null);
    const requesterInfoRef = useRef<HTMLDivElement>(null);
    const healthPlanCaseManagerRef = useRef<HTMLDivElement>(null);
    const notesRef = useRef<HTMLDivElement>(null);
    const memberInformationRef = useRef<HTMLDivElement>(null);
    const servicingProviderRef = useRef<HTMLDivElement>(null);
    const procedureCodeRef = useRef<HTMLDivElement>(null);
    const attachmentsRef = useRef<HTMLDivElement>(null);
    const activityRef = useRef<HTMLDivElement>(null);
     /* istanbul ignore next */
    const scrollToComponent = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [showModalCloseRequest, setShowModalCloseRequest] = useState(false); 
   
    const handleShowModalCloseRequest = () => {
        setShowModalCloseRequest(true); 
    };
  
    const handleCloseModal = () => {
        setShowModalCloseRequest(false); 
    };
  
    /* istanbul ignore next */
    const handleConfirmAction = () => {
        setShowModalCloseRequest(false); 
    };
     /* istanbul ignore next */
    const handleSuccessCloseRequest = () => {
      setStatus("Closed"); 
      setActivityRefreshFlag(true);
    };
     /* istanbul ignore next */
    const handleSubmit = () => {
      setShowModalCloseRequest(false); 
    };

    if (loading) {
        return <div>Processing...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

/* istanbul ignore next */
    return (
        <div>
            <div className="sticky-top bg-light p-1 border-bottom">
                <Container fluid>
                    <Row>
                        <Col>
                            <p className="mb-1">
                                <label>Request # :</label> <strong>{request?.RequestInformation?.RequestId}</strong>
                            </p>
                            <p className="mb-1">
                                <label>Status :</label>
                                &nbsp;
                                {status === "Open"? (
                                    <span className="bg-success rounded-circle d-inline-block" style={{ width: '10px', height: '10px' }}></span>
                                ) : (
                                    <span className="bg-danger rounded-circle d-inline-block" style={{ width: '10px', height: '10px' }}></span>
                                )}
                                &nbsp;<strong>{status}</strong>
                                &nbsp;
                                {showMSOCTag && (
                                    <>
                                        &nbsp;
                                        <Button
                                            variant="outline-dark"
                                            size="sm"
                                            className="rounded-pill"
                                            style={{ padding: "0.375rem 0.75rem", fontWeight: "bold", fontSize: "0.875rem" }} // Same size as other buttons
                                        >
                                            MSOC
                                        </Button>
                                    </>
                                )}
                                {showEscalateTag ? <Button
                                            variant="outline-dark"
                                            size="sm"
                                            className="rounded-pill"
                                            style={{ padding: "0.375rem 0.75rem", fontWeight: "bold", fontSize: "0.875rem" }} // Same size as other buttons
                                        >
                                            Escalated
                                        </Button> : ""} &nbsp;
                                {showQuickCreatedMemberTag ? <Button
                                            variant="outline-dark"
                                            size="sm"
                                            className="rounded-pill"
                                            style={{ padding: "0.375rem 0.75rem", fontWeight: "bold", fontSize: "0.875rem" }} // Same size as other buttons
                                        >
                                            QuickCreatedMember
                                        </Button> : ""} &nbsp;        
                                        
                            </p>
                            
                        </Col>
                        <Col className="text-end">
                            <p className="mb-1"><strong>{request?.MemberInformation?.Name}</strong></p>
                            <p className="mb-1">
                                (<strong>{request?.MemberInformation?.DateOfBirth}</strong>) 
                                &nbsp;<strong>{request?.MemberInformation?.Age}</strong> 
                                &nbsp;<strong>{request?.MemberInformation?.Gender}</strong>
                            </p>
                            <p className="mb-1">
                                MemID: <strong>{request?.MemberInformation?.MemberId}</strong> | <strong>{request?.MemberInformation?.Insurance}</strong>
                            </p>
                        </Col>
                    </Row>
                    <Row className="mt-1">
                        <Col>                       
                             { (IsCaseOwned || IsSupervisor) && status !== "Closed" && showEscalateTag == false  && ( <Button 
                                    variant="dark"
                                    size="sm" className="mr-1 mb-1" 
                                    onClick={handleEscalate}>
                                    Escalate Request
                                </Button>
                             )}
                             { (IsCaseOwned || IsSupervisor) && status !== "Closed" && showEscalateTag == true  && ( <Button 
                                    variant="dark"
                                    size="sm" className="mr-1 mb-1" 
                                    onClick={handleUndoEscalate}>
                                    Undo Escalation
                                </Button>
                             )}
                                { (IsCaseOwned || IsSupervisor) && status !== "Closed" && (<Button
                                    variant="dark"
                                    size="sm"
                                    className="mr-1 mb-1"
                                    data-testid="Undo MSOC"
                                    onClick={isUndoMSOCMode ? handleUndoMSOC : handleMSOC} 
                                >
                                    {isUndoMSOCMode ? "Undo MSOC" : "MSOC"}
                                </Button>
                                )}
                              
                            <MSOC show={showMSOCModal} onHide={handleHideMSOCModal} onSuccess={handleMSOCSuccess} title="MSOC" body={<div></div>} />
                            <Escalate show={showEscalateModal} onHide={handleHideEscalateModal} onSuccess={handleEscalateSuccess} title="Escalate" body={<div>{!showEscalateTag ?"Do you want to escalate this request?":""}</div>} />

                            {status == "Open" &&
                                <>
                                    <Button data-testid="Close Button" variant="dark" size="sm"  onClick={handleShowModalCloseRequest}
                                    type="button" className="mr-1 mb-1">Close request</Button> 
                                    <CloseRequest                 
                                        RequestId='request?.RequestInformation?.RequestId'
                                        show={showModalCloseRequest}
                                        onHide={handleCloseModal}
                                        onConfirm={handleConfirmAction}
                                        onSuccess={handleSuccessCloseRequest}
                                        title="Close Request"
                                        body={<div>Please write a reason to close the request :-</div>}
                                    />
                                </>                                                                
                            } 
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container fluid className="mt-1">
                <Row>
                    <Col md={3} ref={followUpRef}>
                        <FollowUpInfo ></FollowUpInfo>
                    </Col>
                    <Col md={3} ref={careCoordinationRef}>
                        <CareCoordinationInfo ></CareCoordinationInfo>
                    </Col>
                    <Col md={3} ref={requesterInfoRef}>
                        <RequesterInfoSummary />
                    </Col>
                    <Col md={3} ref={healthPlanCaseManagerRef} >
                        <HealthPlanCaseManager />
                    </Col>
                    <Col md={6} ref={procedureCodeRef}>
                            <ProcedureCode></ProcedureCode>
                    </Col> 
                    {isStaffedRequest && (                
                    <Col md={6} ref={servicingProviderRef}>
                        <ServicingProvider></ServicingProvider>
                    </Col>
                    )}                   
                    <Col md={6} ref={memberInformationRef}>
                        <MemberInformation ></MemberInformation>
                    </Col>
                    <Col md={3} ref={notesRef}>
                        <Notes ></Notes>
                    </Col>
                    <Col md={3}>
                        <Attachments />
                    </Col>
                    <Col md={4}>
                       <Activity refreshFlag={activityRefreshFlag} resetRefreshFlag={()=> setActivityRefreshFlag(false)}></Activity>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ViewRequest;
