import { useNavigate } from 'react-router-dom';
import RequestQuery from '../types/RequestQuery';
import React, { useMemo, useState } from 'react';
import { useTable, useFilters, Column, useSortBy } from 'react-table';
import SearchResultModel, { SearchHistoricalResultModel } from '../types/SearchResultModel';
import { SearchRequestById, SearchRequestByName, SearchRequestInHistroy } from '../services/RequestSearch';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ResponseSearchHistoricalReqModel, ResponseSearchReqModel } from '../types/SearchRequestReponseModel';

const SearchHistoricalRequest: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBtn, setSelectedBtn] = useState("ID");
  const [noRecord, setNoRecord] = useState("");
  const [searchValidation, setSearchValidation] = useState(true);
  const [filteredData, setFilteredData] = useState<SearchHistoricalResultModel[]>([]);
  const [filterByStatus, setFilterByStatus] = useState<SearchHistoricalResultModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const handleChangePage = (pageNumber: number) => setCurrentPage(pageNumber);
  const [showHistoricalMember, setShowHistoricalMember] = useState<SearchHistoricalResultModel []>([]);
  const handleViewRequest = (id: string) => {
    /* istanbul ignore next */
    const requestQuery = new RequestQuery(id);
    navigate("/viewrequest", { state: requestQuery });
  };
  const idValidationSchema = Yup.object({
    RequestId: Yup.string().required("Required").test("len", "Minimum 4 character", (val) => val.length >= 4),
  });

    const formikId = useFormik({
      initialValues: {"RequestId" : ""},
      validationSchema: idValidationSchema,
      onSubmit: async (values) => {
          const resp: ResponseSearchHistoricalReqModel = await SearchRequestInHistroy(values.RequestId);
          console.log("requestId", values.RequestId)
          if(resp?.apiError !== ""){
            setFilteredData([])
            setFilterByStatus([]);
            setNoRecord(resp.apiError); 
          } 
          else{
            const result: SearchHistoricalResultModel[] = resp.apiResult;
            setShowHistoricalMember(result)
            setNoRecord(result.length === 0 ? "No Record Found" : ""); 
          } 
          ResetForm(values, "ID");
      }
  });

  const nameValidationSchema = Yup.object().shape({
    MemberFirstName: Yup.string(),
    MemberLastName: Yup.string(),
    MemberDOB: Yup.string(),
  });
/* istanbul ignore next */
  function ResetForm(values: any, input: string) {
    if (input === "ID") { values.RequestId = ""; }
    else {
      values.MemberFirstName = "";
      values.MemberLastName = "";
      values.MemberDOB = "";
    }
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <Row>
                  <Col>
                    <Form.Label className="">Search</Form.Label>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Search By:&nbsp;</Form.Label>
                    </Form.Group>
                  </Col>
                </Row>

                {selectedBtn === "ID" && (
                  <form onSubmit={formikId.handleSubmit}>
                    <Row>
                      <Col md={12}>
                        <Form.Group controlId="RequestId" className="mb-2">
                          <Form.Label>ID/Number</Form.Label>
                          <Form.Control type="text" name="RequestId" placeholder="Request ID" size="sm" onChange={formikId.handleChange} onBlur={formikId.handleBlur}
                            value={formikId.values.RequestId} isInvalid={formikId.touched.RequestId && !!formikId.errors.RequestId}/>
                          <Form.Control.Feedback type="invalid"> {formikId.errors.RequestId} </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button type="submit" className="btn btn-dark float-end"> Search </Button>
                      </Col>
                    </Row>
                  </form>
                )}  
              </CardBody>
            </Card>
            {showHistoricalMember &&
                showHistoricalMember.map((member, index)=> (
                  <Card className='mb-3 mt-3'>
                    <CardHeader>Care Coordination Request Detail</CardHeader>
                    <CardBody>
                        <Col md={12} key={index}>
                          <Card className='mb-3'>
                            <CardHeader>Care Coordination Request</CardHeader>
                            <CardBody>
                            <Row>
                              <Col md={3}>
                                <p><strong>RequestID:</strong> {member.ccRequestID}</p>
                              </Col>
                              <Col md={3}>
                                <p><strong>CaseStatus:</strong> {member.ccCaseStatus}</p>
                              </Col>
                              <Col md={3}>
                                <p><strong>Reason:</strong> {member.ccReason}</p> 
                              </Col>
                              <Col md={3}> 
                                <p><strong>Soc Date:</strong> {member.socDate}</p>
                              </Col>
                          </Row>
                            </CardBody>
                          </Card>
                          <Card className='mb-3'>
                            <CardHeader>Health Plan & Program Detail</CardHeader>
                            <CardBody>
                                <Row>
                                  <Col md={4}>
                                      <p><strong>Insurer :</strong> {member.member?.memberPolicy?.insurer}</p> 
                                    </Col>
                                    <Col md={4}>
                                      <p><strong>Program :</strong> {member.member?.memberPolicy?.program}</p>
                                    </Col>
                               </Row>
                            </CardBody>
                          </Card>
                          <Card className='mb-3'>
                            <CardHeader>Health Plan Case Manager</CardHeader>
                            <CardBody>
                                <Row>
                                <Col md={4}>  
                                 <p><strong>Manager Name:</strong> {member.caseManagerName}`</p> 
                                </Col>
                               </Row>
                            </CardBody>
                          </Card>
                          <Card className='mb-3'>
                            <CardHeader>Member Details</CardHeader>
                            <CardBody>
                                <Col md={4}>
                                 <p><strong>Member Id:</strong> {member.member?.memberID}</p>
                               </Col>
                            </CardBody>
                          </Card>
                          <Card className='mb-3'>
                            <CardHeader>Provider Details</CardHeader>
                            <CardBody>
                                <Row>
                                <Col md={4}>
                                <p><strong>Physician Name:</strong> {member.servicingProvider?.physicianName}</p>
                              </Col>
                               </Row>
                            </CardBody>
                          </Card>
                          <Card className='mb-3'>
                            <CardHeader>Procedures Code Details</CardHeader>
                            <CardBody>
                             <Col md={4}>
                                <p><strong>Procedures Code Details :</strong></p>
                                <ul>
                                  {member.procedure.map((proc, procIndex)=>(
                                    <li key={procIndex}>{proc.procedureCode} - {proc.procedureCodeDescription}</li>
                                  ))}
                               </ul> 
                              </Col>
                            </CardBody>
                          </Card>
                        </Col>
                        </CardBody> 
                    </Card>        
                      ))} 
                 </Col>
              </Row>
          </Container>

        <Container>
      </Container>
    </>
  );
};

export default SearchHistoricalRequest;
