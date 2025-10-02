import { useNavigate } from 'react-router-dom';
import RequestQuery from '../types/RequestQuery';
import React, { useMemo, useState } from 'react';
import { useTable, useFilters, Column, useSortBy } from 'react-table';
import SearchResultModel from '../types/SearchResultModel';
import { SearchRequestById, SearchRequestByName } from '../services/RequestSearch';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ResponseSearchReqModel } from '../types/SearchRequestReponseModel';
import { RootState } from '../state/store/store';
import { useSelector } from 'react-redux';

const columns: Column<SearchResultModel>[] = [
  { Header: 'CreateDate', accessor: 'CreateDate' },
  { Header: 'PatientName', accessor: 'PatientName' },
  { Header: 'PatientDOB', accessor: 'PatientDOB' },
  { Header: 'Program', accessor: 'Program' },
  { Header: 'CareCoordinationEpisodeId', accessor: 'CareCoordinationEpisodeId' },
  { Header: 'PatientID', accessor: 'PatientID' },
  { Header: 'HealthPlan', accessor: 'HealthPlan' },
  { Header: 'DateOfService', accessor: 'DateOfService' },
  { Header: 'CaseStatus', accessor: 'CaseStatus' }
 

];

const SearchRequest: React.FC = () => {
  const navigate = useNavigate();
  const memoizedColumns = useMemo(() => columns, []);
  const [selectedBtn, setSelectedBtn] = useState("ID");
  const [noRecord, setNoRecord] = useState("");
  const [searchValidation, setSearchValidation] = useState(true);
  const [filteredData, setFilteredData] = useState<SearchResultModel[]>([]);
  const [filterByStatus, setFilterByStatus] = useState<SearchResultModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const handleChangePage = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleViewRequest = (id: string) => {
    const requestQuery = new RequestQuery(id);
    navigate("/viewrequest", { state: requestQuery });
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    ResetPagination(Number(event.target.value));
  };

  function ResetPagination(num: number) {
    setRowsPerPage(num);
    setCurrentPage(1);
  }

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      { columns: memoizedColumns, data: filteredData },
      useFilters,
      useSortBy
    );

  const handleSrchByClick = (input: string) => {
    setSelectedBtn(input === "ID" ? "ID" : "Name");
    setFilteredData([]);
    setFilterByStatus([]);
    ResetPagination(5);
    setNoRecord("");
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;   
    const filterData = filterByStatus;
    /* istanbul ignore next */
    if (selectedOption !== "") {
      const filterRes = selectedOption === "Open"? filterData.filter((x) => x.CaseStatus === "Open"): selectedOption === "Closed"
            ? filterData.filter((x) => x.CaseStatus === "Closed"): filterData;     
      setFilteredData(filterRes);       
      setNoRecord(filterRes.length === 0 ? "No Record Found" : "");    
      ResetPagination(5);      
    } 
  };
  const idValidationSchema = Yup.object({
    RequestId: Yup.string().required("Required").test("len", "Minimum 4 character", (val) => val.length >= 4),
  });

  const authState: any = useSelector((state: RootState) => state.auth);
  const userName:string = authState?.user?.email;
  const hasLEA:boolean = authState?.user?.hasLEA;

    const formikId = useFormik({
      initialValues: {"RequestId" : ""},
      validationSchema: idValidationSchema,
      onSubmit: async (values) => {
          const resp: ResponseSearchReqModel = await SearchRequestById(values.RequestId,userName);
             /* istanbul ignore next */
          if(resp?.apiError !== ""){
            setFilteredData([])
            setFilterByStatus([]);
            setNoRecord(resp.apiError); 
          } 
          else{
            const result: SearchResultModel[] = resp.apiResult;
            setFilteredData(result)
            setFilterByStatus(result);
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

  const formikName = useFormik({
    initialValues: { MemberFirstName: "", MemberLastName: "", MemberDOB: "" },
    validationSchema: nameValidationSchema,
    onSubmit: async (values) => {
        if(!values.MemberFirstName && !values.MemberLastName && !values.MemberDOB){
            setSearchValidation(false);
            return;
        }
        setSearchValidation(true);
        const resp: ResponseSearchReqModel = await SearchRequestByName(values.MemberFirstName,values.MemberLastName,values.MemberDOB,userName);
           /* istanbul ignore next */  
        if(resp?.apiError !== ""){
            setFilteredData([])
            setFilterByStatus([]);
            setNoRecord(resp.apiError); 
          } 
          else{
            const result: SearchResultModel[] = resp.apiResult;
            setFilteredData(result)
            setFilterByStatus(result);
            setNoRecord(result.length === 0 ? "No Record Found" : ""); 
          } 
         ResetForm(values, "Name");
    }
});

  function ResetForm(values: any, input: string) {
    if (input === "ID") { values.RequestId = ""; }
    else {
      values.MemberFirstName = "";
      values.MemberLastName = "";
      values.MemberDOB = "";
    }
  }

  /* istanbul ignore next */
  return (
    <>
      <Container className="mt-3">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <Row>
                  <Col>
                    <Form.Label className="fs-6">Search</Form.Label>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Search By:&nbsp;</Form.Label>
                      <button type="button" onClick={() => handleSrchByClick("ID")}
                        className={selectedBtn === "ID"? "btn btn-dark": "btn btn-light"}>Search by Id</button>
                      <button type="button" onClick={() => handleSrchByClick("Name")}
                        className={selectedBtn === "Name"? "btn btn-dark": "btn btn-light"}>Search by Patient
                      </button>
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
                {selectedBtn === "Name" && (
                  <form onSubmit={formikName.handleSubmit}>
                    <Row>
                      <Col md={4}>
                        <Form.Group controlId="MemberFirstName" className="mb-2">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control type="text" name="MemberFirstName" size="sm" onChange={formikName.handleChange} onBlur={formikName.handleBlur}
                            value={formikName.values.MemberFirstName}
                            isInvalid={
                              formikName.touched.MemberFirstName &&
                              !!formikName.errors.MemberFirstName } />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="MemberLastName" className="mb-2">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control type="text" name="MemberLastName" size="sm" onChange={formikName.handleChange} onBlur={formikName.handleBlur}
                            value={formikName.values.MemberLastName}
                            isInvalid={
                              formikName.touched.MemberLastName &&
                              !!formikName.errors.MemberLastName } />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="MemberDOB" className="mb-2">
                          <Form.Label>Date of birth</Form.Label>
                          <Form.Control type="Date" name="MemberDOB" placeholder="mm/dd/yyyy" size="sm" onChange={formikName.handleChange} onBlur={formikName.handleBlur}
                            value={formikName.values.MemberDOB}
                            isInvalid={
                              formikName.touched.MemberDOB &&
                              !!formikName.errors.MemberDOB } />
                        </Form.Group>
                      </Col>
                    </Row>
                    {!searchValidation && (
                      <Row>
                        <Col>
                          <div
                            style={{ width: "100%",marginTop: ".25rem",fontSize: ".875em",color: "#dc3545",}}>
                            Please enter at least one field
                          </div>
                        </Col>
                      </Row>
                    )}
                    <Row>
                      <Col>
                        <Button type="submit" className="btn btn-dark float-end">Search</Button>
                      </Col>
                    </Row>
                  </form>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container>
        {filterByStatus.length > 0 && (
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row>
                    <Col md={4}>
                      <Form.Label>Status</Form.Label>
                      <Form.Select onChange={handleSelectChange}>
                        <option value="All">All</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {filteredData.length > 0 && (
          <Row>
            <Col>
              <Card>
                <CardHeader>Result</CardHeader>
                <CardBody>
                  <Row>
                    <Col>
                      <Form.Label>
                        Select a Patient from the search result Below
                      </Form.Label>
                    </Col>
                  </Row>
                  <Table {...getTableProps()} border={1}>
                    <thead>
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()} style={{ border: "1px solid #e0e0e0" }}>
                              {column.render("Header")}
                              <div style={{ display: "flex", justifyContent: "center", gap: "5px",}}></div>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {rows
                        .slice(
                          (currentPage - 1) * rowsPerPage,
                          (currentPage - 1 + 1) * rowsPerPage
                        )
                        .map((row) => {
                          prepareRow(row);
                          return ( 
                                                            
                            <tr {...row.getRowProps()}
                              onClick={(e) => {                                
                                if ( row.original.IsRestrictedMember && !hasLEA ) return; // Block clicks for IsRestrictedMember rows with no access
                            
                                handleViewRequest(row.values.CareCoordinationEpisodeId);
                              }}                           
                            >
                              {row.cells.map((cell) => (
                                <td {...cell.getCellProps()} style={{
                                  border: '1px solid #e0e0e0',
                                   position : 'relative'
                                }}>
                                  <div style={{
                                  filter: row.original.IsRestrictedMember && !hasLEA   ? 'blur(5px)' : 'none',
                                  pointerEvents: row.original.IsRestrictedMember && !hasLEA  ? 'none' : 'auto',
                                  position : 'relative' // Optional: disable hover effects
                                }}>
                                 
                                  {cell.render("Cell")}
                                  </div>
                                  <div style = {{position:'relative'}}>
                                  </div>
                                 <div>
                                 {row.original.IsRestrictedMember && !hasLEA && (<div style={{display:'flex',justifyContent:'center',fontSize:'10px',color:'orange'}}>Restricted</div>)}

                                 </div>
                                </td>
                              ))}
                            </tr>      
                          );
                        })}
                    </tbody>
                    <tfoot>
                      <tr style={{ justifyContent: "space-between", alignItems: "center",}}>
                        <td className="col-md-4">
                          <label htmlFor="rowsPerPage">Rows Per Page: </label>
                          <select id="rowsPerPage" value={rowsPerPage} onChange={handleRowsPerPageChange}
                            style={{ padding: "5px", borderRadius: "5px", border: "1px solid#ccc",}}
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                          </select>
                        </td>
                        <td className="col-md-8">
                          <button className={"btn btn-dark"} onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1}
                            style={{ padding: "5px 10px", margin: "0 5px", borderRadius: "5px", border: "1px solid #ccc",
                              cursor:
                                currentPage === 1 ? "not-allowed" : "pointer",
                            }}>
                            Previous
                          </button>
                          <span>
                            Page {currentPage} of {totalPages}
                          </span>
                          <button className={"btn btn-dark"} onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === totalPages}
                            style={{ padding: "5px 10px", margin: "0 5px", borderRadius: "5px", border: "1px solid #ccc",
                              cursor:
                                currentPage === totalPages
                                  ? "not-allowed"
                                  : "pointer",
                            }}>Next</button>
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
        {filteredData.length === 0 && noRecord !== "" && (
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <Form.Label>Result</Form.Label>
                </CardHeader>
                <CardFooter>
                  <Row>
                    <Col>
                      <Card>
                        <CardBody>
                          <Form.Label className="">{noRecord}</Form.Label>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default SearchRequest;
