
import React, { useMemo, useState, useEffect } from 'react';
import { Button, Card, CardBody,  CardHeader, Col,  Form, Row, Table } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomAlert from '../../components/CustomAlert';
import { Column, useFilters, useSortBy, useTable } from 'react-table';
import { AddProcedureCode, GetProcedureCode, ProcedureDetails, RemoveProcedureCode } from '../../services/ProcedureCodeSevice';
import { ProcedureCodeApiResult, ResponseProcedureCodeModel } from '../../types/ResponseModel';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store/store';
import Loader from '../Loader';

const columns: Column<ProcedureDetails>[] = [
    { Header: 'ProcedureCode', accessor: 'procedureCode' },
    { Header: 'Name', accessor: 'procedureDesc' }
];

const ProcedureCode: React.FC = () => {
    const memoizedColumns = useMemo(() => columns, []);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [noRecord, setNoRecord] = useState("");
    const [searchResults, setSearchResults] = useState<ProcedureDetails[]>([]);
    const [procedureList, setProcedureList] = useState<ProcedureDetails[]>([]);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const totalPages = Math.ceil(searchResults.length / rowsPerPage);
    const handleChangePage = (pageNumber: number) => setCurrentPage(pageNumber);
    const request: any = useSelector((state: RootState) => state.request);
    const [checkboxValues, setCheckboxValues] = useState<{ [key: string]: string }>({});
    const [episodId, setEpisodId] = useState<string | undefined>(undefined);
    const [IsSupervisor, setIsSupervisor] = useState(false);
    const [IsOwnedRequest, setIsOwnedRequest] = useState(false);
    const authState: any = useSelector((state: RootState) => state.auth);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [loading, setLoading] = useState(false);
     
    /* istanbul ignore next */
     useEffect(() => {
            if (request.ProcedureCode) {
                setProcedureList(request.ProcedureCode);
            }
            if (request) {
                setEpisodId(request.RequestId);
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

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        ResetPagination(Number(event.target.value));
    };

    function ResetPagination(num: number) {
        setRowsPerPage(num);
        setCurrentPage(1);
    }

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns: memoizedColumns, data: searchResults },
        useFilters,
        useSortBy
    );
    
    const searchFormik = useFormik({
        initialValues: {
            searchQuery:''
        },
        validationSchema: Yup.object({
            searchQuery: Yup.string().required('Procedure Code or Description is required'),
        }),
        onSubmit: async (values) => {
            setIsLoadingData(true);
            const response: ResponseProcedureCodeModel = await GetProcedureCode(request.HealthPlan,request.CompanyId, values.searchQuery);
            if (response?.apiError !== "") {
                setSearchResults([]);
                setNoRecord(response?.apiError);
                setIsLoadingData(false);
            }
            else {
                const apiResponse :ProcedureCodeApiResult = response.apiResult;
                const result: ProcedureDetails[] = apiResponse.procedureCodeDetails;
                setSearchResults(result);
                
                setNoRecord(result?.length === 0 ? "No Record Found" : "");
            }
            setIsLoadingData(false);
        },
    });

    const handleAdd = () => {
        setIsAdding(true);
    };

    const handleCancel = () => {
        setIsAdding(false);
        searchFormik.resetForm();
        setSearchResults([]);
        setNoRecord("");
    };


      
    /* istanbul ignore next */
    const handleSave = async (procCode: string, procName: string) => {
        setLoadingData(true);
        if (procCode !== "" && procName !== "") {
            const checkboxChecked = isChecked ? "Yes" : "No";

            const maxEntries: { [key: string]: number } = {
                sleep: 10,
                dme: 20,
                homehealth: 10,
                hit: 10,
            };

            const currentTypeCount = procedureList.length;
            const normalizeSearchType = (type: string): string => {
                return type.toLowerCase().replace(/\s+/g, ""); 
            };
           /* istanbul ignore next */
            if (maxEntries[normalizeSearchType(searchType)] && currentTypeCount >= maxEntries[normalizeSearchType(searchType)]) {
                setAlert({
                    show: true,
                    message: `You can only select a maximum of ${maxEntries[searchType]} procedure codes for ${searchType}!`,
                    variant: "danger",
                });
                setLoadingData(false);
                return;
            }
                  /* istanbul ignore next */
            if (procedureList?.length > 0) {
                if (
                    procedureList.filter(
                        (x) => x.procedureCode.toLowerCase() === procCode.toLowerCase()
                    ).length > 0
                ) {
                    setAlert({
                        show: true,
                        message: "Duplicate procedure code cannot be selected!",
                        variant: "danger",
                    });
                    setLoadingData(false);
                    return;
                }
            }
        
            const response: ResponseProcedureCodeModel = await AddProcedureCode(episodId, procCode, procName);
            if (response?.apiError !== "") {
                setAlert({ show: true, message: response?.apiError, variant: "danger" });
            } else {
                
                setProcedureList(prevList => [ ...prevList,{ procedureCode: procCode, procedureDesc: procName } ]);
                setCheckboxValues((prevValues) => ({
                    ...prevValues,
                    [procCode]: checkboxChecked, 
                }));
                setAlert({ show: true, message: "Success!", variant: "success" });
                setIsChecked(false);
            }
            setIsAdding(true);
            searchFormik.resetForm();
            setSearchResults([]);
        } else {
            setAlert({
                show: true,
                message: "Please select a valid ProcedureCode",
                variant: "danger",
            });
        }
        setLoadingData(false);
    };


    const handleRemove = async (procCode: string, procName: string) => {
        setLoading(true);
        const response: ResponseProcedureCodeModel = await RemoveProcedureCode(episodId, procCode, procName);
        if (response?.apiError !== "") {
            setAlert({ show: true, message: response?.apiError, variant: 'danger' });
        }
        else {
            const result = procedureList.filter(procedure => procedure.procedureCode !== procCode);
            setProcedureList(result);
            setAlert({ show: true, message: procCode + ' removed successfully!', variant: 'success' });
        }
        setLoading(false);
    };

    const [serviceType, setServiceType] = useState<string | null>(null);

    useEffect(() => {
        if (request.CareCoordinationInformation) {
            setServiceType(request.CareCoordinationInformation.ServiceType);
        }
    }, [request]);

    const searchType = serviceType as string;

    const [isChecked , setIsChecked] = useState(false);
    var trimSearchType ='';
    if(searchType){
      trimSearchType = searchType.replace(/\s+$/, '');
    console.log(trimSearchType);
    }

    let checkboxLable ="";
    if(trimSearchType === "Home Health"){
        checkboxLable = "Private Duty Nurse";
    }else if (trimSearchType === "Durable Medical Equipment(DME)"){
        checkboxLable = "Custom Need";
    }

    let hideActionButton :boolean = (!IsOwnedRequest || !IsSupervisor) && request?.RequestInformation?.Status === "Closed"
          /* istanbul ignore next */
    return (
        <Col md={12}>
            <Card className="mb-1">
                <CardHeader>
                    <legend> Procedure Code
                        {!isAdding && !hideActionButton &&  (
                            <Button variant="dark" size="sm" style={{ float: 'right' }} disabled = {(!IsOwnedRequest || !IsSupervisor) && request?.RequestInformation?.Status === "Closed"} onClick={handleAdd}>
                                Edit
                            </Button>
                        )}
                        {isAdding && !hideActionButton && (
                            <Button variant="dark" size="sm" style={{ float: 'right' }} onClick={handleCancel}>
                                Cancel
                            </Button>
                        )}</legend>
                </CardHeader>
                <CardBody className="p-2">
                <CustomAlert
                        show={alert.show}
                        message={alert.message}
                        variant={alert.variant as 'success' | 'danger'}
                        onClose={() => setAlert({ ...alert, show: false })}
                    />
                    {procedureList?.length > 0 && (
                        <Row>
                            <Col>
                                <Table border={1}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid #e0e0e0' }}>
                                                ProcedureCode
                                            </th>
                                            <th style={{ border: '1px solid #e0e0e0' }}>
                                                Name
                                            </th>
                                            {checkboxLable && (
                                                <th style={{ border: '1px solid #e0e0e0' }}>
                                                    {checkboxLable}
                                                </th>
                                             )}
                                            {isAdding &&
                                                <th style={{ border: '1px solid #e0e0e0' }}>
                                                    Action
                                                </th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            procedureList.map((item) => (
                                                <tr>
                                                    <td style={{ border: '1px solid #e0e0e0' }}>{item.procedureCode}</td>
                                                    <td style={{ border: '1px solid #e0e0e0' }}>{item.procedureDesc}</td>
                                                    {checkboxLable && <td style={{ border: '1px solid #e0e0e0' }}>
                                                        {checkboxValues[item.procedureCode] || "No"}
                                                    </td>
                                                    }
                                                    {isAdding && <td style={{ border: '1px solid #e0e0e0' }}>
                                                        <Button variant="dark" size="sm" onClick={() => handleRemove(item.procedureCode, item.procedureDesc)}disabled={loading}>{loading ? <Loader /> : 'Remove'}</Button>
                                                    </td>
                                                    }                                                   
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    )}
                    {isAdding && (
                        <Form onSubmit={searchFormik.handleSubmit}>
                            <Form.Group controlId="formSearchQuery">
                                <Form.Label>Search Procedure</Form.Label>
                                <Form.Control name="searchQuery" type="text" value={searchFormik.values.searchQuery} onChange={searchFormik.handleChange}
                                    onBlur={searchFormik.handleBlur} isInvalid={!!(searchFormik.touched.searchQuery && searchFormik.errors.searchQuery)} />
                                <Form.Control.Feedback type="invalid"> {searchFormik.errors.searchQuery} </Form.Control.Feedback>
                                
                                {checkboxLable && (
                                    <Form.Check 
                                        type="checkbox" 
                                        name="agreeToTerms"
                                        checked={isChecked} 
                                        onChange ={(e) => setIsChecked(e.target.checked)}
                                        label={
                                            <span style={{ fontFamily: 'var(--bs-body-font-family)', fontWeight: 'bold', fontSize: '12px' }}>
                                                {checkboxLable}
                                            </span>
                                        } 
                                    />
                                    )}
                            </Form.Group>
                            <Button variant="dark" type="submit" disabled={isLoadingData}>  {isLoadingData ? <Loader /> : 'Search'} </Button>
                        </Form>
                    )}

                    {isAdding && (<>
                        {searchResults.length > 0 && (
                            <Row>
                                <Col><Card>
                                    <CardBody>
                                        <Table {...getTableProps()} border={1}>
                                            <thead>
                                                {headerGroups.map(headerGroup => (
                                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                                        {headerGroup.headers.map(column => (
                                                            <th {...column.getHeaderProps()} style={{ border: '1px solid #e0e0e0' }}>
                                                                {column.render('Header')}
                                                                <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                                                                </div>
                                                            </th>
                                                        ))}
                                                        <th> Action </th>
                                                    </tr>
                                                ))}
                                            </thead>
                                            <tbody {...getTableBodyProps()}>
                                                {rows.slice((currentPage - 1) * rowsPerPage, ((currentPage - 1) + 1) * rowsPerPage).map((row) => {
                                                    prepareRow(row)
                                                    return (
                                                        <tr {...row.getRowProps()}>
                                                            {row.cells.map(cell =>
                                                                <td {...cell.getCellProps()} style={{ border: '1px solid #e0e0e0' }}>{cell.render('Cell')}
                                                                </td>
                                                            )}
                                                            <td style={{ border: '1px solid #e0e0e0' }}>

                                                                <Button variant="dark" className="ml-2" onClick={() => handleSave(row.values.procedureCode, row.values.procedureDesc)}disabled={loadingData}>  {loadingData ? <Loader /> : 'Save'}</Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                            <tfoot>
                                                <tr style={{ justifyContent: "space-between", alignItems: "center" }}>
                                                    <td className="col-md-4">
                                                        <label htmlFor="rowsPerPage">Rows Per Page: </label>
                                                        <select id="rowsPerPage" value={rowsPerPage} onChange={handleRowsPerPageChange} style={{ padding: "5px", borderRadius: "5px", border: "1px solid#ccc" }}>
                                                            <option value={5}>5</option>
                                                            <option value={10}>10</option>
                                                            <option value={15}>15</option>
                                                        </select>
                                                    </td>
                                                    <td className="col-md-8">
                                                        <button
                                                            className={'btn btn-dark'}
                                                            onClick={() => handleChangePage(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                            style={{
                                                                padding: "5px 10px",
                                                                margin: "0 5px",
                                                                borderRadius: "5px",
                                                                border: "1px solid #ccc",
                                                                cursor: currentPage === 1 ? "not-allowed" : "pointer"
                                                            }}
                                                        >
                                                            Previous
                                                        </button>
                                                        <span>Page {currentPage} of {totalPages}</span>
                                                        <button
                                                            className={'btn btn-dark'}
                                                            onClick={() => handleChangePage(currentPage + 1)}
                                                            disabled={currentPage === totalPages}
                                                            style={{
                                                                padding: "5px 10px",
                                                                margin: "0 5px",
                                                                borderRadius: "5px",
                                                                border: "1px solid #ccc",
                                                                cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                                                            }}
                                                        >
                                                            Next
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </Table>
                                    </CardBody>
                                </Card>
                                </Col>
                            </Row>
                        )}

                        {searchResults.length === 0 && noRecord !== "" && (
                            <Row>
                                <Col>
                                <Form.Label className="">{noRecord}</Form.Label>
                                </Col>
                            </Row>
                        )}
                    </>
                    )}
                </CardBody>
            </Card>
        </Col>
    );
};

export default ProcedureCode;
